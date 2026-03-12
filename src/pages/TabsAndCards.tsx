import { useRef, useState, useEffect } from 'react';
import AboutUs from './AboutUs';
import WhatWeDo from './WhatWeDo';
import WhyMystrangers from './WhyMystrangers';
import OurTeam from './OurTeam';

const SECTIONS = [
  { id: 'about', label: 'About Us' },
  { id: 'what', label: 'What we do ...' },
  { id: 'why', label: 'Why mystrangers ?' },
  { id: 'team', label: 'Our Team' },
] as const;

const SWIPE_THRESHOLD = 50;

export default function TabsAndCards() {
  const tablistRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number>(0);

  const goToIndex = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, SECTIONS.length - 1)));
  };

  useEffect(() => {
    const onSwitch = (e: CustomEvent<{ index: number }>) => {
      goToIndex(e.detail.index);
    };
    window.addEventListener('switchToCard', onSwitch as EventListener);
    return () => window.removeEventListener('switchToCard', onSwitch as EventListener);
  }, []);

  useEffect(() => {
    const tablist = tablistRef.current;
    if (!tablist) return;
    const activeTab = tablist.querySelector(`[role="tab"][aria-selected="true"]`);
    if (activeTab) activeTab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStartX.current;
    if (delta < -SWIPE_THRESHOLD) goToIndex(activeIndex + 1);
    else if (delta > SWIPE_THRESHOLD) goToIndex(activeIndex - 1);
  };

  return (
    <section className="tabs-and-cards" aria-label="Content sections">
      <div className="page-tabs" role="tablist" ref={tablistRef}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            className={`page-tab ${activeIndex === i ? 'page-tab--active' : ''}`}
            onClick={() => goToIndex(i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        className="cards-swipe"
        role="tabpanel"
        aria-label="Swipe between sections"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="cards-track"
          ref={trackRef}
          style={{ transform: `translateX(-${activeIndex * 25}%)` }}
        >
          {SECTIONS.map((s, i) => (
            <div key={s.id} className="card" data-card={s.id}>
              {s.id === 'about' && <AboutUs />}
              {s.id === 'what' && <WhatWeDo />}
              {s.id === 'why' && <WhyMystrangers />}
              {s.id === 'team' && <OurTeam />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
