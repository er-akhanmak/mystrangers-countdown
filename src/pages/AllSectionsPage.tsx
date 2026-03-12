import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AboutUs from './AboutUs';
import WhatWeDo from './WhatWeDo';
import WhyMystrangers from './WhyMystrangers';
import OurTeam from './OurTeam';

const SECTIONS = [
  { id: 'about', path: '/about', label: 'About Us' },
  { id: 'what', path: '/what', label: 'What we do' },
  { id: 'why', path: '/why', label: 'Why mystrangers' },
  { id: 'team', path: '/team', label: 'Our Team' },
] as const;

export default function AllSectionsPage() {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionId = location.pathname.slice(1) || 'about';
  const [activeId, setActiveId] = useState(sectionId);

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveId(sectionId);
  }, [sectionId]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = e.target.id;
            if (SECTIONS.some((s) => s.id === id)) setActiveId(id);
            break;
          }
        }
      },
      { root: container, rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="all-sections">
      <div className="page-tabs" role="tablist">
        {SECTIONS.map((s) => (
          <Link
            key={s.id}
            to={s.path}
            className={`page-tab ${activeId === s.id ? 'page-tab--active' : ''}`}
            role="tab"
            aria-selected={activeId === s.id}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="page-sections" ref={scrollRef}>
        <section id="about" className="page-section">
          <AboutUs />
        </section>
        <section id="what" className="page-section">
          <WhatWeDo />
        </section>
        <section id="why" className="page-section">
          <WhyMystrangers />
        </section>
        <section id="team" className="page-section">
          <OurTeam />
        </section>
      </div>
    </div>
  );
}
