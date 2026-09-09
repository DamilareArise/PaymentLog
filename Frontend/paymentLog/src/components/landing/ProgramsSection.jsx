export default function ProgramsSection() {
  return (
    <section className="py-24 bg-surface-container-low" id="programs">
      <div className="max-w-[1280px] mx-auto px-margin-desktop">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-[32px] leading-10 font-semibold text-on-surface">Academic Programs</h2>
          <p className="font-sans font-semibold text-sm tracking-widest text-primary mt-2 uppercase">A Legacy of Learning</p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-12 gap-gutter" style={{ minHeight: '600px' }}>

          {/* Kindergarten — 6 cols */}
          <div className="md:col-span-6 bg-surface-container p-8 border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300 group">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-primary text-5xl">crib</span>
              <h3 className="font-serif text-2xl font-semibold text-on-surface">Kindergarten</h3>
              <p className="text-on-surface-variant font-serif text-base leading-relaxed">
                Our earliest years, where play leads the learning — sensory discovery, language, and social confidence built at each child&apos;s own pace.
              </p>
              <div className="pt-2">
                {['Creche', 'Pre-KG', 'KG 1', 'KG 2'].map(c => (
                  <span key={c} className="inline-block mr-2 mb-2 text-xs font-sans tracking-wide text-on-surface-variant border border-outline-variant/40 px-2 py-1">{c}</span>
                ))}
              </div>
            </div>
            <a href="#admissions" onClick={e => { e.preventDefault(); document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="font-sans font-semibold text-sm tracking-widest text-primary flex items-center gap-2 no-underline group mt-8 uppercase"
            >
              Enrol Now
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>

          {/* Nursery — 6 cols */}
          <div className="md:col-span-6 bg-surface-container p-8 border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300 group">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-primary text-5xl">child_care</span>
              <h3 className="font-serif text-2xl font-semibold text-on-surface">Nursery School</h3>
              <p className="text-on-surface-variant font-serif text-base leading-relaxed">
                Early childhood development focused on curiosity, motor skills, and foundational literacy in a warm, nurturing environment.
              </p>
              <div className="pt-2">
                {['Nursery 1', 'Nursery 2', 'Nursery 3'].map(c => (
                  <span key={c} className="inline-block mr-2 mb-2 text-xs font-sans tracking-wide text-on-surface-variant border border-outline-variant/40 px-2 py-1">{c}</span>
                ))}
              </div>
            </div>
            <a href="#admissions" onClick={e => { e.preventDefault(); document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="font-sans font-semibold text-sm tracking-widest text-primary flex items-center gap-2 no-underline group mt-8 uppercase"
            >
              Enrol Now
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>

          {/* Primary — full width with image */}
          <div className="md:col-span-12 relative group overflow-hidden" style={{ minHeight: '360px' }}>
            <img
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD2a84L7gCaWGs9zM1P49OtUSCsBohpv_4ghq4MzPg0qZTrfqDEcl3KyIflkiO3uDfAejpVkq9CNGt9qe5-8pS_N0zHH5T_VFpXjNLr8MV2Pw_DFZlwAmLCOxEyRMD-ZwonmTR3ZlbitEApEGWBFEHm5rpDX4LCiuowoGYXFgnIQD1qN7w9ouj6HEpI0f1R6nnW_SYe-XY2t8tnAW-pb_IznoiS3nnQ6xb4eWPYlVLr6Sw9eRrFgb-qdTTbaGHUfLPf4d9lrvbN-A"
              alt="Primary School"
              style={{ zIndex: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-12" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 100%)', zIndex: 1 }}>
              <h3 className="font-serif text-[32px] leading-10 font-semibold mb-4" style={{ color: '#D4A853' }}>Primary Education</h3>
              <p className="font-serif text-base max-w-lg mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Building robust academic foundations in mathematics, sciences, and humanities with a focus on critical thinking.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Primary 1–3', 'Primary 4–6', 'BECE Prep'].map(c => (
                  <span key={c} className="text-xs font-sans tracking-wide" style={{ color: '#D4A853', border: '1px solid rgba(212,168,83,0.4)', padding: '2px 8px' }}>{c}</span>
                ))}
              </div>
              <a href="#admissions" onClick={e => { e.preventDefault(); document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="bg-primary text-on-primary w-fit px-8 py-3 font-sans font-semibold text-sm tracking-widest uppercase no-underline hover:brightness-110 transition-all"
              >Enrol Now</a>
            </div>
          </div>

          {/* Secondary — full width */}
          <div className="md:col-span-12 bg-surface-container-high p-8 border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary/40 transition-colors duration-300 group">
            <div className="flex items-center gap-8">
              <span className="material-symbols-outlined text-primary text-5xl flex-shrink-0">biotech</span>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-on-surface mb-2">Secondary School</h3>
                <p className="text-on-surface-variant font-serif text-base leading-relaxed max-w-2xl">
                  Advanced preparatory programs across JSS and SSS for university entrance, research, and technical specialization. WAEC and NECO examination focused.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['JSS 1–3', 'SS 1–3', 'Science Track', 'Arts Track', 'WAEC/NECO Prep'].map(c => (
                    <span key={c} className="text-xs font-sans tracking-wide text-on-surface-variant border border-outline-variant/40 px-2 py-1">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <a href="#admissions" onClick={e => { e.preventDefault(); document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="font-sans font-semibold text-sm tracking-widest text-primary flex items-center gap-2 no-underline group whitespace-nowrap uppercase flex-shrink-0"
            >
              Enrol Now
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
