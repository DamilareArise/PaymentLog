import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { SCHOOL_TYPES, CLASSES } from '../utils/constants';

const SCHEMA = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  gender: Yup.string().required('Gender is required'),
  schoolType: Yup.string().required('School level is required'),
  class: Yup.string().required('Desired class is required'),
  parentName: Yup.string().required('Parent / guardian name is required'),
  parentPhone: Yup.string().required('Parent phone is required'),
});

const INIT = {
  fullName: '', gender: '', dateOfBirth: '', schoolType: '', class: '',
  address: '', parentName: '', parentPhone: '', parentEmail: '', previousSchool: '',
};

function FormField({ formik, name, label, required, type = 'text', opts, span2, placeholder, onChange }) {
  const [focused, setFocused] = useState(false);
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className={span2 ? 'col-span-1 md:col-span-2' : ''}>
      <label className={`block font-sans text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused ? 'text-primary' : 'text-on-surface-variant'}`}>
        {label}{required && ' *'}
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={formik.values[name]}
          onChange={onChange || formik.handleChange}
          onBlur={e => { setFocused(false); formik.handleBlur(e); }}
          onFocus={() => setFocused(true)}
          className="input-field h-14 appearance-none"
          style={{ borderColor: hasError ? '#ff4444' : focused ? '#f2ca50' : '#4d4635' }}
        >
          <option value="">Select…</option>
          {opts?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={formik.values[name]}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={e => { setFocused(false); formik.handleBlur(e); }}
          onFocus={() => setFocused(true)}
          rows={3}
          className="input-field py-3"
          style={{ borderColor: hasError ? '#ff4444' : focused ? '#f2ca50' : '#4d4635', resize: 'none' }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formik.values[name]}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={e => { setFocused(false); formik.handleBlur(e); }}
          onFocus={() => setFocused(true)}
          className="input-field h-14"
          style={{ borderColor: hasError ? '#ff4444' : focused ? '#f2ca50' : '#4d4635' }}
        />
      )}
      {hasError && (
        <p className="mt-1 font-sans text-xs text-red-400">{formik.errors[name]}</p>
      )}
    </div>
  );
}

