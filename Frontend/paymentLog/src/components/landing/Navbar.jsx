import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const portalsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (portalsRef.current && !portalsRef.current.contains(e.target)) {
        setPortalsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', action: () => scrollTo('hero') },
    { label: 'About', action: () => scrollTo('story') },
    { label: 'Admissions', action: () => scrollTo('admissions') },
    { label: 'Contact', action: () => scrollTo('contact') },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 h-20 transition-shadow duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
      <div className="flex justify-between items-center max-w-[1280px] mx-auto px-margin-desktop h-full">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline" onClick={() => scrollTo('hero')}>
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
          <span className="font-serif text-2xl font-semibold text-primary tracking-tight">ORE OFE OLUWA SCHOOLS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, action }) => (
            <button key={label} onClick={action}
              className="text-on-surface-variant font-sans font-semibold text-sm tracking-widest hover:text-on-surface transition-colors duration-300 bg-transparent border-none cursor-pointer uppercase"
            >{label}</button>
          ))}

          {/* Portals dropdown */}
          <div ref={portalsRef} className="relative">
            <button
              onClick={() => setPortalsOpen(p => !p)}
              className="bg-primary text-on-primary px-6 py-2 font-sans font-semibold text-sm tracking-widest uppercase hover:brightness-110 active:opacity-80 transition-all cursor-pointer border-none"
            >
              PORTALS
            </button>
            {portalsOpen && (
              <div className="absolute top-full right-0 mt-1 bg-surface-container border border-outline-variant/40 py-2 min-w-[180px] shadow-2xl z-10">
                <Link to="/student-login"
                  onClick={() => setPortalsOpen(false)}
                  className="flex items-center gap-2 px-5 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-sans text-sm tracking-wide no-underline transition-colors"
                >
                  <span className="material-symbols-outlined text-base">school</span>
                  Student Portal
                </Link>
                <Link to="/staff-login"
                  onClick={() => setPortalsOpen(false)}
                  className="flex items-center gap-2 px-5 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-sans text-sm tracking-wide no-underline transition-colors"
                >
                  <span className="material-symbols-outlined text-base">manage_accounts</span>
                  Staff Portal
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer text-on-surface p-2"
          onClick={() => setMobileOpen(p => !p)}
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container border-t border-outline-variant/30 px-margin-mobile py-4 space-y-1">
          {navLinks.map(({ label, action }) => (
            <button key={label} onClick={() => { action(); setMobileOpen(false); }}
              className="block w-full text-left px-4 py-3 text-on-surface-variant hover:text-primary font-sans text-sm tracking-widest uppercase bg-transparent border-none cursor-pointer"
            >{label}</button>
          ))}
          <div className="pt-2 space-y-2">
            <Link to="/student-login" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 border border-outline text-on-surface font-sans text-sm text-center no-underline hover:bg-surface-container-high transition-colors"
            >Student Portal</Link>
            <Link to="/staff-login" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 bg-primary text-on-primary font-sans font-semibold text-sm text-center no-underline hover:brightness-110 transition-all"
            >Staff Portal</Link>
          </div>
        </div>
      )}
    </header>
  );
}
