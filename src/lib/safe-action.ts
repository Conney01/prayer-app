export async function safeAction<T>(
  action: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error: unknown) {
    console.error("Action execution error:", error);
    
    let errorMessage = "An unexpected server error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return { 
      success: false, 
      error: errorMessage 
    };
  }
}