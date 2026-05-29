import { C } from '../../utils/constants';

const features = [
  { icon: 'timer', title: 'Timed Examinations', desc: 'Each exam has a countdown timer. Answers are auto-submitted when time expires.' },
  { icon: 'quiz', title: 'Multiple Choice Questions', desc: 'Questions are presented one at a time with options to review and change answers before submission.' },
  { icon: 'auto_awesome', title: 'Instant Auto-Grading', desc: 'Results and scores are computed immediately after submission — no waiting.' },
  { icon: 'history_edu', title: 'Past Results Archive', desc: 'All completed exams and scores are saved and accessible in My Results.' },
];

export default function StudentCBT() {
  return (
    <div style={{ maxWidth: '760px' }}>
      {/* Coming soon banner */}
      <div style={{
        background: `linear-gradient(135deg, #000f22 0%, #001d3d 55%, #003566 100%)`,
        borderRadius: '12px', padding: '48px 40px', marginBottom: '32px', textAlign: 'center'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'rgba(255,255,255,0.2)', display: 'block', marginBottom: '16px' }}>computer</span>
        <h2 style={{ color: C.white, fontSize: '26px', fontWeight: '700', margin: '0 0 10px' }}>CBT Exams</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
          Computer-Based Testing (CBT) is coming in the next module. Once live, you will be able to take scheduled exams directly from this portal.
        </p>
        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '600',
          padding: '8px 20px', borderRadius: '20px', letterSpacing: '0.08em', textTransform: 'uppercase'
        }}>
          Coming Soon — Module 4
        </div>
      </div>

      {/* Feature preview */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '28px' }}>
        <h3 style={{ color: C.text, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>
          What to Expect
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map(({ icon, title, desc }) => (
            <div key={icon} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px', background: C.surfaceHigh,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: '20px' }}>{icon}</span>
              </div>
              <div>
                <div style={{ color: C.text, fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{title}</div>
                <div style={{ color: C.muted, fontSize: '12px', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
