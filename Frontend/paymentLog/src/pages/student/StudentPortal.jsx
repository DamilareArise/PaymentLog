import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StudentSidebar from '../../components/student/StudentSidebar';
import { C } from '../../utils/constants';
import { useIsMobile } from '../../hooks/useIsMobile';

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
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = PAGE_TITLES[location.pathname] || 'Student Portal';
  const profile = user?.profile;
  const st = statusInfo[profile?.admissionStatus] || statusInfo.pending;

  // Close sidebar on navigation (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: ff }}>

      <StudentSidebar
        isOpen={sidebarOpen || !isMobile}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Backdrop — mobile only */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,15,34,0.45)',
            zIndex: 45,
          }}
        />
      )}

      {/* Main area */}
      <div style={{
        marginLeft: isMobile ? 0 : '280px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Fixed top bar */}
        <header style={{
          position: 'fixed', top: 0, right: 0,
          left: isMobile ? 0 : '280px',
          height: '64px',
          background: C.white, borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0 16px' : '0 40px',
          zIndex: 30, fontFamily: ff,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.primary, display: 'flex', padding: '4px', flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
              </button>
            )}
            <span style={{
              color: C.primary, fontWeight: '700', letterSpacing: '-0.01em',
              fontSize: isMobile ? '16px' : '20px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Admission status — desktop: pill; mobile: hidden to save space */}
            {!isMobile && profile?.admissionStatus && (
              <div style={{
                background: st.bg, color: st.color,
                fontSize: '11px', fontWeight: '700', padding: '4px 12px',
                borderRadius: '999px', letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>{st.label}</div>
            )}
            {!isMobile && <div style={{ width: '1px', height: '32px', background: C.border }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!isMobile && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: C.text, fontSize: '13px', fontWeight: '700' }}>
                    {profile?.fullName || user?.email}
                  </div>
                  <div style={{ color: C.muted, fontSize: '11px' }}>Student</div>
                </div>
              )}
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
        <main style={{
          padding: isMobile ? '72px 16px 32px' : '88px 40px 40px',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
