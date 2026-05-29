import { useNavigate } from 'react-router-dom';

const C = { primary: '#583820', dark: '#2D1B10', gold: '#D4A853', white: '#FFFFFF' };

export default function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const year = new Date().getFullYear();

  return (
    <footer style={{ background: C.dark, color: C.white, padding: '60px 24px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', paddingBottom: '48px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', background: C.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '13px', color: C.dark
              }}>OOS</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>Ore Ofe Oluwa</div>
                <div style={{ color: C.gold, fontSize: '12px' }}>Schools</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              Nurturing excellence and building future leaders through quality education and moral values since 1999.
            </p>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              <div>📞 +234 800 000 0000</div>
              <div style={{ marginTop: '6px' }}>✉️ info@orofoluwa.edu.ng</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: C.gold, fontWeight: '700', marginBottom: '16px', fontSize: '14px', letterSpacing: '0.5px' }}>
              QUICK LINKS
            </h4>
            {['hero', 'about', 'programs', 'admissions', 'testimonials', 'contact'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                display: 'block', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', padding: '5px 0', fontSize: '14px', textAlign: 'left',
                textTransform: 'capitalize', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = C.gold}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{id === 'hero' ? 'Home' : id.charAt(0).toUpperCase() + id.slice(1)}</button>
            ))}
          </div>

          {/* Portals */}
          <div>
            <h4 style={{ color: C.gold, fontWeight: '700', marginBottom: '16px', fontSize: '14px', letterSpacing: '0.5px' }}>
              PORTALS
            </h4>
            {[
              { label: 'Student Portal', path: '/student-login' },
              { label: 'Staff Portal', path: '/staff-login' },
            ].map(({ label, path }) => (
              <button key={label} onClick={() => navigate(path)} style={{
                display: 'block', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', padding: '5px 0', fontSize: '14px', textAlign: 'left', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = C.gold}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{label}</button>
            ))}

            <h4 style={{ color: C.gold, fontWeight: '700', margin: '24px 0 16px', fontSize: '14px', letterSpacing: '0.5px' }}>
              PROGRAMS
            </h4>
            {['Nursery School', 'Primary School', 'Secondary School'].map(p => (
              <div key={p} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', padding: '5px 0' }}>{p}</div>
            ))}
          </div>

          {/* School Hours */}
          <div>
            <h4 style={{ color: C.gold, fontWeight: '700', marginBottom: '16px', fontSize: '14px', letterSpacing: '0.5px' }}>
              SCHOOL HOURS
            </h4>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.8' }}>
              <div><span style={{ color: C.white }}>Monday – Friday</span><br />7:30am – 3:30pm</div>
              <div style={{ marginTop: '12px' }}><span style={{ color: C.white }}>Saturday</span><br />9:00am – 12:00pm (Admin)</div>
              <div style={{ marginTop: '12px' }}><span style={{ color: C.white }}>Sunday</span><br />Closed</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            © {year} Ore Ofe Oluwa Schools. All rights reserved.
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
            Excellence · Integrity · Faith
          </span>
        </div>
      </div>
    </footer>
  );
}
