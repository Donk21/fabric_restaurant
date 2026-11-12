export default function FormField({ label, htmlFor, error, full = false, children }) {
  const cls = ["field", full && "field--full", error && "has-error"].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {error !== undefined && <small className="err">{error}</small>}
    </div>
  );
}
