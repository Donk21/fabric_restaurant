import { getOpenStatus } from "../utils/time.js";

export default function OpenStatus({ now, block = false, live = false }) {
  const { open, text } = getOpenStatus(now);
  const cls = ["status", block && "status--block", open ? "is-open" : "is-closed"].filter(Boolean).join(" ");
  return (
    <div className={cls} aria-live={live ? "polite" : undefined}>
      <span className="status__dot"></span>
      <span className="status__text">{text}</span>
    </div>
  );
}
