import { Link } from 'react-router-dom';

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
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuADZWJ0zuLNU4OU_MK22Fr6IwLPqd7A9vpg2d87Q9-c-mXWoLH1XePQpl771gCb4zU3uDpCVR35bXSeuZB8yZwKp4Rwr2JsfX-aHQSrbdiZa_Qar4kWkZQdNzniEgL4K6cVCH8bHi0RcU3xvq9xIW0K1EMSAF2PBqhUKguAlZDMjoNNrcXlZzl394BQ9S7vLd-Ry0ppRUvZaXKGR-bcthkB3jFvq3pnyuHG1tDMtBBZ8K5QT24Pj7F-9QZT--ZefyBF6TfR7MQMwy4"
        alt="Ore Ofe Oluwa Schools campus"
        onError={e => { e.target.style.display = 'none'; }}
      />
      {/* Fallback bg for when image fails */}
      <div className="absolute inset-0 bg-surface-container-high" style={{ zIndex: 0 }} />

      {/* Gradient overlay */}
      <div className="hero-gradient absolute inset-0" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative max-w-[1280px] mx-auto px-margin-desktop w-full" style={{ zIndex: 2 }}>
        <div className="max-w-2xl space-y-6">
          <h1 className="font-serif text-[48px] leading-[56px] tracking-tight font-bold text-secondary">
            Excellence in Education
          </h1>
          <p className="font-serif text-lg leading-7 text-on-surface-variant max-w-xl">
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
              className="border border-outline text-on-surface px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase hover:bg-surface-container transition-all bg-transparent cursor-pointer"
            >
              Explore Programs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
