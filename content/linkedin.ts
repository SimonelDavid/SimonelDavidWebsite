/**
 * LinkedIn content for the "From the field" section.
 *
 * ─── HOW TO ADD A POST ─────────────────────────────────────────────
 * 1. Open your LinkedIn post in a browser.
 * 2. Click the "..." menu on the post → "Embed this post".
 * 3. In the iframe code LinkedIn gives you, find:
 *      src="https://www.linkedin.com/embed/feed/update/urn:li:activity:7XXXXXXXXXXXXXXXXX"
 *    Copy the digits after `urn:li:activity:` - that's the activity ID.
 * 4. Paste it as `activityId` below.
 * 5. The post page URL (e.g. https://www.linkedin.com/feed/update/urn:li:activity:7XXX/)
 *    can also be used directly as `url`.
 *
 * No API key, no auth, no cron job. The site will render LinkedIn's
 * own iframe at runtime; LinkedIn handles styling, accessibility, and
 * cookie consent.
 *
 * If a post should be deleted from the public view, just remove the entry.
 * ──────────────────────────────────────────────────────────────────
 */

export type LinkedInPost = {
  /** The 19-digit activity ID from urn:li:activity:XXXXXXXXXX */
  activityId?: string;
  /** Direct post URL (used as fallback link if no activityId) */
  url: string;
  /** Date label shown on the card e.g. "Mar 2026 · Munich" */
  date: string;
  /** Card headline */
  title: string;
  /** Short blurb */
  body: string;
  /** Local image path under /public/assets, or null for a hatched placeholder */
  image: string | null;
  /** Card size in the responsive grid */
  size: "lg" | "md" | "sm" | "tall" | "wide";
};

/** Personal LinkedIn profile URL - used as fallback CTA. */
export const LINKEDIN_PROFILE = "https://www.linkedin.com/in/simoneldavid/";

/**
 * The big "Latest from LinkedIn" embed at the top of the section.
 *
 * Set `activityId` to render the official LinkedIn iframe. Leave empty
 * to show a styled fallback card that links to the profile.
 *
 * Recommended height matches LinkedIn's own embed sizes (around 540 / 600 / 700).
 */
export const LATEST_POST: {
  activityId?: string;
  height?: number;
  headline: string;
  url: string;
} = {
  // TODO: paste your activity ID here when you want a live embed.
  // activityId: "7000000000000000000",
  height: 600,
  headline:
    "Representing Romania's space ambition at TUM Munich - a continuation of the work that started as Community Manager four years ago.",
  url: LINKEDIN_PROFILE,
};

/**
 * Fallback highlight cards (most-recent first) used when the live feed is
 * unavailable. Live builds replace this list with the 6 most recent posts
 * fetched from `LINKEDIN_FEED_URL`.
 */
export const POSTS: LinkedInPost[] = [
  {
    url: LINKEDIN_PROFILE,
    date: "Apr 2026 · Munich",
    title: "Representing the Romanian space ecosystem at TUM",
    body: "Presenting ROSPIN's vision to an international audience at the Technical University of Munich.",
    image: "/assets/event-rospin-ecosystem-tum.jpg",
    size: "lg",
  },
  {
    url: LINKEDIN_PROFILE,
    date: "Apr 2026 · Cluj-Napoca",
    title: "Mentor at Cluj Startups",
    body: "Joined the Cluj Startups mentor wall to support early-stage founders on product and cloud architecture.",
    image: "/assets/cluj-startups-mentor.jpg",
    size: "md",
  },
  {
    url: LINKEDIN_PROFILE,
    date: "Feb 2026 · FAST Conference",
    title: "The AIM-Space EO Platform: turning satellite data into product",
    body: "What it takes to translate pixels into a roadmap customers can buy.",
    image: "/assets/event-aim-space.jpg",
    size: "md",
  },
  {
    url: LINKEDIN_PROFILE,
    date: "Dec 2025 · Sibiu",
    title: "Defense-X Winner · EOSec",
    body: "What we built in 48 hours: SAR + multispectral monitoring for critical infrastructure and border-change detection.",
    image: "/assets/event-defense-x-winning-teams.jpg",
    size: "tall",
  },
  {
    url: LINKEDIN_PROFILE,
    date: "2025 · CNCF Cluj-Napoca",
    title: "Kubernetes Autoscaling: The Road to Karpenter",
    body: "Speaker recap from RebelDot. Efficient infrastructure without the guesswork.",
    image: "/assets/event-cncf-cluj.jpg",
    size: "md",
  },
  {
    url: LINKEDIN_PROFILE,
    date: "Jan 2025 · Madrid",
    title: "ESA Datalabs · Ariel Hackathon",
    body: "Three days, one ML model for instrument noise analysis on the Ariel exoplanet mission.",
    image: "/assets/event-ariel-hackathon-madrid.jpg",
    size: "wide",
  },
];
