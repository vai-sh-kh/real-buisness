/**
 * Parse database errors (e.g. unique constraint violations) into user-friendly messages.
 * Supabase/PostgREST returns errors with code "23505" for unique_violation.
 */

export interface DbErrorLike {
  code?: string;
  message?: string;
  details?: string;
}

const UNIQUE_VIOLATION_CODE = "23505";

const FRIENDLY_MESSAGES: Record<string, string> = {
  categories_name_unique: "A category with this name already exists. Please choose a different name.",
  categories_slug_unique: "A category with this URL slug already exists.",
  properties_title_unique: "A property with this title already exists. Please choose a different title.",
  properties_slug_unique: "A property with this URL slug already exists.",
  amenities_name_unique: "An amenity with this name already exists. Please choose a different name.",
  amenities_slug_unique: "An amenity with this URL slug already exists.",
};

function getFriendlyMessageForConstraint(constraintOrMessage: string): string | null {
  const lower = constraintOrMessage.toLowerCase();
  if (lower.includes("categories_name") || lower.includes("category") && lower.includes("name"))
    return FRIENDLY_MESSAGES.categories_name_unique;
  if (lower.includes("categories_slug")) return FRIENDLY_MESSAGES.categories_slug_unique;
  if (lower.includes("properties_title") || lower.includes("property") && lower.includes("title"))
    return FRIENDLY_MESSAGES.properties_title_unique;
  if (lower.includes("properties_slug")) return FRIENDLY_MESSAGES.properties_slug_unique;
  if (lower.includes("amenities_name") || lower.includes("amenity") && lower.includes("name"))
    return FRIENDLY_MESSAGES.amenities_name_unique;
  if (lower.includes("amenities_slug")) return FRIENDLY_MESSAGES.amenities_slug_unique;
  return null;
}

/** User-facing message when DB connection fails (use for 503 responses). */
export const CONNECTION_UNAVAILABLE_MESSAGE =
  "Database connection unavailable. Please check your configuration (Supabase URL and keys) or try again later.";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation when it fails with a connection-type error (e.g. cold start, brief network blip).
 * Reduces intermittent 503s after refresh or first load.
 */
export async function withConnectionRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delayMs?: number } = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? 2;
  const delayMs = options.delayMs ?? 400;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isConnection = msg === CONNECTION_UNAVAILABLE_MESSAGE || isConnectionError(msg);
      if (!isConnection || attempt === maxRetries) throw err;
      await sleep(delayMs);
    }
  }
  throw lastErr;
}

const CONNECTION_ERROR_MESSAGES = [
  "fetch failed",
  "network",
  "connection refused",
  "econnrefused",
  "enotfound",
  "etimedout",
  "failed to fetch",
];

export function isConnectionError(message: string): boolean {
  const lower = message.toLowerCase();
  return CONNECTION_ERROR_MESSAGES.some((m) => lower.includes(m));
}

/**
 * Convert a database error into a user-friendly message.
 * Returns the friendly message if it's a known constraint violation or connection error, otherwise the original message.
 */
export function toUserFriendlyMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";

  const dbErr = error as DbErrorLike;
  const code = dbErr?.code;
  const message = dbErr?.message ?? (error instanceof Error ? error.message : String(error));
  const normalized = typeof message === "string" ? message : String(message);

  if (isConnectionError(normalized)) {
    return CONNECTION_UNAVAILABLE_MESSAGE;
  }

  if (code === UNIQUE_VIOLATION_CODE || normalized.includes("violates unique constraint")) {
    const friendly = getFriendlyMessageForConstraint(normalized + (dbErr?.details ?? ""));
    if (friendly) return friendly;
    return "This value already exists. Please use a different one.";
  }

  return normalized || "Something went wrong. Please try again.";
}
