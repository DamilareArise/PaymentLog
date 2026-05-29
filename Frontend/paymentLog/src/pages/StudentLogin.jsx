import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const C = { primary: '#583820', dark: '#3D2714', gold: '#D4A853', light: '#FDF6EC', white: '#FFFFFF', text: '#2D1B10' };

export default function StudentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const user = await login(values.email, values.password);
        if (user.role !== 'student') {
          setError('This portal is for students only. Please use the Staff Portal.');
          return;
        }
        navigate('/student/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputStyle = (hasError) => ({
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '15px',
    border: `1.5px solid ${hasError ? '#DC2626' : 'rgba(88,56,32,0.25)'}`,
    outline: 'none', boxSizing: 'border-box', background: C.white,
    color: C.text, fontFamily: 'inherit', transition: 'border-color 0.2s'
  });

  return (
    <div style={{
      minHeight: '100vh', background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(212,168,83,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(212,168,83,0.05)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: C.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', fontSize: '18px', color: C.dark, margin: '0 auto 12px'
            }}>OOS</div>
          </Link>
          <h1 style={{ color: C.white, fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
            Student Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>
            Ore Ofe Oluwa Schools
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: C.white, borderRadius: '20px', padding: '36px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
            Welcome back!
          </h2>
          <p style={{ color: '#8B5E3C', fontSize: '14px', marginBottom: '28px' }}>
            Sign in to access your student dashboard.
          </p>

          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
              color: '#991B1B', fontSize: '14px'
            }}>{error}</div>
          )}

          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                name="email" type="email"
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="student@email.com"
                style={inputStyle(formik.touched.email && formik.errors.email)}
                onFocus={e => e.target.style.borderColor = C.primary}
              />
              {formik.touched.email && formik.errors.email && (
                <span style={{ color: '#DC2626', fontSize: '12px' }}>{formik.errors.email}</span>
              )}
            </div>

            <div>
              <label style={{ color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                name="password" type="password"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="Enter your password"
                style={inputStyle(formik.touched.password && formik.errors.password)}
                onFocus={e => e.target.style.borderColor = C.primary}
              />
              {formik.touched.password && formik.errors.password && (
                <span style={{ color: '#DC2626', fontSize: '12px' }}>{formik.errors.password}</span>
              )}
            </div>

            <button type="submit" disabled={formik.isSubmitting} style={{
              background: formik.isSubmitting ? '#9B6B47' : C.primary,
              color: C.white, border: 'none', padding: '14px',
              borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: formik.isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '4px', transition: 'background 0.2s'
            }}
              onMouseEnter={e => { if (!formik.isSubmitting) e.target.style.background = C.dark; }}
              onMouseLeave={e => { if (!formik.isSubmitting) e.target.style.background = C.primary; }}
            >
              {formik.isSubmitting ? 'Signing in...' : 'Sign In to Student Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#8B5E3C', fontSize: '13px' }}>
              Are you a staff member?{' '}
              <Link to="/staff-login" style={{ color: C.primary, fontWeight: '600', textDecoration: 'none' }}>
                Staff Portal →
              </Link>
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = C.gold}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
          >← Back to School Website</Link>
        </div>
      </div>
    </div>
  );
}
