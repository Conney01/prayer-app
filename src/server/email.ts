import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSanctuaryEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const data = await resend.emails.send({
      from: 'Sanctuary <support@mysanctuary.live>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(to: string, name?: string | null) {
  const displayName = name ?? "friend";
  const html = `
    <div style="font-family: Georgia, serif; background-color: #fdf0ec; color: #1f3a28; padding: 40px; border-radius: 24px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://mysanctuary.live/icon.jpg" alt="Sanctuary" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #eedad2; box-shadow: 0 4px 12px rgba(31,58,40,0.1);" />
        <br />
        <span style="font-size: 11px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; color: #d4907a; display: inline-block; margin-top: 12px;">Sanctuary &bull; Grace & Stillness</span>
      </div>
      
      <h1 style="color: #1f3a28; font-size: 26px; margin-bottom: 16px; text-align: center;">
        Welcome to Sanctuary, ${displayName}.
      </h1>
      
      <p style="font-family: sans-serif; font-size: 14px; color: #6b635e; line-height: 1.7; text-align: center; margin-bottom: 28px;">
        We are so blessed to have you join our community. Sanctuary is entirely free, open, and designed to give you a quiet corner to anchor your heart, share prayer requests, and find daily peace.
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://mysanctuary.live/dashboard" style="background-color: #2d5a3d; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-size: 13px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(45,90,61,0.2);">
          Enter Sanctuary
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #eedad2; margin: 32px 0;" />
      
      <p style="font-family: sans-serif; font-size: 12px; color: #d4907a; text-align: center; margin: 0;">
        "Your presence here is already a wonderful gift."
      </p>
    </div>
  `;

  return sendSanctuaryEmail({
    to,
    subject: 'Welcome to Sanctuary — A Peaceful Space for Prayer',
    html,
  });
}