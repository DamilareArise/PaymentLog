const C = { primary: '#583820', dark: '#3D2714', gold: '#D4A853', light: '#FDF6EC', white: '#FFFFFF', text: '#2D1B10' };

const programs = [
  {
    icon: '🌸',
    level: 'Nursery',
    subtitle: 'Ages 2 – 5',
    color: '#E8D5C4',
    accentColor: '#9B6B47',
    description: 'A warm, play-based environment that lays the foundation for lifelong learning through exploration, creativity, and social skills.',
    classes: ['Creche', 'Nursery 1', 'Nursery 2', 'Nursery 3'],
    highlights: ['Phonics & Literacy', 'Basic Numeracy', 'Arts & Crafts', 'Social Development', 'Music & Movement'],
  },
  {
    icon: '📖',
    level: 'Primary',
    subtitle: 'Ages 6 – 11',
    color: '#D4A853',
    accentColor: C.primary,
    description: 'Building core academic competencies in Literacy, Mathematics, Science, and Social Studies with hands-on learning experiences.',
    classes: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
    highlights: ['Core Subjects', 'Computer Studies', 'Physical Education', 'Cultural Studies', 'FIRST Leaving Exams'],
    featured: true,
  },
  {
    icon: '🎓',
    level: 'Secondary',
    subtitle: 'Ages 12 – 17',
    color: '#583820',
    accentColor: C.dark,
    description: 'Comprehensive JSS and SSS education preparing students for national examinations and higher institutions with dedicated subject specialists.',
    classes: ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'],
    highlights: ['BECE & WAEC Prep', 'Science & Arts', 'ICT Labs', 'Career Guidance', 'Extracurriculars'],
  },
];

export default function ProgramsSection() {
  return (
    <section id="programs" style={{ background: C.light, padding: '100px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div style={{
            display: 'inline-block', background: `rgba(88,56,32,0.1)`, borderRadius: '50px',
            padding: '5px 18px', marginBottom: '16px'
          }}>
            <span style={{ color: C.primary, fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px' }}>
              OUR PROGRAMS
            </span>
          </div>
          <h2 style={{ color: C.text, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
            Three Levels of <span style={{ color: C.primary }}>Quality Education</span>
          </h2>
          <p style={{ color: '#6B4226', fontSize: '17px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
            From the earliest years through secondary school, we provide a seamless, high-quality educational journey.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', alignItems: 'start' }}>
          {programs.map(({ icon, level, subtitle, color, accentColor, description, classes, highlights, featured }) => (
            <div key={level} style={{
              background: C.white, borderRadius: '20px', overflow: 'hidden',
              boxShadow: featured ? `0 20px 60px rgba(88,56,32,0.2)` : '0 4px 24px rgba(88,56,32,0.08)',
              transform: featured ? 'scale(1.03)' : 'none',
              border: featured ? `2px solid ${C.gold}` : '1px solid rgba(88,56,32,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative'
            }}
              onMouseEnter={e => { if (!featured) { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(88,56,32,0.15)'; }}}
              onMouseLeave={e => { if (!featured) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(88,56,32,0.08)'; }}}
            >
              {featured && (
                <div style={{
                  position: 'absolute', top: '16px', right: '16px', background: C.gold,
                  color: C.dark, fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                  borderRadius: '50px', letterSpacing: '0.5px'
                }}>MOST POPULAR</div>
              )}

              {/* Header */}
              <div style={{ background: level === 'Secondary' ? C.dark : level === 'Primary' ? C.primary : '#9B6B47', padding: '36px 28px 28px' }}>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>{icon}</div>
                <h3 style={{ color: C.white, fontSize: '26px', fontWeight: '800', margin: 0 }}>{level} School</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '6px 0 0', fontSize: '14px' }}>{subtitle}</p>
              </div>

              {/* Body */}
              <div style={{ padding: '28px' }}>
                <p style={{ color: '#5A3D28', lineHeight: '1.7', fontSize: '14px', marginBottom: '24px' }}>{description}</p>

                {/* Classes */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: C.text, fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>Classes</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {classes.map(cls => (
                      <span key={cls} style={{
                        background: C.light, color: C.primary, padding: '4px 10px',
                        borderRadius: '50px', fontSize: '12px', fontWeight: '600',
                        border: '1px solid rgba(88,56,32,0.15)'
                      }}>{cls}</span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 style={{ color: C.text, fontWeight: '700', marginBottom: '10px', fontSize: '14px' }}>Highlights</h4>
                  {highlights.map(h => (
                    <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ color: C.gold, fontSize: '14px' }}>✓</span>
                      <span style={{ color: '#5A3D28', fontSize: '13px' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
