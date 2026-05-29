import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StudentSidebar from '../../components/student/StudentSidebar';
import { C } from '../../utils/constants';

const PAGE_TITLES = {
  '/student/dashboard': 'Dashboard',
  '/student/profile': 'My Profile',
  '/student/subjects': 'My Subjects',
  '/student/exams': 'CBT Exams',
  '/student/results': 'My Results',
};

const ff = 'Inter, system-ui, sans-serif';

const statusInfo = {
  admitted: { bg: 'rgba(22,163,74,0.1)', color: '#15803D', label: 'Admitted' },
  pending: { bg: 'rgba(119,90,25,0.1)', color: '#775a19', label: 'Pending Review' },
  not_admitted: { bg: 'rgba(186,26,26,0.1)', color: '#ba1a1a', label: 'Not Admitted' },
};

export default function StudentPortal() {
  const { user } = useAuth();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Student Portal';
  const profile = user?.profile;
  const st = statusInfo[profile?.admissionStatus] || statusInfo.pending;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: ff }}>
      <StudentSidebar />

      <div style={{ marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Fixed top bar */}
        <header style={{
          position: 'fixed', top: 0, right: 0, left: '280px', height: '64px',
          background: C.white, borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', zIndex: 30, fontFamily: ff,
        }}>
          <span style={{ color: C.primary, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.01em' }}>
            {title}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {profile?.admissionStatus && (
              <div style={{
                background: st.bg, color: st.color,
                fontSize: '11px', fontWeight: '700', padding: '4px 12px',
                borderRadius: '999px', letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>{st.label}</div>
            )}
            <div style={{ width: '1px', height: '32px', background: C.border }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: C.text, fontSize: '13px', fontWeight: '700' }}>
                  {profile?.fullName || user?.email}
                </div>
                <div style={{ color: C.muted, fontSize: '11px' }}>Student</div>
              </div>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: C.surfaceHigh, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.primary, fontWeight: '700', fontSize: '14px',
              }}>
                {profile?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ paddingTop: '88px', padding: '88px 40px 40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
