/**
 * Build-time LinkedIn fetch.
 *
 * This module reads `LINKEDIN_FEED_URL` (an RSS or JSON URL produced by a
 * third-party LinkedIn aggregator) and parses it into our `LinkedInPost`
 * shape. It runs on the server during `next build` and the result is
 * baked into the static HTML.
 *
 * If the env var is missing or the fetch/parse fails, we fall back to
 * the curated `POSTS` array in `content/linkedin.ts` so the site is
 * always renderable.
 *
 * Supported sources (auto-detected by content-type / shape):
 *   • RSS / Atom XML  (e.g. rss.app, FetchRSS, fetchrss.com)
 *   • JSON Feed v1    (https://www.jsonfeed.org/)
 *   • SociableKIT JSON API
 *
 * No client-side calls. No API keys ever leave the server.
 */

import { LinkedInPost, POSTS as FALLBACK_POSTS, LATEST_POST as FALLBACK_LATEST } from "@/content/linkedin";

const FEED_URL = process.env.LINKEDIN_FEED_URL;
const PROFILE_URL = "https://www.linkedin.com/in/simoneldavid/";

const SIZE_PATTERN: LinkedInPost["size"][] = ["lg", "md", "md", "tall", "md", "wide"];
const MAX_POSTS = 6;

// ─── parsing helpers ─────────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function stripCdata(s: string): string {
  const m = s.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return m ? m[1] : s;
}

function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>\s*<p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string): string | null {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i");
  const m = item.match(re);
  if (!m) return null;
  return decodeEntities(stripCdata(m[1].trim()));
}

function attr(item: string, name: string, attrName: string): string | null {
  const re = new RegExp(`<${name}\\s+[^>]*?${attrName}=\"([^\"]+)\"`, "i");
  const m = item.match(re);
  return m ? m[1] : null;
}

function extractActivityId(url: string): string | undefined {
  const m = url.match(/urn:li:activity:(\d+)/) || url.match(/activity-(\d+)/);
  return m ? m[1] : undefined;
}

function formatDate(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function deriveTitle(text: string): string {
  // LinkedIn RSS feeds tend to put the full body in <title>; pull the first
  // sentence/line as the card headline.
  const firstLine = text.split(/\n|\.\s/).map((l) => l.trim()).filter(Boolean)[0] || text;
  return firstLine.length > 90 ? firstLine.slice(0, 87) + "…" : firstLine;
}

function trimBody(text: string, max = 200): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

// ─── RSS / Atom parser ───────────────────────────────────────────────

function parseRss(xml: string): LinkedInPost[] {
  const isAtom = /<feed[\s>]/i.test(xml);
  const itemRe = isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi;
  const items = xml.match(itemRe) || [];
  if (!items.length) return [];

  return items.slice(0, MAX_POSTS).map((item, i): LinkedInPost => {
    const title = tag(item, "title") || "";
    let link = "";
    if (isAtom) {
      const m = item.match(/<link[^>]*href="([^"]+)"/i);
      link = m ? m[1] : "";
    } else {
      link = tag(item, "link") || "";
    }
    const pubDate = tag(item, "pubDate") || tag(item, "published") || tag(item, "dc:date") || "";
    const rawDescription =
      tag(item, "content:encoded") || tag(item, "description") || tag(item, "summary") || "";
    const bodyText = stripHtml(rawDescription);

    const image =
      attr(item, "media:content", "url") ||
      attr(item, "media:thumbnail", "url") ||
      attr(item, "enclosure", "url") ||
      // Some feeds embed the image as an <img> in the description
      (rawDescription.match(/<img[^>]+src="([^"]+)"/i)?.[1] ?? null);

    const activityId = extractActivityId(link);
    const headline = deriveTitle(title || bodyText);
    const body = trimBody(bodyText || title);

    return {
      activityId,
      url: link || PROFILE_URL,
      date: formatDate(pubDate),
      title: headline,
      body,
      image,
      size: SIZE_PATTERN[i] ?? "md",
    };
  });
}

// ─── JSON parsers ────────────────────────────────────────────────────

interface AnyJsonItem {
  // Generic shapes
  url?: string;
  link?: string;
  external_url?: string;
  title?: string;
  text?: string;
  content_text?: string;
  content_html?: string;
  summary?: string;
  description?: string;
  date_published?: string;
  pubDate?: string;
  date?: string;
  image?: string;
  banner_image?: string;
  thumbnail_url?: string;
  media?: { url?: string }[] | { url?: string };
  // SociableKIT / AccentAPI specific (LinkedIn profile posts feed)
  id?: string;
  post_date_time?: string;
  post_date?: string;
  images?: string[];
  images_sk_img?: string[];
  thumbnail_sk_img?: string;
  video_url?: string;
  reposted?: string | number;
  shared_post_description?: string;
}

