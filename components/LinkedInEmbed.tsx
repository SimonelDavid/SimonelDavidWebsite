"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface FeaturedPost {
  date?: string;
  title?: string;
  body?: string;
  image?: string | null;
  url?: string;
}

interface Props {
  activityId?: string;
  height?: number;
  url: string;
  headline: string;
  /**
   * If `activityId` is missing, the right-side panel renders this post as a
   * styled "featured" card instead of an empty placeholder, so the section
   * looks finished out of the box.
   */
  featured?: FeaturedPost;
  /**
   * "live" when the data was fetched from LINKEDIN_FEED_URL, "fallback" when
   * it came from the curated content/linkedin.ts. Drives the panel labels.
   */
  source?: "live" | "fallback";
}

/**
 * The "Latest from LinkedIn" panel.
 *
 * • If `activityId` is provided, mounts LinkedIn's official iframe lazily
 *   (only once the panel scrolls near the viewport).
 * • Otherwise renders `featured` as a rich social-style card.
 *
 * No client-side LinkedIn API calls.
 */
export default function LinkedInEmbed({
  activityId,
  height = 600,
  url,
  headline,
  featured,
  source = "fallback",
}: Props) {
  const labelText = source === "live" ? "Latest from LinkedIn" : "Featured highlight";
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!activityId) return;
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [activityId]);

  // ─── live iframe path ───────────────────────────────────────────────
  if (activityId) {
    const src = `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`;
    return (
      <div className="li-latest reveal delay-1" ref={wrapRef}>
        <div className="meta">
          <div className="label">{labelText}</div>
          <h3>{headline}</h3>
          <a className="read" href={url} target="_blank" rel="noopener">
            Read on LinkedIn <span className="arrow">→</span>
          </a>
        </div>
        <div className="embed embed-iframe" style={{ minHeight: height }}>
          {shouldLoad ? (
            <iframe
              src={src}
              height={height}
              title="LinkedIn post"
              loading="lazy"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="ph" aria-hidden="true">
              <b>Loading post...</b>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── featured-card fallback (no activityId / no live feed) ──────────
  const f = featured || {};
  const featuredUrl = f.url || url;
  return (
    <div className="li-latest reveal delay-1">
      <div className="meta">
        <div className="label">Latest from LinkedIn</div>
        <h3>{headline}</h3>
        <a className="read" href={url} target="_blank" rel="noopener">
          Read on LinkedIn <span className="arrow">→</span>
        </a>
      </div>
      <a className="embed embed-feature" href={featuredUrl} target="_blank" rel="noopener">
        {f.image && (
          <div className="feature-img">
            <Image
              src={f.image}
              alt=""
              fill
              sizes="(max-width:900px) 100vw, 50vw"
              unoptimized={f.image.startsWith("http")}
            />
          </div>
        )}
        <div className="feature-body">
          {f.date && <div className="feature-date">{f.date}</div>}
          {f.title && <div className="feature-title">{f.title}</div>}
          {f.body && <p className="feature-text">{f.body}</p>}
          <span className="feature-cta">
            View on LinkedIn <span className="arrow">↗</span>
          </span>
        </div>
      </a>
    </div>
  );
}
