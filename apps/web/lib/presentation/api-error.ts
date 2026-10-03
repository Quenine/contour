const MAX_PUBLIC_MESSAGE_LENGTH = 300;

function safeMessage(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const message = value.trim();
  if (!message || message.length > MAX_PUBLIC_MESSAGE_LENGTH) return undefined;
  for (const character of message) {
    const code = character.charCodeAt(0);
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) return undefined;
  }
  return message;
}

/** Select only short, plain-text error fields from a JSON API response. */
export function apiErrorMessage(body: unknown, fallback = "request failed"): string {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return fallback;
  const record = body as Record<string, unknown>;
  const error = safeMessage(record.error);
  if (error) return error;
  if (Array.isArray(record.issues)) {
    for (const issue of record.issues) {
      const message = safeMessage(issue);
      if (message) return message;
    }
  }
  return fallback;
}
