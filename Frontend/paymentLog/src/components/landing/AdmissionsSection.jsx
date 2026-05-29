import { Link } from 'react-router-dom';

const steps = [
  {
    num: '01',
    title: 'Application Submission',
    desc: 'Complete the digital enrolment form and submit previous academic transcripts for review by our admissions board.',
  },
  {
    num: '02',
    title: 'Entrance Evaluation',
    desc: 'Shortlisted candidates are invited for a comprehensive aptitude assessment and personal interview with faculty leads.',
  },
  {
    num: '03',
    title: 'Registration & Induction',
    desc: 'Upon successful assessment, complete formal registration to receive your portal access and orientation kit.',
  },
];

export default function AdmissionsSection() {
  return (
    <section className="py-24 bg-surface" id="admissions">
      <div className="max-w-[1280px] mx-auto px-margin-desktop">
        <div className="flex flex-col md:flex-row gap-16">

          {/* Left intro */}
          <div className="md:w-1/3 space-y-6">
            <h2 className="font-serif text-[32px] leading-10 font-semibold text-on-surface">
              Join Our Community
            </h2>
            <div className="w-16 h-1 bg-primary" />
            <p className="font-serif text-base leading-relaxed text-on-surface-variant">
              A streamlined three-step process to begin your journey toward academic excellence at Ore Ofe Oluwa Schools.
            </p>
            <Link
              to="/apply"
              className="inline-block bg-primary-container text-on-primary-container px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase hover:brightness-110 transition-all no-underline mt-4"
            >
              Start Application
            </Link>
          </div>

          {/* Steps */}
          <div className="md:w-2/3 grid grid-cols-1 gap-10">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-8 group">
                <div className="w-16 h-16 shrink-0 bg-surface-container border border-primary flex items-center justify-center font-serif text-2xl font-semibold text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                  {num}
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-base text-on-surface mb-2 tracking-wide">{title}</h4>
                  <p className="font-serif text-base text-on-surface-variant leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements strip */}
        <div className="mt-20 border-t border-outline-variant/30 pt-12">
          <h3 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase mb-8">Required Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Completed application form',
              'Birth certificate (original + copy)',
              '4 recent passport photographs',
              'Last school report card',
              'Transfer certificate (transfers)',
              'Evidence of application fee payment',
            ].map(req => (
              <div key={req} className="flex items-start gap-3 group">
                <span className="material-symbols-outlined text-primary text-base mt-0.5 flex-shrink-0">check_circle</span>
                <span className="font-serif text-sm text-on-surface-variant leading-snug">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
