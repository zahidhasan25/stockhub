export default function ApertureMark({
  className = "",
  spinning = false,
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${
        spinning ? "animate-spin" : ""
      }`}
    >
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke="currentColor"
        strokeWidth="8"
      />

      <circle
        cx="50"
        cy="50"
        r="12"
        fill="currentColor"
      />

      <path
        d="M50 15L65 40H35L50 15Z"
        fill="currentColor"
      />
    </svg>
  );
}