import { useState } from 'react';

const C = { primary: '#583820', dark: '#3D2714', gold: '#D4A853', light: '#FDF6EC', white: '#FFFFFF', text: '#2D1B10' };

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', text: 'Please fill in name, email, and message.' });
      return;
    }
    setStatus({ type: 'success', text: 'Thank you! Your message has been received. We will contact you within 1-2 business days.' });
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px', fontSize: '14px',
    border: '1.5px solid rgba(88,56,32,0.2)', outline: 'none', boxSizing: 'border-box',
    background: C.white, color: C.text, fontFamily: 'inherit', transition: 'border-color 0.2s'
  };

  return (
    <section id="contact" style={{ background: C.light, padding: '100px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', background: `rgba(88,56,32,0.1)`, borderRadius: '50px',
            padding: '5px 18px', marginBottom: '16px'
          }}>
            <span style={{ color: C.primary, fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px' }}>
              CONTACT US
            </span>
          </div>
          <h2 style={{ color: C.text, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '16px' }}>
            Get In <span style={{ color: C.primary }}>Touch</span>
          </h2>
          <p style={{ color: '#6B4226', fontSize: '17px', lineHeight: '1.7', maxWidth: '500px', margin: '0 auto' }}>
            Have questions about admissions or our programs? We'd love to hear from you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>

          {/* Contact Info */}
          <div>
            <h3 style={{ color: C.text, fontSize: '22px', fontWeight: '700', marginBottom: '28px' }}>Contact Information</h3>

            {[
              { icon: '📍', label: 'Address', value: 'No. 1 Ore Ofe Oluwa Close,\nAbeokuta, Ogun State, Nigeria' },
              { icon: '📞', label: 'Phone', value: '+234 (0) 800 000 0000\n+234 (0) 800 000 0001' },
              { icon: '✉️', label: 'Email', value: 'info@orofoluwa.edu.ng\nadmissions@orofoluwa.edu.ng' },
              { icon: '🕐', label: 'Office Hours', value: 'Monday – Friday: 7:30am – 4:30pm\nSaturday: 9:00am – 12:00pm' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px', background: `rgba(88,56,32,0.1)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
                }}>{icon}</div>
                <div>
                  <div style={{ color: C.primary, fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{label}</div>
                  <div style={{ color: '#5A3D28', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div style={{
              background: 'rgba(88,56,32,0.06)', borderRadius: '12px', height: '160px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(88,56,32,0.1)', marginTop: '8px'
            }}>
              <div style={{ textAlign: 'center', color: '#8B5E3C' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
                <div style={{ fontSize: '13px' }}>Map coming soon</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: C.white, borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(88,56,32,0.08)', border: '1px solid rgba(88,56,32,0.08)' }}>
            <h3 style={{ color: C.text, fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Send Us a Message</h3>

            {status && (
              <div style={{
                padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
                background: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                color: status.type === 'success' ? '#166534' : '#991B1B',
                border: `1px solid ${status.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
              }}>{status.text}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = 'rgba(88,56,32,0.2)'} />
                </div>
                <div>
                  <label style={{ color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+234..." style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = 'rgba(88,56,32,0.2)'} />
                </div>
              </div>
              <div>
                <label style={{ color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.primary}
                  onBlur={e => e.target.style.borderColor = 'rgba(88,56,32,0.2)'} />
              </div>
              <div>
                <label style={{ color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.primary}
                  onBlur={e => e.target.style.borderColor = 'rgba(88,56,32,0.2)'}>
                  <option value="">Select a subject</option>
                  <option>Admission Enquiry</option>
                  <option>Nursery School</option>
                  <option>Primary School</option>
                  <option>Secondary School</option>
                  <option>Fees & Payment</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                  placeholder="How can we help you?" style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = C.primary}
                  onBlur={e => e.target.style.borderColor = 'rgba(88,56,32,0.2)'} />
              </div>
              <button type="submit" style={{
                background: C.primary, color: C.white, border: 'none', padding: '14px',
                borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => { e.target.style.background = C.dark; e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.target.style.background = C.primary; e.target.style.transform = 'none'; }}
              >
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
