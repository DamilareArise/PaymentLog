import { useState } from 'react';

export default function ContactSection() {
  const [form, setForm] = useState({ fullName: '', email: '', program: 'Primary School', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.message) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ fullName: '', email: '', program: 'Primary School', message: '' });
  };

  const inputClass = "w-full bg-surface border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface transition-all px-0 pb-2 font-serif text-base outline-none";
  const labelClass = "font-sans text-xs font-medium text-on-surface-variant tracking-wide uppercase block mb-2";

  return (
    <section className="py-24 bg-surface" id="contact">
      <div className="max-w-[1280px] mx-auto px-margin-desktop grid md:grid-cols-2 gap-16">

        {/* Left: Contact info */}
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-[32px] leading-10 font-semibold text-on-surface mb-4">Contact Information</h2>
            <div className="w-16 h-1 bg-primary mb-6" />
            <p className="font-serif text-base text-on-surface-variant leading-relaxed">
              Our administrative office is open Monday to Friday, 8:00 AM — 4:00 PM. We welcome visits and enquiries.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: 'location_on', lines: ['Abebi Area Gbongan, Osun State, Nigeria'] },
              { icon: 'call', lines: ['09066099573', '07030965465'] },
              { icon: 'mail', lines: ['admissions@oreofeoluwa.edu.ng'] },
              { icon: 'schedule', lines: ['Mon – Fri: 7:30 AM – 4:30 PM', 'Saturday: 9:00 AM – 12:00 PM'] },
            ].map(({ icon, lines }) => (
              <div key={icon} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0">{icon}</span>
                <div className="space-y-0.5">
                  {lines.map(l => (
                    <p key={l} className="font-serif text-base text-on-surface">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="w-full h-64 bg-surface-container relative overflow-hidden grayscale brightness-75">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk2-wyHAVBr39N6qDg_VSq5EVYbOMCxTNCt3biaXYiLu0xRnmdBEjG1Ou0eJD9kEby1_CsxnP8ZhjhtSUzjxDRMks1WTG3oMltDoG884-OwGRZcH89dAKXFTusBrucDVZfRwDSJx5LdP9azCX8Hx4OTber0GNTsTLHuEWelswPAiSBdHUwqmexGMqQHauDhADdGXxedA5AisUIg5ZDeHsP0QgdhdWbXNoZSuVa3GrJYPcq2wlCYVk0DJPu4RRt7B_WTOfxjHRKd_0"
              alt="Location map"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
              <div className="text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl text-primary/40 block mb-2">map</span>
                <span className="font-sans text-xs tracking-wide">Gbongan, Osun State</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Inquiry Form */}
        <div className="bg-surface-container p-10 border border-outline-variant/30">
          <h3 className="font-serif text-2xl font-semibold text-on-surface mb-8">Inquiry Form</h3>

          {submitted && (
            <div className="bg-primary/10 border border-primary/30 px-4 py-3 mb-6 font-sans text-sm text-primary tracking-wide">
              ✓ Your inquiry has been received. We will respond within 1–2 business days.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Full Name</label>
                <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className={inputClass} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Program of Interest</label>
              <select value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} className={inputClass}>
                <option>Nursery School</option>
                <option>Primary School</option>
                <option>Secondary School</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Message</label>
              <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={inputClass} required />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-4 font-sans font-semibold text-sm tracking-widest uppercase hover:bg-primary-container transition-all cursor-pointer border-none"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
