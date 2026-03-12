import { useState, useRef } from 'react';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_SIGNUP_ID as string | undefined;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isEduEmail(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return isValidEmail(trimmed) && trimmed.endsWith('.edu');
}

async function storeEmail(email: string): Promise<boolean> {
  if (FORMSPREE_ID) {
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _subject: 'mystrangers .edu early signup' }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
  try {
    const key = 'mystrangers_edu_signups';
    const raw = localStorage.getItem(key);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(email.trim().toLowerCase())) list.push(email.trim().toLowerCase());
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export default function EduSignup() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerShake = () => {
    setShake(true);
    const t = setTimeout(() => setShake(false), 600);
    return () => clearTimeout(t);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please enter an email ending in .edu');
      triggerShake();
      inputRef.current?.focus();
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError('Please enter an email ending in .edu');
      triggerShake();
      inputRef.current?.focus();
      return;
    }
    if (!isEduEmail(trimmed)) {
      setError('Please enter your .edu email address.');
      triggerShake();
      inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    const ok = await storeEmail(trimmed);
    setSubmitting(false);
    if (ok) {
      setSuccess(true);
      setValue('');
      setError(null);
    } else {
      setError('Something went wrong. Please try again.');
      triggerShake();
    }
  };

  if (success) {
    return (
      <div className="edu-signup edu-signup--success">
        <div className="edu-signup-input-wrap edu-signup-input-wrap--success">
          <input
            ref={inputRef}
            type="text"
            readOnly
            value="✓ You're on the list!"
            className="edu-signup-input"
            aria-label="Signup success"
          />
        </div>
        <p className="edu-signup-message edu-signup-message--success">
          Congratulations! You are now first in line to signup for mystrangers when we go LIVE.
        </p>
      </div>
    );
  }

  return (
    <form className="edu-signup" onSubmit={handleSubmit} noValidate>
      <div className="edu-signup-row">
        <div className={`edu-signup-input-wrap ${error ? 'edu-signup-input-wrap--error' : ''} ${shake ? 'edu-signup-input-wrap--shake' : ''}`}>
          <input
            ref={inputRef}
            type="email"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null); }}
            placeholder="Enter .edu email address"
            className="edu-signup-input"
            aria-label=".edu email for early signup"
            aria-invalid={!!error}
            aria-describedby={error ? 'edu-signup-error' : undefined}
            disabled={submitting}
            autoComplete="email"
          />
        </div>
        <button type="submit" className="edu-signup-btn" disabled={submitting}>
          {submitting ? '…' : 'Sign Up'}
        </button>
      </div>
      {error && (
        <p id="edu-signup-error" className="edu-signup-message edu-signup-message--error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
