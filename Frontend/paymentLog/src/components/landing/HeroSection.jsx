import { useNavigate, Link } from 'react-router-dom';

const C = { primary: '#583820', dark: '#3D2714', gold: '#D4A853', light: '#FDF6EC', white: '#FFFFFF' };

const stats = [
  { value: '1,200+', label: 'Students Enrolled' },
  { value: '80+', label: 'Qualified Staff' },
  { value: '25+', label: 'Years of Excellence' },
  { value: '3', label: 'School Levels' },
];

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 60%, #7A4F2E 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', paddingTop: '70px'
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(212,168,83,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(212,168,83,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', right: '8%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(212,168,83,0.1)', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ maxWidth: '900px', textAlign: 'center', padding: '0 24px', zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: 'inline-block', background: 'rgba(212,168,83,0.2)', border: `1px solid rgba(212,168,83,0.4)`,
          borderRadius: '50px', padding: '6px 20px', marginBottom: '28px'
        }}>
          <span style={{ color: C.gold, fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>
            NURTURING EXCELLENCE SINCE 1999
          </span>
        </div>

        {/* School Name */}
        <h1 style={{
          color: C.white, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '800',
          lineHeight: '1.1', marginBottom: '8px', letterSpacing: '-1px'
        }}>
          Ore Ofe Oluwa
        </h1>
        <h1 style={{
          color: C.gold, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '800',
          lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px'
        }}>
          Schools
        </h1>

        {/* Tagline */}
        <p style={{
          color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(16px, 2.5vw, 22px)',
          lineHeight: '1.6', maxWidth: '620px', margin: '0 auto 40px', fontStyle: 'italic'
        }}>
          "Building tomorrow's leaders through quality education, moral values, and academic excellence."
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <Link to="/apply" style={{
            background: C.gold, color: C.dark, padding: '14px 32px',
            borderRadius: '50px', fontSize: '16px', fontWeight: '700', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(212,168,83,0.4)', display: 'inline-block'
          }}>
            Apply for Admission
          </Link>
          <button onClick={() => navigate('/student-login')} style={{
            background: 'transparent', color: C.white, border: `2px solid rgba(255,255,255,0.5)`,
            padding: '14px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.target.style.borderColor = C.white; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.background = 'transparent'; }}
          >
            Student Portal
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '24px', maxWidth: '700px', margin: '0 auto'
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px', padding: '20px 12px', backdropFilter: 'blur(4px)'
            }}>
              <div style={{ color: C.gold, fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>{value}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer'
      }} onClick={() => scrollTo('about')}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '1px' }}>SCROLL DOWN</span>
        <div style={{
          width: '24px', height: '40px', border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '12px', display: 'flex', justifyContent: 'center', paddingTop: '6px'
        }}>
          <div style={{
            width: '4px', height: '8px', background: C.gold, borderRadius: '2px',
            animation: 'scrollDot 1.5s infinite'
          }} />
        </div>
        <style>{`
          @keyframes scrollDot {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(12px); opacity: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}
