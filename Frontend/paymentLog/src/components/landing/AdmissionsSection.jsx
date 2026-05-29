import { Link } from 'react-router-dom';
const C = { primary: '#583820', dark: '#3D2714', gold: '#D4A853', light: '#FDF6EC', white: '#FFFFFF', text: '#2D1B10' };

const steps = [
  { num: '01', title: 'Download Form', desc: 'Obtain the admission application form from the school office or complete the online form below.' },
  { num: '02', title: 'Submit Documents', desc: 'Submit completed form with birth certificate, passport photos, and previous school results.' },
  { num: '03', title: 'Entrance Assessment', desc: 'Shortlisted applicants are invited for an age-appropriate entrance assessment.' },
  { num: '04', title: 'Admission Offer', desc: 'Successful applicants receive an admission letter and proceed with enrolment and fees.' },
];

const requirements = [
  'Completed application form',
  'Birth certificate (original + photocopy)',
  '4 recent passport photographs',
  'Last school report card',
  'Transfer certificate (for transfers)',
  'Evidence of payment of application fee',
];

export default function AdmissionsSection() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="admissions" style={{
      background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`,
      padding: '100px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(212,168,83,0.2)', border: '1px solid rgba(212,168,83,0.4)',
            borderRadius: '50px', padding: '5px 18px', marginBottom: '16px'
          }}>
            <span style={{ color: C.gold, fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px' }}>
              ADMISSIONS
            </span>
          </div>
          <h2 style={{ color: C.white, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '16px' }}>
            Join Our School Family
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '17px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
            Admissions are open for Nursery, Primary, and Secondary levels. Begin your child's journey to excellence today.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {steps.map(({ num, title, desc }) => (
            <div key={num} style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px', padding: '28px 24px', backdropFilter: 'blur(4px)',
              transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', background: C.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', color: C.dark, fontSize: '16px', marginBottom: '16px'
              }}>{num}</div>
              <h4 style={{ color: C.white, fontWeight: '700', marginBottom: '10px', fontSize: '16px' }}>{title}</h4>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Requirements + CTA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: C.white, fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
              Required Documents
            </h3>
            {requirements.map(req => (
              <div key={req} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', background: C.gold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: C.dark, fontWeight: '800', flexShrink: 0
                }}>✓</div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{req}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px 32px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ color: C.white, fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>
                Ready to Apply?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
                Admissions are ongoing. Limited slots available. Apply today to secure your child's spot.
              </p>
              <Link to="/apply" style={{
                background: C.gold, color: C.dark, padding: '14px 32px',
                borderRadius: '50px', fontSize: '16px', fontWeight: '700', textDecoration: 'none',
                display: 'block', textAlign: 'center',
                boxShadow: '0 4px 20px rgba(212,168,83,0.3)'
              }}>
                Start Your Application →
              </Link>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '16px' }}>
                Mon – Fri, 8:00am – 4:00pm
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
