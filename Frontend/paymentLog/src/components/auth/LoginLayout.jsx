import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginLayout({
  portalName,
  activeNavLabel,
  onSubmit,
  isSubmitting,
  error,
  switchTo,
  emailLabel = 'Email Address',
  emailPlaceholder = 'your@email.com',
}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const year = new Date().getFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const inputClass =
    'w-full bg-transparent border-b border-outline-variant focus:border-primary border-t-0 border-x-0 transition-all duration-300 px-4 py-3 text-on-surface placeholder:text-outline focus:ring-0 font-sans text-sm outline-none';

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface overflow-x-hidden">

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant h-16 flex items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="material-symbols-outlined text-primary">school</span>
          <span className="font-serif text-xl font-semibold text-primary tracking-tight">ORE OFE OLUWA SCHOOLS</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <span className="font-sans text-sm font-bold text-primary tracking-wide border-b-2 border-primary pb-0.5">
            {activeNavLabel}
          </span>
          <Link to="/#programs" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Academic Info</Link>
          <Link to="/#contact" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Support</Link>
        </nav>
        <button
          className="md:hidden text-on-surface bg-transparent border-none cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Main */}
      <main
        className="flex-grow flex items-center justify-center pt-24 pb-16 px-margin-mobile relative overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #dee3eb 0%, #f8f9ff 70%)' }}
      >
        {/* Atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[480px] z-10">
          {/* Login card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 p-10 md:p-12 shadow-xl relative overflow-hidden">
            {/* Ornamental icon */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none select-none">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '96px' }}>auto_stories</span>
            </div>

            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="font-serif text-[32px] leading-10 font-semibold text-on-surface mb-2">
                Academic Excellence
              </h1>
              <p className="font-sans text-sm font-semibold text-on-surface-variant uppercase tracking-widest">
                {portalName} Authentication
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-error-container/20 border border-error/30 px-4 py-3 mb-6 font-sans text-sm text-error tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-base flex-shrink-0">error_outline</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="font-sans text-sm font-semibold text-on-surface-variant block ml-1 tracking-wide">
                  {emailLabel}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={emailPlaceholder}
                    required
                    className={inputClass}
                    style={{ paddingRight: '40px' }}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant" style={{ fontSize: '20px' }}>
                    alternate_email
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="font-sans text-sm font-semibold text-on-surface-variant block ml-1 tracking-wide">
                  Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className={inputClass}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-3 cursor-pointer group/check">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border border-outline bg-surface-container-high checked:bg-primary checked:border-primary transition-all cursor-pointer"
                    />
                    <span
                      className="material-symbols-outlined absolute text-on-primary opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2 pointer-events-none"
                      style={{ fontSize: '14px', fontVariationSettings: "'wght' 700" }}
                    >check</span>
                  </div>
                  <span className="font-sans text-xs text-on-surface-variant group-hover/check:text-on-surface transition-colors">
                    Remember credentials
                  </span>
                </label>
                <span className="font-sans text-xs text-primary cursor-default select-none hover:underline underline-offset-4 transition-all">
                  Forgot Password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary py-4 px-6 flex items-center justify-center gap-3 group/btn hover:bg-primary/90 transition-all duration-300 shadow-lg border-none cursor-pointer ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined text-on-primary animate-spin" style={{ fontSize: '22px' }}>progress_activity</span>
                ) : (
                  <>
                    <span className="font-sans font-bold text-sm text-on-primary uppercase tracking-widest">
                      Login to {portalName}
                    </span>
                    <span className="material-symbols-outlined text-on-primary group-hover/btn:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Switch portal */}
            <div className="mt-8 pt-8 border-t border-outline-variant text-center">
              <p className="font-sans text-xs text-on-surface-variant mb-4">
                {switchTo.prompt}
              </p>
              <Link
                to={switchTo.path}
                className="font-sans text-sm font-semibold text-secondary border border-secondary/30 px-8 py-2 hover:bg-secondary/10 transition-all no-underline inline-block"
              >
                {switchTo.label}
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 opacity-60">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              <span className="font-sans text-xs uppercase tracking-tight text-on-surface-variant">Systems Secure</span>
            </div>
            <div className="h-4 w-px bg-outline-variant" />
            <div className="flex items-center gap-2 opacity-60">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>encrypted</span>
              <span className="font-sans text-xs uppercase tracking-tight text-on-surface-variant">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-sans text-sm font-semibold text-on-surface">ORE OFE OLUWA SCHOOLS</span>
            <p className="font-sans text-sm text-secondary opacity-90">© {year} Ore Ofe Oluwa Schools. All Rights Reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link to="/" className="font-sans text-sm text-on-surface-variant hover:text-primary underline transition-all">School Website</Link>
            <span className="font-sans text-sm text-on-surface-variant cursor-default">Privacy Policy</span>
            <Link to="/#contact" className="font-sans text-sm text-on-surface-variant hover:text-primary underline transition-all">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
