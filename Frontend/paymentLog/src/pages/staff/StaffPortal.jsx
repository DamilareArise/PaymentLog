import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/staff/Sidebar';
import { C } from '../../utils/constants';
import { useIsMobile } from '../../hooks/useIsMobile';

const PAGE_TITLES = {
  '/staff/dashboard': 'Staff Dashboard',
  '/staff/students': 'Students',
  '/staff/staff-mgmt': 'Staff Management',
  '/staff/subjects': 'Subjects',
  '/staff/admissions': 'Admissions',
  '/staff/cbt': 'CBT Exams',
  '/staff/payments': 'Payments',
};

const ff = 'Inter, system-ui, sans-serif';

export default function StaffPortal() {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = PAGE_TITLES[location.pathname] || 'Staff Portal';
  const profile = user?.profile;

  // Close sidebar on navigation (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: ff }}>

      <Sidebar
        isOpen={sidebarOpen || !isMobile}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Backdrop — mobile only, shown when sidebar is open */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '24px', minWidth: 0 }}>
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

            {/* Search — desktop only */}
            {!isMobile && (
              <div style={{ position: 'relative', width: '320px' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: C.muted, fontSize: '18px',
                }}>search</span>
                <input
                  placeholder="Search students, staff, records…"
                  style={{
                    width: '100%', paddingLeft: '40px', paddingRight: '16px',
                    paddingTop: '8px', paddingBottom: '8px',
                    background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px',
                    fontSize: '14px', color: C.text, outline: 'none', fontFamily: ff,
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = C.secondary; e.target.style.boxShadow = `0 0 0 2px ${C.secondaryContainer}60`; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Notifications / help — desktop only */}
            {!isMobile && (
              <>
                <button style={{ padding: '8px', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', borderRadius: '8px', display: 'flex' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.primary; e.currentTarget.style.background = C.surfaceLow; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'none'; }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
                </button>
                <button style={{ padding: '8px', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', borderRadius: '8px', display: 'flex' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.primary; e.currentTarget.style.background = C.surfaceLow; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'none'; }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>help_outline</span>
                </button>
                <div style={{ width: '1px', height: '32px', background: C.border, margin: '0 8px' }} />
              </>
            )}

            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!isMobile && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: C.text, fontSize: '13px', fontWeight: '700' }}>
                    {profile?.fullName || user?.email}
                  </div>
                  <div style={{ color: C.muted, fontSize: '11px', textTransform: 'capitalize' }}>{user?.role}</div>
                </div>
              )}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: C.surfaceHigh, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.primary, fontWeight: '700', fontSize: '14px', flexShrink: 0,
              }}>
                {profile?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
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
