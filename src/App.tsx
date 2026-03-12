import { useEffect, useState } from 'react';
import MystrangersLogo from './components/MystrangersLogo';
import CountdownTimer from './components/CountdownTimer';
import BurgerMenu from './components/BurgerMenu';
import TabsAndCards from './pages/TabsAndCards';
import headerLogoIcon from './assets/mystr-logo-icon2-thick.PNG';
import './App.css';

const BURGER_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 56;
const HERO_COMPACT_HEIGHT = 440;
/** Scroll distance (px) over which hero transitions from full to compact */
const HERO_SCROLL_RANGE = 520;

function App() {
  const [scrollY, setScrollY] = useState(0);
  const progress = Math.min(1, scrollY / HERO_SCROLL_RANGE);

  /* Always start at top on load/refresh so view matches "Home" */
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`page ${scrollY > 40 ? 'scrolled' : ''}`}
      style={
        {
          '--burger-height': `${BURGER_BAR_HEIGHT}px`,
          '--header-height': `${HEADER_HEIGHT}px`,
          '--hero-compact-height': `${HERO_COMPACT_HEIGHT}px`,
          '--hero-progress': progress,
        } as React.CSSProperties
      }
    >
      {/* Fixed header: logo (home) left, burger right */}
      <header className="app-header">
        <button
          type="button"
          className="header-logo-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Home"
        >
          <img
            src={headerLogoIcon}
            alt=""
            className="header-logo-icon"
          />
        </button>
        <BurgerMenu />
      </header>

      {/* Hero: scroll-driven, shrinks and moves up; sits below header */}
      <div
        className={`hero-wrapper hero-wrapper--scroll ${progress >= 0.9 ? 'hero-wrapper--at-top' : ''} ${progress >= 0.98 ? 'hero-wrapper--pinned' : ''}`}
      >
        <div className="hero">
          <div className="hero-logo-wrap">
            <MystrangersLogo fluid />
          </div>
          <CountdownTimer />
        </div>
      </div>

      {/* Spacer: allows user to scroll and see hero transition */}
      <div className="hero-spacer" aria-hidden />

      {/* Tabs + horizontal card swipe (4 sections) */}
      <TabsAndCards />
    </div>
  );
}

export default App;
