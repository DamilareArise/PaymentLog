import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/staff/Sidebar';
import { C } from '../../utils/constants';

const PAGE_TITLES = {
  '/staff/dashboard': 'Dashboard',
  '/staff/students': 'Students',
  '/staff/staff-mgmt': 'Staff Management',
  '/staff/subjects': 'Subjects',
  '/staff/admissions': 'Admissions',
  '/staff/cbt': 'CBT Exams',
  '/staff/payments': 'Payments',
};

export default function StaffPortal() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Staff Portal';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
        {/* TopBar */}
        <div style={{
          height: '64px', background: C.white, borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', flexShrink: 0
        }}>
          <div>
            <h1 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>{title}</h1>
            <div style={{ color: C.muted, fontSize: '12px' }}>
              {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: C.light, border: `1px solid ${C.border}`, borderRadius: '50px',
              padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', background: C.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.white, fontWeight: '700', fontSize: '12px'
              }}>
                {user?.profile?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ color: C.text, fontSize: '13px', fontWeight: '600' }}>
                  {user?.profile?.fullName || user?.email}
                </div>
                <div style={{ color: C.muted, fontSize: '11px', textTransform: 'capitalize' }}>{user?.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
