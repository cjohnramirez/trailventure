/** Turns an API error body into one sentence for the UI. */
export async function readApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as Record<string, unknown>;
    const detail = body.detail ?? Object.values(body)[0];
    const message = Array.isArray(detail) ? detail[0] : detail;
    if (typeof message === "string") return message;
  } catch {
    // Fall through to the generic message.
  }
  return "Something went wrong. Please try again.";
}
