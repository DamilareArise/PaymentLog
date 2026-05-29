import { Link } from 'react-router-dom';
import hero from "../../assets/hero.png"

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-[870px] flex items-center overflow-hidden pt-20">
      {/* Background image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={hero}
        alt="Ore Ofe Oluwa Schools campus"
        style={{ zIndex: 0 }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ zIndex: 1, background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.1) 100%)' }} />

      {/* Content */}
      <div className="relative max-w-[1280px] mx-auto px-margin-desktop w-full" style={{ zIndex: 2 }}>
        <div className="max-w-2xl space-y-6">
          <h1 className="font-serif text-[48px] leading-[56px] tracking-tight font-bold" style={{ color: '#D4A853' }}>
            Excellence in Education
          </h1>
          <p className="font-serif text-lg leading-7 max-w-xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Nurturing intellectual rigor and personal growth across Nursery, Primary, and Secondary levels through a heritage of academic distinction.
          </p>
          <div className="flex gap-4 pt-4 flex-wrap">
            <Link
              to="/apply"
              className="bg-primary text-on-primary px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase hover:brightness-95 transition-all no-underline shadow-md"
            >
              Apply Now
            </Link>
            <button
              onClick={() => scrollTo('programs')}
              className="px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase transition-all bg-transparent cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.5)', color: '#ffffff' }}
            >
              Explore Programs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
