import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const C = {
  primary: '#583820',
  dark: '#3D2714',
  gold: '#D4A853',
  white: '#FFFFFF',
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', action: () => scrollTo('hero') },
    { label: 'About', action: () => scrollTo('about') },
    { label: 'Programs', action: () => scrollTo('programs') },
    { label: 'Admissions', action: () => scrollTo('admissions') },
    { label: 'Contact', action: () => scrollTo('contact') },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? C.dark : 'rgba(61,39,20,0.95)',
      backdropFilter: 'blur(8px)',
      transition: 'background 0.3s ease',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>

          {/* Logo */}
          <button onClick={() => scrollTo('hero')} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: C.gold, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: '800', fontSize: '14px', color: C.dark
            }}>OOS</div>
            <span style={{ color: C.white, fontWeight: '700', fontSize: '16px', lineHeight: '1.2' }}>
              Ore Ofe Oluwa<br />
              <span style={{ color: C.gold, fontSize: '12px', fontWeight: '400' }}>Schools</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
            {navLinks.map(({ label, action }) => (
              <button key={label} onClick={action} style={{
                background: 'none', border: 'none', color: C.white, cursor: 'pointer',
                padding: '8px 14px', borderRadius: '6px', fontSize: '14px', fontWeight: '500',
                transition: 'color 0.2s, background 0.2s'
              }}
                onMouseEnter={e => { e.target.style.color = C.gold; e.target.style.background = 'rgba(212,168,83,0.1)'; }}
                onMouseLeave={e => { e.target.style.color = C.white; e.target.style.background = 'none'; }}
              >{label}</button>
            ))}
            <button onClick={() => navigate('/student-login')} style={{
              background: 'none', border: `1px solid rgba(255,255,255,0.4)`, color: C.white,
              cursor: 'pointer', padding: '7px 14px', borderRadius: '6px', fontSize: '14px',
              marginLeft: '8px', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.color = C.white; }}
            >Student Portal</button>
            <button onClick={() => navigate('/staff-login')} style={{
              background: C.gold, border: 'none', color: C.dark,
              cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', fontSize: '14px',
              fontWeight: '600', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.target.style.background = '#C89040'}
              onMouseLeave={e => e.target.style.background = C.gold}
            >Staff Portal</button>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: '4px', color: C.white
          }} className="hamburger">
            <div style={{ width: '24px', height: '2px', background: menuOpen ? 'transparent' : C.white, position: 'relative', transition: 'all 0.3s' }}>
              <div style={{ position: 'absolute', width: '24px', height: '2px', background: C.white, top: menuOpen ? 0 : '-8px', transform: menuOpen ? 'rotate(45deg)' : 'none', transition: 'all 0.3s' }} />
              <div style={{ position: 'absolute', width: '24px', height: '2px', background: C.white, top: menuOpen ? 0 : '8px', transform: menuOpen ? 'rotate(-45deg)' : 'none', transition: 'all 0.3s' }} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '16px',
            display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            {navLinks.map(({ label, action }) => (
              <button key={label} onClick={action} style={{
                background: 'none', border: 'none', color: C.white, cursor: 'pointer',
                padding: '12px 8px', fontSize: '15px', textAlign: 'left', borderRadius: '6px'
              }}>{label}</button>
            ))}
            <button onClick={() => { setMenuOpen(false); navigate('/student-login'); }} style={{
              background: 'rgba(212,168,83,0.15)', border: `1px solid ${C.gold}`, color: C.gold,
              cursor: 'pointer', padding: '10px 12px', borderRadius: '6px', fontSize: '15px',
              textAlign: 'left', marginTop: '8px'
            }}>Student Portal</button>
            <button onClick={() => { setMenuOpen(false); navigate('/staff-login'); }} style={{
              background: C.gold, border: 'none', color: C.dark,
              cursor: 'pointer', padding: '10px 12px', borderRadius: '6px', fontSize: '15px',
              fontWeight: '600', textAlign: 'left'
            }}>Staff Portal</button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
