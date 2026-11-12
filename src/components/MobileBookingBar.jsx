import { useEffect, useState } from "react";
import { PHONE_HREF } from "../config.js";
import Gear from "./Gear.jsx";

// Sticky bottom bar on phones: keeps "Book a table" within thumb reach from the first screen.
// Slides away while the booking section is on screen so it never covers the form.
// `href` overrides the link target on pages without the booking section (the bar then stays visible).
export default function MobileBookingBar({ targetId = "booking", href = `#${targetId}` }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !("IntersectionObserver" in window)) return;
    // Hide once the section's top rises above the bottom quarter of the viewport
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      rootMargin: "0px 0px -25% 0px",
    });
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div className={`mbar${hidden ? " is-hidden" : ""}`} inert={hidden}>
      <a href={href} className="btn btn--accent mbar__book">
        <Gear className="btn__gear" />
        <span>Забронировать столик</span>
      </a>
      <a href={PHONE_HREF} className="btn btn--ghost mbar__call" aria-label="Позвонить в ресторан">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
    </div>
  );
}
