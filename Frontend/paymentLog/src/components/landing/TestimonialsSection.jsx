import { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: "The academic rigour at Ore Ofe Oluwa Schools is unmatched. Beyond the classroom, my children have developed a profound sense of responsibility and leadership that I haven't seen elsewhere.",
    author: "Dr. Adebayo Ogunlesi",
    role: "Parent & University Researcher",
  },
  {
    quote: "Attending this institution laid the foundation for my career in medicine. The discipline instilled here stays with you for life. I owe so much of my success to OOS.",
    author: "Tunde Williams",
    role: "Alumni, Class of 2012",
  },
  {
    quote: "The care and attention the teachers gave my daughter was extraordinary. She went from struggling to top of her class. The school's ethos of 'grace and excellence' is lived every day.",
    author: "Mrs. Funmilayo Balogun",
    role: "Parent of Primary 5 Student",
  },
];

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setIdx(i => (i + 1) % testimonials.length);
        setOpacity(1);
      }, 500);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[idx];

  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-margin-desktop">
        <div className="max-w-4xl mx-auto">

          {/* Giant quote mark */}
          <span className="material-symbols-outlined block text-center text-primary/30 mb-8"
            style={{ fontSize: '96px', lineHeight: 1 }}>
            format_quote
          </span>

          {/* Testimonial content */}
          <div
            style={{ opacity, transition: 'opacity 0.5s ease' }}
            className="text-center space-y-8"
          >
            <p className="font-serif text-2xl font-semibold italic text-on-surface leading-relaxed">
              "{t.quote}"
            </p>
            <div>
              <p className="font-sans font-semibold text-sm tracking-widest text-primary uppercase">{t.author}</p>
              <p className="font-serif text-sm text-on-surface-variant mt-1">{t.role}</p>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setOpacity(0); setTimeout(() => { setIdx(i); setOpacity(1); }, 300); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${i === idx ? 'bg-primary w-6' : 'bg-outline-variant hover:bg-outline'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
