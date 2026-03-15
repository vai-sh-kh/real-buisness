/**
 * Normalize Google Maps URLs to the embeddable format so the map loads correctly in an iframe.
 * - Embed URLs (already .../maps/embed?pb=...) are returned as-is.
 * - View URLs (e.g. .../maps?pb=... or .../maps?q=...) are converted to .../maps/embed?pb=...
 * - Share links (goo.gl/maps, maps.app.goo.gl) are resolved via redirect then converted when possible.
 */

const EMBED_PATH = "/maps/embed";
const VALID_EMBED_HOSTS = ["www.google.com", "google.com", "maps.google.com"];

function isEmbedUrl(url: URL): boolean {
  return url.pathname.toLowerCase().includes(EMBED_PATH);
}

function isGoogleMapsHost(host: string): boolean {
  return VALID_EMBED_HOSTS.includes(host.toLowerCase());
}

/**
 * Converts a Google Maps view URL to the embed format (sync).
 * Use when the URL is already a google.com/maps URL with query params.
 */
export function toEmbedUrlSync(urlString: string): string | null {
  try {
    const trimmed = urlString.trim();
    if (!trimmed) return null;
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();

    if (!isGoogleMapsHost(host)) return null;

    // Already embeddable
    if (isEmbedUrl(url)) return url.toString();

    // View URL: /maps?pb=... or /maps?q=... → /maps/embed?...
    if (url.pathname === "/maps" || url.pathname === "/maps/") {
      const embedUrl = new URL(url);
      embedUrl.pathname = EMBED_PATH;
      return embedUrl.toString();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Normalize a map URL to embed format. Resolves share links (goo.gl, maps.app.goo.gl) by
 * following redirects, then converts to embed when possible. Call from API routes.
 */
export async function normalizeMapUrl(urlString: string | null | undefined): Promise<string | null> {
  const trimmed = urlString?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();

    // Already embed or same-host view URL → sync convert
    if (isGoogleMapsHost(host)) {
      return toEmbedUrlSync(trimmed) ?? trimmed;
    }

    // Share links: follow redirect to get final URL
    if (host === "maps.app.goo.gl" || host === "goo.gl") {
      const res = await fetch(trimmed, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MapEmbedResolver/1.0)" },
      });
      const finalUrl = res.url;
      const final = new URL(finalUrl);
      if (isGoogleMapsHost(final.hostname.toLowerCase())) {
        return toEmbedUrlSync(finalUrl) ?? finalUrl;
      }
      return null;
    }

    return null;
  } catch {
    return trimmed;
  }
}
