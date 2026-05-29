const C = { primary: '#583820', dark: '#3D2714', gold: '#D4A853', light: '#FDF6EC', white: '#FFFFFF', text: '#2D1B10' };

const testimonials = [
  {
    name: 'Mrs. Adeyemi',
    role: 'Parent of Primary 4 Student',
    initials: 'MA',
    text: 'Ore Ofe Oluwa Schools has been transformational for my son. The teachers are dedicated, the environment is safe, and the results speak for themselves. My son went from struggling with reading to topping his class!',
    rating: 5,
  },
  {
    name: 'Mr. Okafor',
    role: 'Parent of JSS 2 Student',
    initials: 'KO',
    text: 'We moved from another school and the difference is night and day. The discipline, the academic standards, and the attention each child receives here is exceptional. Our daughter is thriving.',
    rating: 5,
  },
  {
    name: 'Mrs. Balogun',
    role: 'Parent of Nursery & Primary Students',
    initials: 'TB',
    text: 'All three of my children attend this school and each one loves it. The staff are caring, professional, and genuinely invested in the children\'s success. I recommend OOS to every parent I know.',
    rating: 5,
  },
  {
    name: 'Mr. Adeleke',
    role: 'Parent of SS 3 Alumnus',
    initials: 'FA',
    text: 'My daughter graduated from Ore Ofe Oluwa and gained admission to study Medicine. The foundation this school gave her — academically and morally — made all the difference. Forever grateful.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ background: C.white, padding: '100px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', background: `rgba(88,56,32,0.1)`, borderRadius: '50px',
            padding: '5px 18px', marginBottom: '16px'
          }}>
            <span style={{ color: C.primary, fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px' }}>
              TESTIMONIALS
            </span>
          </div>
          <h2 style={{ color: C.text, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '16px' }}>
            What Parents Say <span style={{ color: C.primary }}>About Us</span>
          </h2>
          <p style={{ color: '#6B4226', fontSize: '17px', lineHeight: '1.7', maxWidth: '520px', margin: '0 auto' }}>
            Don't just take our word for it — hear from the families who have entrusted us with their children's education.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {testimonials.map(({ name, role, initials, text, rating }) => (
            <div key={name} style={{
              background: C.light, borderRadius: '20px', padding: '32px 28px',
              border: '1px solid rgba(88,56,32,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(88,56,32,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Stars */}
              <div style={{ marginBottom: '16px' }}>
                {'★'.repeat(rating).split('').map((s, i) => (
                  <span key={i} style={{ color: C.gold, fontSize: '18px' }}>{s}</span>
                ))}
              </div>

              {/* Quote */}
              <p style={{ color: '#4A3020', lineHeight: '1.8', fontSize: '14px', marginBottom: '24px', fontStyle: 'italic' }}>
                "{text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', background: C.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.white, fontWeight: '700', fontSize: '14px', flexShrink: 0
                }}>{initials}</div>
                <div>
                  <div style={{ color: C.text, fontWeight: '700', fontSize: '14px' }}>{name}</div>
                  <div style={{ color: '#8B5E3C', fontSize: '12px' }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '64px',
          flexWrap: 'wrap', padding: '40px', background: C.primary, borderRadius: '20px'
        }}>
          {[
            { value: '4.9/5', label: 'Parent Satisfaction' },
            { value: '98%', label: 'Would Recommend' },
            { value: '95%', label: 'Student Retention' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: C.gold, fontSize: '36px', fontWeight: '800' }}>{value}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
