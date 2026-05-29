import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../utils/constants';

const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/staff/dashboard' },
  { icon: '👥', label: 'Students', path: '/staff/students' },
  { icon: '👔', label: 'Staff', path: '/staff/staff-mgmt', adminOnly: true },
  { icon: '📚', label: 'Subjects', path: '/staff/subjects' },
  { icon: '📋', label: 'Admissions', path: '/staff/admissions' },
  { icon: '💻', label: 'CBT Exams', path: '/staff/cbt', soon: true },
  { icon: '💰', label: 'Payments', path: '/staff/payments' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const w = collapsed ? '64px' : '240px';

  return (
    <div style={{
      width: w, minWidth: w, height: '100vh', background: C.vdark,
      display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease',
      overflow: 'hidden', position: 'sticky', top: 0, flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: '10px', minHeight: '70px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', background: C.gold,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '800', fontSize: '12px', color: C.vdark, flexShrink: 0
        }}>OOS</div>
        {!collapsed && (
          <div>
            <div style={{ color: C.white, fontWeight: '700', fontSize: '13px', lineHeight: '1.2' }}>
              Ore Ofe Oluwa
            </div>
            <div style={{ color: C.gold, fontSize: '11px' }}>Staff Portal</div>
          </div>
        )}
        <button onClick={onToggle} style={{
          marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)', fontSize: '18px', padding: '4px', flexShrink: 0,
          display: 'flex', alignItems: 'center'
        }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(({ icon, label, path, adminOnly, soon }) => {
          if (adminOnly && user?.role !== 'admin') return null;
          return (
            <NavLink key={path} to={soon ? '#' : path}
              onClick={e => soon && e.preventDefault()}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: collapsed ? '12px 14px' : '11px 14px',
                borderRadius: '8px', marginBottom: '2px', textDecoration: 'none',
                color: isActive ? C.gold : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(212,168,83,0.12)' : 'transparent',
                borderLeft: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden',
                opacity: soon ? 0.45 : 1, cursor: soon ? 'default' : 'pointer'
              })}
              onMouseEnter={e => { if (!soon) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = C.white; }}}
              onMouseLeave={e => {
                const link = e.currentTarget;
                const active = link.getAttribute('data-active') === 'true';
                link.style.background = active ? 'rgba(212,168,83,0.12)' : 'transparent';
                link.style.color = active ? C.gold : 'rgba(255,255,255,0.65)';
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
              {!collapsed && (
                <span style={{ fontSize: '14px', fontWeight: '500', flex: 1 }}>{label}</span>
              )}
              {!collapsed && soon && (
                <span style={{
                  background: 'rgba(212,168,83,0.2)', color: C.gold, fontSize: '10px',
                  padding: '2px 6px', borderRadius: '4px', fontWeight: '600'
                }}>SOON</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 8px' }}>
        {!collapsed && (
          <div style={{ padding: '8px 12px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.white, fontWeight: '700', fontSize: '13px', flexShrink: 0
            }}>
              {user?.profile?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: C.white, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.profile?.fullName || 'Staff Member'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
          padding: collapsed ? '10px 14px' : '10px 14px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)', borderRadius: '8px', transition: 'all 0.15s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; e.currentTarget.style.color = '#FCA5A5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <span style={{ fontSize: '18px' }}>🚪</span>
          {!collapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}
