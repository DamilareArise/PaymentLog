import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../utils/constants';

const NAV_ITEMS = [
  { to: '/staff/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/staff/students', icon: 'group', label: 'Students' },
  { to: '/staff/staff-mgmt', icon: 'badge', label: 'Staff', adminOnly: true },
  { to: '/staff/subjects', icon: 'menu_book', label: 'Subjects' },
  { to: '/staff/admissions', icon: 'person_add', label: 'Admissions' },
  { to: '/staff/cbt', icon: 'quiz', label: 'CBT Exams' },
  { to: '/staff/payments', icon: 'payments', label: 'Payments' },
];

const itemBase = {
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '11px 16px', margin: '2px 8px', borderRadius: '8px',
  textDecoration: 'none', fontSize: '14px', fontWeight: '500',
  transition: 'all 0.15s', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: '280px',
      background: C.white, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', paddingTop: '24px', zIndex: 40,
    }}>
      {/* Brand */}
      <div style={{ padding: '0 24px 24px', borderBottom: `1px solid ${C.border}` }}>
        <h1 style={{ color: C.primary, fontSize: '18px', fontWeight: '700', margin: 0, letterSpacing: '-0.01em', fontFamily: 'Inter, sans-serif' }}>
          ORE OFE OLUWA
        </h1>
        <p style={{ color: C.muted, fontSize: '13px', margin: '2px 0 0', fontFamily: 'Inter, sans-serif' }}>Staff Portal</p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_ITEMS.map(({ to, icon, label, adminOnly }) => {
            if (adminOnly && user?.role !== 'admin') return null;
            return (
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
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px 0' }}>
        <button
          onClick={handleLogout}
          style={{ ...itemBase, width: '100%', background: 'none', border: 'none', color: C.muted, textAlign: 'left' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.surfaceLow; e.currentTarget.style.color = C.error; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
