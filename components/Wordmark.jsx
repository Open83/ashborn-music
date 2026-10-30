// ASHBORN is one uninterrupted word. The two tones are subtle and never separate the name.
export default function Wordmark({ className = "" }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark__ash">ASH</span>
      <span className="wordmark__born">BORN</span>
    </span>
  );
}
