import { expect, type APIRequestContext } from "@playwright/test";

const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://localhost:8025";

type MailpitSummary = { ID: string; Subject: string; Created: string };

/** Waits for the newest email to `to` whose subject contains `subject`, and returns its 6-digit code. */
export async function readCodeFromEmail(
  request: APIRequestContext,
  to: string,
  subject: string,
): Promise<string> {
  let code: string | undefined;
  await expect
    .poll(
      async () => {
        const search = await request.get(`${MAILPIT_URL}/api/v1/search`, {
          params: { query: `to:"${to}" subject:"${subject}"`, limit: "1" },
        });
        const { messages } = (await search.json()) as { messages: MailpitSummary[] };
        if (!messages.length) return null;
        const message = await request.get(`${MAILPIT_URL}/api/v1/message/${messages[0].ID}`);
        const { Text } = (await message.json()) as { Text: string };
        code = Text.match(/^\s+(\d{6})\s*$/m)?.[1];
        return code ?? null;
      },
      { timeout: 15_000, message: `waiting for "${subject}" email to ${to}` },
    )
    .not.toBeNull();
  return code!;
}

export function uniqueEmail(label: string) {
  return `${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}
