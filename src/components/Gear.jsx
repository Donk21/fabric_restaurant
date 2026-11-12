export default function Gear({ className }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href="#gear" />
    </svg>
  );
}
