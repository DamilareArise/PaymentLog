import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../utils/constants';

const NAV = [
  { to: '/student/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/student/profile', icon: 'person', label: 'My Profile' },
  { to: '/student/subjects', icon: 'menu_book', label: 'My Subjects' },
  { to: '/student/exams', icon: 'computer', label: 'CBT Exams' },
  { to: '/student/results', icon: 'grade', label: 'My Results' },
];

const ff = 'Inter, system-ui, sans-serif';

const itemBase = {
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '11px 16px', margin: '2px 8px', borderRadius: '8px',
  textDecoration: 'none', fontSize: '14px', fontWeight: '500',
  transition: 'all 0.15s', fontFamily: ff,
};

export default function StudentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = user?.profile;
  const handleLogout = () => { logout(); navigate('/student-login'); };

  const statusColors = {
    admitted: { bg: 'rgba(22,163,74,0.1)', color: '#15803D', label: 'Admitted' },
    pending: { bg: 'rgba(119,90,25,0.1)', color: '#775a19', label: 'Pending Review' },
    not_admitted: { bg: 'rgba(186,26,26,0.1)', color: '#ba1a1a', label: 'Not Admitted' },
  };
  const st = statusColors[profile?.admissionStatus] || statusColors.pending;

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: '280px',
      background: C.white, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', paddingTop: '24px', zIndex: 40,
    }}>
      {/* Brand */}
      <div style={{ padding: '0 24px 24px', borderBottom: `1px solid ${C.border}` }}>
        <h1 style={{ color: C.primary, fontSize: '18px', fontWeight: '700', margin: 0, letterSpacing: '-0.01em', fontFamily: ff }}>
          ORE OFE OLUWA
        </h1>
        <p style={{ color: C.muted, fontSize: '13px', margin: '2px 0 0', fontFamily: ff }}>Student Portal</p>
      </div>

      {/* Student profile badge */}
      {profile && (
        <div style={{
          margin: '16px 16px 0', padding: '12px', background: C.surfaceLow,
          border: `1px solid ${C.border}`, borderRadius: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: C.surfaceHigh,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.primary, fontWeight: '700', fontSize: '13px', flexShrink: 0,
            }}>{profile.fullName?.[0] || 'S'}</div>
            <div>
              <div style={{ color: C.text, fontSize: '13px', fontWeight: '700', fontFamily: ff }}>{profile.fullName}</div>
              <div style={{ color: C.muted, fontSize: '11px', fontFamily: ff }}>{profile.class} · {profile.schoolType}</div>
            </div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: st.bg, color: st.color,
            fontSize: '10px', fontWeight: '700', padding: '2px 8px',
            borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: ff,
          }}>{st.label}</div>
          {profile.admissionNumber && (
            <div style={{ color: C.muted, fontSize: '11px', marginTop: '4px', fontFamily: ff }}>{profile.admissionNumber}</div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV.map(({ to, icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                style={({ isActive }) => ({
                  ...itemBase,
                  background: isActive ? C.surfaceHigh : 'transparent',
                  color: isActive ? C.primary : C.muted,
                  fontWeight: isActive ? '700' : '500',
                })}
                onMouseEnter={e => { if (!e.currentTarget.style.fontWeight.includes('700')) { e.currentTarget.style.background = C.surfaceLow; e.currentTarget.style.color = C.text; }}}
                onMouseLeave={e => { if (!e.currentTarget.style.fontWeight.includes('700')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; }}}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px 0' }}>
        <button
          onClick={handleLogout}
          style={{ ...itemBase, width: '100%', background: 'none', border: 'none', color: C.muted, textAlign: 'left', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.surfaceLow; e.currentTarget.style.color = C.error; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}