function parseJson(json: unknown): LinkedInPost[] {
  // Accept several shapes:
  //   - JSON Feed v1: { items: [...] }
  //   - SociableKIT / AccentAPI: { posts: [...] }
  //   - Plain array
  //   - { data: [...] }
  let arr: AnyJsonItem[] = [];
  if (Array.isArray(json)) arr = json as AnyJsonItem[];
  else if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    if (Array.isArray(o.items)) arr = o.items as AnyJsonItem[];
    else if (Array.isArray(o.posts)) arr = o.posts as AnyJsonItem[];
    else if (Array.isArray(o.data)) arr = o.data as AnyJsonItem[];
  }
  if (!arr.length) return [];

  // Drop reposts (SociableKIT marks them with `reposted: "1"`) so the section
  // shows only original posts authored by the profile owner. Reposts of other
  // people's content shouldn't appear on a personal portfolio.
  const ownPosts = arr.filter((it) => {
    const r = it.reposted;
    if (r === undefined || r === null) return true;
    if (typeof r === "string") return r !== "1";
    if (typeof r === "number") return r !== 1;
    return true;
  });

  // SociableKIT data is already sorted newest-first by `order` (= post_date_time desc).
  return ownPosts.slice(0, MAX_POSTS).map((it, i): LinkedInPost => {
    // SociableKIT / AccentAPI activity ID → official LinkedIn post URL
    const skId = it.id && /^\d{10,}$/.test(it.id) ? it.id : undefined;
    const link =
      it.url ||
      it.link ||
      it.external_url ||
      (skId ? `https://www.linkedin.com/feed/update/urn:li:activity:${skId}/` : PROFILE_URL);

    const title = it.title || "";
    const body = stripHtml(
      it.content_text ||
        it.summary ||
        it.description ||
        it.content_html ||
        it.shared_post_description ||
        ""
    );
    const date =
      it.date_published ||
      it.pubDate ||
      it.post_date_time ||
      it.post_date ||
      it.date ||
      "";

    // Prefer SociableKIT's mirrored image (more reliable than LinkedIn signed URLs).
    const skMirror =
      (Array.isArray(it.images_sk_img) && it.images_sk_img[0]) ||
      it.thumbnail_sk_img ||
      "";
    const liOriginal =
      it.image ||
      it.banner_image ||
      it.thumbnail_url ||
      (Array.isArray(it.images) && it.images[0]) ||
      (Array.isArray(it.media) ? it.media[0]?.url : (it.media as { url?: string } | undefined)?.url) ||
      "";
    const image: string | null = skMirror || liOriginal || null;

    const activityId = skId ?? extractActivityId(link);

    return {
      activityId,
      url: link,
      date: formatDate(date),
      title: deriveTitle(title || body),
      body: trimBody(body || title),
      image,
      size: SIZE_PATTERN[i] ?? "md",
    };
  });
}

// ─── public API ──────────────────────────────────────────────────────

export interface FeedResult {
  posts: LinkedInPost[];
  latest: { activityId?: string; headline: string; url: string; height?: number };
  source: "live" | "fallback";
}

export async function fetchLinkedInPosts(): Promise<FeedResult> {
  if (!FEED_URL) {
    return {
      posts: FALLBACK_POSTS,
      latest: FALLBACK_LATEST,
      source: "fallback",
    };
  }

  try {
    const res = await fetch(FEED_URL, {
      // Build-time fetch - short revalidate for ISR hosts; harmless for static export.
      next: { revalidate: 14400 }, // 4 hours
      headers: { "user-agent": "simoneldavid.com build (Next.js)" },
    });
    if (!res.ok) throw new Error(`Feed returned HTTP ${res.status}`);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    let posts: LinkedInPost[] = [];
    if (ct.includes("json")) {
      posts = parseJson(await res.json());
    } else {
      const body = await res.text();
      // Auto-detect: even if content-type lies, sniff the payload
      if (body.trim().startsWith("{") || body.trim().startsWith("[")) {
        posts = parseJson(JSON.parse(body));
      } else {
        posts = parseRss(body);
      }
    }
    if (!posts.length) throw new Error("Feed parsed but contained no posts");

    const head = posts[0];
    return {
      posts,
      latest: {
        activityId: head.activityId,
        headline: head.title || FALLBACK_LATEST.headline,
        url: head.url || PROFILE_URL,
        height: 600,
      },
      source: "live",
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[linkedinFeed] Live fetch failed (${(err as Error).message}). ` +
        `Falling back to manual posts in content/linkedin.ts.`
    );
    return {
      posts: FALLBACK_POSTS,
      latest: FALLBACK_LATEST,
      source: "fallback",
    };
  }
}
