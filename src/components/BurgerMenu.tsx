import { useState, useRef, useEffect } from 'react';

const SECTIONS = [
  { id: 'about', label: 'About Us', index: 0 },
  { id: 'what', label: 'What we do', index: 1 },
  { id: 'why', label: 'Why mystrangers ?', index: 2 },
  { id: 'team', label: 'Our Team', index: 3 },
] as const;

function scrollToTabsAndCard(cardIndex: number) {
  const el = document.querySelector('.tabs-and-cards');
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('switchToCard', { detail: { index: cardIndex } }));
    }, 500);
  }
}

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div className="burger-wrap" ref={panelRef}>
      <button
        type="button"
        className="burger-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="burger-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <span className="burger-bar" data-open={open} />
        <span className="burger-bar" data-open={open} />
        <span className="burger-bar" data-open={open} />
      </button>
      <div
        id="burger-panel"
        className="burger-panel"
        data-open={open}
        role="dialog"
        aria-label="Navigation menu"
      >
        <nav className="burger-nav">
          <button
            type="button"
            className="burger-link"
            onClick={() => {
              setOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Home
          </button>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="burger-link"
              onClick={() => {
                setOpen(false);
                scrollToTabsAndCard(s.index);
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
