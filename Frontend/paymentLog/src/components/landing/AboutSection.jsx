const C = { primary: '#583820', dark: '#3D2714', gold: '#D4A853', light: '#FDF6EC', white: '#FFFFFF', text: '#2D1B10' };

const values = [
  { icon: '📚', title: 'Academic Excellence', desc: 'Rigorous curriculum designed to challenge and inspire every student to reach their full potential.' },
  { icon: '🏆', title: 'Character Development', desc: 'Building integrity, discipline, and moral values that last a lifetime beyond the classroom.' },
  { icon: '🤝', title: 'Community Spirit', desc: 'Fostering collaboration, respect, and a strong sense of belonging among students and staff.' },
  { icon: '🌱', title: 'Holistic Growth', desc: 'Nurturing intellectual, physical, social, and emotional development in every child.' },
];

export default function AboutSection() {
  return (
    <section id="about" style={{ background: C.white, padding: '100px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div style={{
            display: 'inline-block', background: `rgba(88,56,32,0.1)`, borderRadius: '50px',
            padding: '5px 18px', marginBottom: '16px'
          }}>
            <span style={{ color: C.primary, fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px' }}>
              ABOUT OUR SCHOOL
            </span>
          </div>
          <h2 style={{ color: C.text, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
            A Legacy of Educational <span style={{ color: C.primary }}>Excellence</span>
          </h2>
          <p style={{ color: '#6B4226', fontSize: '17px', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto' }}>
            Founded in 1999, Ore Ofe Oluwa Schools has been a beacon of quality education in the community,
            producing graduates who excel in academics, character, and leadership.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>

          {/* Story */}
          <div>
            <h3 style={{ color: C.text, fontSize: '26px', fontWeight: '700', marginBottom: '16px' }}>Our Story</h3>
            <p style={{ color: '#5A3D28', lineHeight: '1.8', marginBottom: '16px', fontSize: '15px' }}>
              What began as a small nursery school with a vision to provide quality early childhood education
              has grown into a comprehensive institution spanning Nursery, Primary, and Secondary levels.
            </p>
            <p style={{ color: '#5A3D28', lineHeight: '1.8', marginBottom: '24px', fontSize: '15px' }}>
              Our school is built on the foundation of God's grace — as reflected in our name "Ore Ofe Oluwa"
              (The Grace of God). We believe every child is a gift deserving the very best education.
            </p>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ color: C.primary, fontSize: '36px', fontWeight: '800' }}>25+</div>
                <div style={{ color: '#6B4226', fontSize: '14px' }}>Years of Service</div>
              </div>
              <div>
                <div style={{ color: C.primary, fontSize: '36px', fontWeight: '800' }}>98%</div>
                <div style={{ color: '#6B4226', fontSize: '14px' }}>Pass Rate</div>
              </div>
              <div>
                <div style={{ color: C.primary, fontSize: '36px', fontWeight: '800' }}>500+</div>
                <div style={{ color: '#6B4226', fontSize: '14px' }}>Alumni</div>
              </div>
            </div>
          </div>

          {/* Mission / Vision */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: C.light, borderLeft: `4px solid ${C.primary}`, borderRadius: '12px',
              padding: '24px'
            }}>
              <h4 style={{ color: C.primary, fontWeight: '700', marginBottom: '10px', fontSize: '16px' }}>🎯 Our Mission</h4>
              <p style={{ color: C.text, lineHeight: '1.7', fontSize: '14px', margin: 0 }}>
                To provide a nurturing, inclusive learning environment that equips students with the knowledge,
                skills, and values needed to thrive in a rapidly changing world.
              </p>
            </div>
            <div style={{
              background: `rgba(88,56,32,0.06)`, borderLeft: `4px solid ${C.gold}`, borderRadius: '12px',
              padding: '24px'
            }}>
              <h4 style={{ color: C.dark, fontWeight: '700', marginBottom: '10px', fontSize: '16px' }}>🔭 Our Vision</h4>
              <p style={{ color: C.text, lineHeight: '1.7', fontSize: '14px', margin: 0 }}>
                To be the leading school in the region, recognised for academic excellence, moral integrity,
                and the holistic development of every student in our care.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {values.map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: C.light, borderRadius: '16px', padding: '28px 24px',
              border: '1px solid rgba(88,56,32,0.1)', transition: 'transform 0.2s, box-shadow 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(88,56,32,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '36px', marginBottom: '14px' }}>{icon}</div>
              <h4 style={{ color: C.text, fontWeight: '700', marginBottom: '10px', fontSize: '16px' }}>{title}</h4>
              <p style={{ color: '#6B4226', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
