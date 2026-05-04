"use client";

import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <nav className={`nav${open ? " open" : ""}`} id="nav" aria-label="primary">
      <a className="nav-mark" href="#top" onClick={close}>
        <span className="glyph" /> Simonel David
      </a>
      <div className="nav-links">
        <a href="#about" onClick={close}>About</a>
        <a href="#pillars" onClick={close}>Practice</a>
        <a href="#timeline" onClick={close}>Timeline</a>
        <a href="#linkedin" onClick={close}>LinkedIn</a>
        <a href="#projects" onClick={close}>Projects</a>
      </div>
      <a className="nav-cta" href="#contact">Get in touch</a>
      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
      </button>
    </nav>
  );
}
