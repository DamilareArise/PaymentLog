import { Link, useNavigate } from 'react-router-dom';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-lowest py-16 border-t border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">

        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">school</span>
            <span className="font-serif text-xl font-semibold text-on-surface">Ore Ofe Oluwa Schools</span>
          </div>
          <p className="font-serif text-base text-on-surface-variant leading-relaxed">
            Cultivating the minds that will shape the future of our nation and community.
          </p>
          <p className="font-sans text-xs text-primary tracking-widest uppercase mt-2">
            Excellence · Integrity · Grace
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { label: 'Home', action: () => scrollTo('hero') },
              { label: 'About', action: () => scrollTo('story') },
              { label: 'Programs', action: () => scrollTo('programs') },
              { label: 'Admissions', action: () => scrollTo('admissions') },
              { label: 'Contact', action: () => scrollTo('contact') },
            ].map(({ label, action }) => (
              <li key={label}>
                <button onClick={action} className="text-on-surface-variant font-sans text-xs hover:text-primary underline transition-all bg-transparent border-none cursor-pointer p-0 tracking-wide">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Portals */}
        <div className="space-y-4">
          <h4 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase">Portals</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/student-login" className="text-on-surface-variant font-sans text-xs hover:text-primary underline transition-all no-underline tracking-wide">
                Student Portal
              </Link>
            </li>
            <li>
              <Link to="/staff-login" className="text-on-surface-variant font-sans text-xs hover:text-primary underline transition-all no-underline tracking-wide">
                Staff Portal
              </Link>
            </li>
            <li>
              <Link to="/apply" className="text-on-surface-variant font-sans text-xs hover:text-primary underline transition-all no-underline tracking-wide">
                Apply Online
              </Link>
            </li>
          </ul>
          <h4 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase pt-4">Governance</h4>
          <ul className="space-y-2">
            {['Privacy Policy', 'Terms of Admission', 'Staff Recruitment'].map(item => (
              <li key={item}>
                <span className="text-on-surface-variant font-sans text-xs tracking-wide cursor-default">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase">Contact</h4>
          <div className="space-y-3 text-on-surface-variant font-sans text-xs leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">location_on</span>
              <span>Abebi Area Gbongan,<br />Osun State, Nigeria</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">call</span>
              <span>09066099573<br />07030965465</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">mail</span>
              <span>admissions@oreofeoluwa.edu.ng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="max-w-[1280px] mx-auto px-margin-desktop mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-serif text-base text-on-surface-variant text-sm">
          © {year} Ore Ofe Oluwa Schools. All rights reserved.
        </p>
        <p className="font-sans text-xs text-on-surface-variant/50 tracking-widest uppercase">
          Gbongan, Osun State, Nigeria
        </p>
      </div>
    </footer>
  );
}
