import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { C } from '../../utils/constants';

function Field({ label, value }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '16px' }}>
      <div style={{ color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: C.text, fontSize: '14px' }}>{value || <span style={{ color: C.muted, fontStyle: 'italic' }}>Not provided</span>}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
      <h3 style={{ color: C.text, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', paddingBottom: '12px', borderBottom: `2px solid ${C.primary}`, display: 'inline-block' }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {children}
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const { user } = useAuth();
  const profile = user?.profile;

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('Password must be at least 6 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`,
    borderRadius: '6px', fontSize: '14px', color: C.text, background: C.surfaceLow,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
  };

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: C.muted }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>person_off</span>
        Profile not found. Please contact the school administration.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Header card */}
      <div style={{
        background: `linear-gradient(135deg, #000f22 0%, #001d3d 55%, #003566 100%)`,
        borderRadius: '12px', padding: '28px 32px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '24px'
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <span style={{ color: C.white, fontSize: '28px', fontWeight: '700' }}>
            {profile.fullName?.[0] || 'S'}
          </span>
        </div>
        <div>
          <h2 style={{ color: C.white, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>{profile.fullName}</h2>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
            {profile.admissionNumber && <span>{profile.admissionNumber} · </span>}
            {profile.class} · {profile.schoolType}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>
            {user?.email}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <Section title="Personal Information">
        <Field label="Full Name" value={profile.fullName} />
        <Field label="Gender" value={profile.gender} />
        <Field label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
        <Field label="Email" value={profile.email} />
        <Field label="Phone" value={profile.phone} />
        <Field label="Address" value={profile.address} />
      </Section>

      {/* Academic Info */}
      <Section title="Academic Details">
        <Field label="Admission Number" value={profile.admissionNumber} />
        <Field label="School Type" value={profile.schoolType} />
        <Field label="Current Class" value={profile.class} />
        <Field label="Section" value={profile.section} />
        <Field label="Admission Status" value={
          profile.admissionStatus === 'admitted' ? 'Admitted' :
          profile.admissionStatus === 'pending' ? 'Pending Review' : 'Not Admitted'
        } />
      </Section>

      {/* Parent / Guardian */}
      <Section title="Parent / Guardian">
        <Field label="Parent/Guardian Name" value={profile.parentName} />
        <Field label="Phone Number" value={profile.parentPhone} />
        <Field label="Email Address" value={profile.parentEmail} />
      </Section>

      {/* Change Password */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '24px' }}>
        <h3 style={{ color: C.text, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', paddingBottom: '12px', borderBottom: `2px solid ${C.primary}`, display: 'inline-block' }}>
          Change Password
        </h3>

        {pwSuccess && (
          <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', color: '#15803D', fontSize: '13px' }}>
            ✓ Password updated successfully.
          </div>
        )}
        {pwError && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
            {pwError}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Current Password
              </label>
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                New Password
              </label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                style={inputStyle}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            style={{
              background: C.primary, color: C.white, border: 'none', borderRadius: '6px',
              padding: '10px 24px', fontSize: '13px', fontWeight: '600', cursor: pwLoading ? 'not-allowed' : 'pointer',
              opacity: pwLoading ? 0.7 : 1, letterSpacing: '0.05em'
            }}
          >
            {pwLoading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
