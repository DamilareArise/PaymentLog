export default function AboutSection() {
  return (
    <section className="py-24 bg-surface" id="story">
      <div className="max-w-[1280px] mx-auto px-margin-desktop grid md:grid-cols-2 gap-gutter items-center">

        {/* Text */}
        <div className="space-y-8">
          <h2 className="font-serif text-[32px] leading-10 font-semibold text-on-surface">
            Our Scholarly Heritage
          </h2>
          <div className="w-20 h-1 bg-primary" />
          <p className="font-serif text-base leading-relaxed text-on-surface-variant">
            Founded with a vision to cultivate leaders of tomorrow, Ore Ofe Oluwa Schools has stood as a beacon of intellectual excellence for decades. Our curriculum blends traditional editorial standards with modern scientific inquiry, ensuring every student develops a deep sense of discipline and curiosity.
          </p>
          <p className="font-serif text-base leading-relaxed text-on-surface-variant">
            We believe that education is more than just rote learning; it is the refinement of character and the expansion of the human mind. Our dedicated faculty provides a sanctuary for growth — grounded in God's grace, as our name reflects.
          </p>

          {/* Stats */}
          <div className="flex gap-10 pt-2">
            {[
              { value: '25+', label: 'Years of Excellence' },
              { value: '98%', label: 'Pass Rate' },
              { value: '1,200+', label: 'Students Enrolled' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-serif text-[32px] font-bold text-primary leading-none">{value}</div>
                <div className="font-sans text-xs text-on-surface-variant mt-1 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="absolute -inset-4 border border-primary/20 translate-x-4 translate-y-4 pointer-events-none" />
          <img
            className="relative w-full aspect-[4/3] object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASpUZSrbiT1NDoiE-TV7OJKXl7Tk7FQZTHqvmmTEMTHbTYceOOr7-Y08U_3tnm-L_sk-wHN5tM7em1qhpEcQfGxhwNcND8F97XOigBPYBPwSNFmsTEWc0094zKkHbI_TCUC66VtktOTq6RZb5VHZ4xrakeWpJUZLQQ0QGxEL45J0n731Zm8gKdkGnqULyk6ow9wWBAwmqLTu-HTTJ9PKNltDaX5iGH-kCEo7SsLMJ4WrEyTvrO3JjRNgTXyKmSS7vVk0Diz4UNa-A"
            alt="Our library and learning environment"
            onError={e => { e.target.style.display = 'none'; }}
          />
          {/* Fallback */}
          <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center -z-10">
            <span className="material-symbols-outlined text-primary/30 text-8xl">menu_book</span>
          </div>
        </div>
      </div>
    </section>
  );
}
