import { useState, useEffect, useRef } from 'react';

const TARGET = new Date('2026-04-21T00:00:00');

const QUOTES: { quote: string; author: string }[] = [
  {
    quote: 'Innovation distinguishes a leader from a follower.',
    author: 'Steve Jobs',
  },
  {
    quote: 'Imagination is more important than knowledge.',
    author: 'Albert Einstein',
  },
  {
    quote: 'The present is theirs; the future is mine.',
    author: 'Nikola Tesla',
  },
  {
    quote: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
  },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeLeft(now: Date) {
  const d = TARGET.getTime() - now.getTime();
  if (d <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(d / (1000 * 60 * 60 * 24));
  const hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((d % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, done: false };
}

interface UnitBlockProps {
  value: string;
  label: string;
  quote: string;
  author: string;
  isFlipped: boolean;
  onFlip: () => void;
}

function UnitBlock({ value, label, quote, author, isFlipped, onFlip }: UnitBlockProps) {
  return (
    <button
      type="button"
      className={`countdown-unit ${isFlipped ? 'countdown-unit--flipped' : ''}`}
      onClick={onFlip}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? `Show ${label}` : `Flip to see quote about innovation`}
    >
      <div className="countdown-unit-inner">
        <div className="countdown-unit-front">
          <span className="countdown-value" data-value={value}>
            {value}
          </span>
          <span className="countdown-label">{label}</span>
        </div>
        <div className="countdown-unit-back">
          <p className="countdown-quote">{quote}</p>
          <span className="countdown-quote-author">— {author}</span>
        </div>
      </div>
    </button>
  );
}

/** Inline one-line countdown for compact header */
function CompactCountdown({ left }: { left: ReturnType<typeof getTimeLeft> }) {
  if (left.done) {
    return <span className="countdown-inline countdown-inline--done">Live</span>;
  }
  return (
    <span className="countdown-inline">
      {left.days}d {pad(left.hours)}:{pad(left.minutes)}:{pad(left.seconds)}
    </span>
  );
}

export default function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date());
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const left = getTimeLeft(now);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Flip back on click outside the countdown units */
  useEffect(() => {
    if (flippedIndex === null) return;
    const handleClick = (e: MouseEvent) => {
      const el = countdownRef.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) {
        setFlippedIndex(null);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [flippedIndex]);

  /* Flip back when user scrolls */
  useEffect(() => {
    if (flippedIndex === null) return;
    const handleScroll = () => setFlippedIndex(null);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [flippedIndex]);

  const handleFlip = (index: number) => {
    setFlippedIndex((prev) => (prev === index ? null : index));
  };

  if (compact) {
    return (
      <div className="countdown countdown--compact">
        <CompactCountdown left={left} />
      </div>
    );
  }

  if (left.done) {
    return (
      <div className="countdown countdown-done">
        <p className="countdown-message">mystrangers is live.</p>
      </div>
    );
  }

  const units = [
    { value: String(left.days), label: 'Days' },
    { value: pad(left.hours), label: 'Hours' },
    { value: pad(left.minutes), label: 'Minutes' },
    { value: pad(left.seconds), label: 'Seconds' },
  ];

  return (
    <div className="countdown" ref={countdownRef}>
      <div className="countdown-grid">
        {units.map((u, i) => (
          <UnitBlock
            key={u.label}
            value={u.value}
            label={u.label}
            quote={QUOTES[i].quote}
            author={QUOTES[i].author}
            isFlipped={flippedIndex === i}
            onFlip={() => handleFlip(i)}
          />
        ))}
      </div>
      <p className="countdown-to">Countdown until mystrangers is LIVE</p>
    </div>
  );
}
