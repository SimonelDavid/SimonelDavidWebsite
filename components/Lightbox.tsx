"use client";

import { useEffect, useState } from "react";

export default function Lightbox() {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".proj-card[data-video]");
    const handlers: { el: HTMLElement; fn: (e: MouseEvent) => void }[] = [];
    cards.forEach((card) => {
      const fn = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("a")) return;
        const id = card.dataset.video;
        if (id) setVideoId(id);
      };
      card.addEventListener("click", fn);
      handlers.push({ el: card, fn });
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVideoId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = videoId ? "hidden" : "";
  }, [videoId]);

  return (
    <div
      className={`lightbox${videoId ? " open" : ""}`}
      aria-hidden={!videoId}
      onClick={(e) => {
        if (e.target === e.currentTarget) setVideoId(null);
      }}
    >
      <div className="frame">
        <button className="close" onClick={() => setVideoId(null)}>
          Close <span>✕</span>
        </button>
        {videoId && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
