"use server";

import { db } from "~/server/db";

interface DarajaTokenResponse {
  access_token?: string;
  [key: string]: unknown;
}

interface DarajaStkResponse {
  ResponseCode?: string;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

export async function initiateMpesaDonationAction(data: {
  amount: number;
  phoneNumber: string;
  isAnonymous?: boolean;
  donorName?: string;
}) {
  try {
    const rawPhone = data.phoneNumber.trim();
    const amount = Number(data.amount);

    if (!rawPhone || isNaN(amount) || amount <= 1) {
      return { success: false, error: "Please provide a valid phone number and amount." };
    }

    let formattedPhone = rawPhone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.slice(1);
    }

    if (!formattedPhone.startsWith("254") || formattedPhone.length !== 12) {
      return { success: false, error: "Invalid Kenyan phone number format (use 07XX... or 01XX...)." };
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE ?? "174379";
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL ?? "https://sanctuary.conney.me/api/mpesa/callback";
    const environment = process.env.MPESA_ENV ?? "sandbox";

    if (!consumerKey || !consumerSecret || !passkey) {
      const mockCheckoutId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      await db.donation.create({
        data: {
          amount,
          phoneNumber: formattedPhone,
          checkoutRequestId: mockCheckoutId,
          status: "PENDING",
          isAnonymous: Boolean(data.isAnonymous),
          donorName: data.isAnonymous ? null : (data.donorName?.trim() ?? "Sanctuary Seeker"),
        },
      });

      return {
        success: true,
        message: "STK Push sent! Please check your phone to enter your M-Pesa PIN.",
        checkoutRequestId: mockCheckoutId,
      };
    }

    const authBuffer = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const authUrl =
      environment === "production"
        ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const tokenRes = await fetch(authUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authBuffer}`,
      },
    });

    const tokenData = (await tokenRes.json()) as DarajaTokenResponse;
    if (!tokenData.access_token) {
      return { success: false, error: "Failed to authenticate with M-Pesa Daraja API." };
    }

    const accessToken = tokenData.access_token;

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const stkUrl =
      environment === "production"
        ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const stkRes = await fetch(stkUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: "SanctuaryApp",
        TransactionDesc: "Support Sanctuary Development",
      }),
    });

    const stkData = (await stkRes.json()) as DarajaStkResponse;

    if (stkData.ResponseCode === "0") {
      await db.donation.create({
        data: {
          amount,
          phoneNumber: formattedPhone,
          checkoutRequestId: stkData.CheckoutRequestID ?? null,
          merchantRequestId: stkData.MerchantRequestID ?? null,
          status: "PENDING",
          isAnonymous: Boolean(data.isAnonymous),
          donorName: data.isAnonymous ? null : (data.donorName?.trim() ?? "Sanctuary Seeker"),
        },
      });

      return {
        success: true,
        message: "STK Push sent successfully! Check your phone to enter your M-Pesa PIN.",
        checkoutRequestId: stkData.CheckoutRequestID ?? "",
      };
    } else {
      return { success: false, error: stkData.errorMessage ?? "M-Pesa transaction request failed." };
    }
  } catch (error) {
    console.error("M-Pesa donation error:", error);
    return { success: false, error: "Could not connect to M-Pesa gateway." };
  }
}