export default function AdmissionForm() {
  const [submitted, setSubmitted] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: INIT,
    validationSchema: SCHEMA,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await api.post('/students/apply', values);
        setSubmitted(data.data);
      } catch (e) {
        alert(e.response?.data?.message || 'Submission failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const availableClasses = formik.values.schoolType ? CLASSES[formik.values.schoolType] : [];
  const year = new Date().getFullYear();

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-margin-mobile py-24">
        <div className="w-full max-w-lg text-center">
          <div className="form-card rounded-xl p-12 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px' }}>check_circle</span>
            </div>
            <h2 className="font-serif text-[28px] font-semibold text-on-surface mb-3">Application Submitted</h2>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-8">
              Thank you for applying to Ore Ofe Oluwa Schools. Your application has been received and is currently under review by our admissions board.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
              <p className="font-sans text-xs text-on-surface-variant tracking-widest uppercase mb-2">Your Application Reference</p>
              <p className="font-serif text-3xl font-semibold text-primary tracking-wider">{submitted.admissionNumber || 'Pending'}</p>
            </div>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-8">
              Please save your reference number. Our admissions office will contact you within 3–5 working days to schedule an entrance evaluation.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-on-primary px-8 py-3 font-sans font-semibold text-sm tracking-widest uppercase no-underline hover:brightness-110 transition-all"
            >
              Back to School Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-outline-variant/30 bg-surface/95 h-20">
        <nav className="flex justify-between items-center max-w-[1280px] mx-auto px-margin-desktop h-full">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <span className="material-symbols-outlined text-primary text-3xl">school</span>
            <span className="font-serif text-xl font-semibold text-primary tracking-tight hidden sm:block">ORE OFE OLUWA SCHOOLS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/#programs')} className="text-on-surface-variant font-sans text-sm hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer">Curriculum</button>
            <button onClick={() => navigate('/#admissions')} className="text-on-surface-variant font-sans text-sm hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer">Admissions</button>
            <button onClick={() => navigate('/#contact')} className="text-on-surface-variant font-sans text-sm hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer">Contact</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/student-login" className="hidden sm:inline-block bg-surface-container border border-outline-variant text-on-surface-variant px-4 py-2 font-sans text-sm font-semibold tracking-widest uppercase no-underline hover:border-primary hover:text-primary transition-all">
              PORTALS
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-margin-mobile md:px-0">
        <div className="max-w-[1280px] mx-auto px-margin-desktop">

          {/* Hero */}
          <section className="mb-16 text-center md:text-left">
            <div className="inline-block px-4 py-1 mb-6 border border-primary/30 bg-primary/5" style={{ borderRadius: '999px' }}>
              <span className="text-primary font-sans text-xs font-semibold tracking-widest uppercase">Academic Year {year}/{year + 1}</span>
            </div>
            <h1 className="font-serif text-[48px] leading-[56px] font-bold text-on-surface mb-4 tracking-tight">
              {year} Admission Application
            </h1>
            <p className="font-serif text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Welcome to the Ore Ofe Oluwa Schools application portal. Join a legacy of academic excellence and character formation. Please complete all sections of the form below.
            </p>
          </section>

          <form onSubmit={formik.handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Left column — form sections */}
              <div className="lg:col-span-8 space-y-10">

                {/* Student Information */}
                <section className="form-card p-10 rounded-xl shadow-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-primary text-2xl">person</span>
                    <h2 className="font-serif text-2xl font-semibold text-on-surface">Student Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <FormField formik={formik} name="fullName" label="Full Name" required span2 placeholder="Enter student's legal full name" />
                    <FormField formik={formik} name="gender" label="Gender" required type="select" opts={['Male', 'Female']} />
                    <FormField formik={formik} name="dateOfBirth" label="Date of Birth" type="date" />
                    <FormField
                      formik={formik} name="schoolType" label="School Level" required type="select" opts={SCHOOL_TYPES}
                      onChange={e => { formik.handleChange(e); formik.setFieldValue('class', ''); }}
                    />
                    <FormField formik={formik} name="class" label="Desired Class" required type="select" opts={availableClasses} />
                    <FormField formik={formik} name="previousSchool" label="Previous School (Optional)" span2 placeholder="Name of last institution attended" />
                    <FormField formik={formik} name="address" label="Home Address" type="textarea" span2 placeholder="Full residential address" />
                  </div>
                </section>

                {/* Parent / Guardian */}
                <section className="form-card p-10 rounded-xl shadow-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-primary text-2xl">family_history</span>
                    <h2 className="font-serif text-2xl font-semibold text-on-surface">Parent / Guardian Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <FormField formik={formik} name="parentName" label="Parent/Guardian Full Name" required span2 placeholder="Full legal name" />
                    <FormField formik={formik} name="parentPhone" label="Phone Number" required placeholder="+234 ..." />
                    <FormField formik={formik} name="parentEmail" label="Email Address" type="email" placeholder="example@domain.com" />
                  </div>
                </section>
              </div>

              {/* Right column — photo + summary */}
              <div className="lg:col-span-4 space-y-8">

                {/* Passport Photograph */}
                <section className="form-card p-8 rounded-xl shadow-xl border-2 border-dashed border-outline-variant">
                  <h3 className="font-sans text-xs font-semibold tracking-widest text-primary uppercase mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">add_a_photo</span>
                    Passport Photograph
                  </h3>
                  <div
                    className="relative w-full overflow-hidden bg-surface-container-highest border border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all group"
                    style={{ aspectRatio: '3/4', borderRadius: '0.5rem' }}
                  >
                    <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center" />
                    <div className="relative z-10 text-center px-4 pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant block mb-2" style={{ fontSize: '40px' }}>upload</span>
                      <p className="font-sans text-sm font-semibold text-on-surface mb-1">Click to Upload</p>
                      <p className="font-sans text-xs text-on-surface-variant">PNG or JPG (Max 2MB)</p>
                    </div>
                    <input type="file" accept="image/png,image/jpeg" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  <p className="mt-4 font-sans text-xs text-on-surface-variant italic leading-relaxed">
                    * Ensure the photograph has a plain white background and the student's face is clearly visible.
                  </p>
                </section>

                {/* Application Summary (sticky) */}
                <div className="bg-primary/5 p-8 rounded-xl border border-primary/20 sticky top-28">
                  <h4 className="font-serif text-2xl font-semibold text-on-surface mb-6">Application Summary</h4>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                      <span className="font-sans text-xs text-on-surface-variant">Session</span>
                      <span className="font-sans text-xs font-semibold text-primary">{year}/{year + 1}</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                      <span className="font-sans text-xs text-on-surface-variant">Type</span>
                      <span className="font-sans text-xs font-semibold text-primary">Full Enrollment</span>
                    </div>
                    {formik.values.schoolType && (
                      <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                        <span className="font-sans text-xs text-on-surface-variant">Level</span>
                        <span className="font-sans text-xs font-semibold text-primary">{formik.values.schoolType}</span>
                      </div>
                    )}
                    {formik.values.class && (
                      <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                        <span className="font-sans text-xs text-on-surface-variant">Class</span>
                        <span className="font-sans text-xs font-semibold text-primary">{formik.values.class}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 mb-8">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="mt-1 rounded bg-surface border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      id="agree-check"
                    />
                    <label htmlFor="agree-check" className="font-sans text-xs text-on-surface-variant leading-relaxed cursor-pointer">
                      I hereby certify that the information provided above is true and accurate to the best of my knowledge.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={formik.isSubmitting || !agreed}
                    className={`w-full py-4 bg-primary text-on-primary font-sans font-semibold text-sm tracking-widest uppercase rounded-lg shadow-lg transition-all ${!agreed || formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98] cursor-pointer'}`}
                  >
                    {formik.isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                        Processing…
                      </span>
                    ) : 'Submit Application'}
                  </button>

                  <p className="mt-6 text-center font-sans text-xs text-on-surface-variant">
                    Need assistance?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/#contact')}
                      className="text-primary underline bg-transparent border-none cursor-pointer font-sans text-xs"
                    >
                      Contact Admissions Office
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">school</span>
              <span className="font-serif text-xl font-semibold text-on-surface">Ore Ofe Oluwa Schools</span>
            </div>
            <p className="font-serif text-base text-on-surface-variant leading-relaxed">
              Cultivating the minds that will shape the future of our nation and community.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Programs', 'Admissions', 'Contact'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-on-surface-variant font-sans text-xs hover:text-primary transition-all no-underline tracking-wide">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase">Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/student-login" className="text-on-surface-variant font-sans text-xs hover:text-primary transition-all no-underline tracking-wide">Student Portal</Link></li>
              <li><Link to="/staff-login" className="text-on-surface-variant font-sans text-xs hover:text-primary transition-all no-underline tracking-wide">Staff Portal</Link></li>
            </ul>
            <h4 className="font-sans font-semibold text-sm tracking-widest text-primary uppercase pt-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Admission'].map(item => (
                <li key={item}><span className="text-on-surface-variant font-sans text-xs tracking-wide">{item}</span></li>
              ))}
            </ul>
          </div>
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
        <div className="max-w-[1280px] mx-auto px-margin-desktop mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-serif text-sm text-on-surface-variant">
            © {year} Ore Ofe Oluwa Schools. All rights reserved.
          </p>
          <p className="font-sans text-xs text-on-surface-variant/50 tracking-widest uppercase">
            Gbongan, Osun State, Nigeria
          </p>
        </div>
      </footer>
    </div>
  );
}
