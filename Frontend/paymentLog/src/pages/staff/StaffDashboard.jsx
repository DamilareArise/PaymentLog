import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { C, STATUS_COLORS } from '../../utils/constants';
import { useIsMobile } from '../../hooks/useIsMobile';

const ff = 'Inter, system-ui, sans-serif';

const card = {
  background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
  padding: '24px', position: 'relative', overflow: 'hidden',
};

// Simulated monthly enrollment for chart
const CHART_DATA = [
  { month: 'Sep', pct: 42 }, { month: 'Oct', pct: 58 },
  { month: 'Nov', pct: 74 }, { month: 'Dec', pct: 67 },
  { month: 'Jan', pct: 85 }, { month: 'Feb', pct: 95 },
];

function StatCard({ icon, label, value, sub, subColor, onClick, accentBg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...card,
        cursor: onClick ? 'pointer' : 'default',
        transform: hovered && onClick ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && onClick ? '0 8px 24px rgba(0,15,34,0.1)' : 'none',
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: hovered ? 0.2 : 0.08, transition: 'opacity 0.2s' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '56px', color: C.primary }}>{icon}</span>
      </div>
      <span style={{ color: C.muted, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: ff }}>
        {label}
      </span>
      <div style={{ color: C.primary, fontSize: '32px', fontWeight: '700', lineHeight: 1, fontFamily: ff }}>
        {value ?? '—'}
      </div>
      {sub && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: subColor || C.muted, fontSize: '12px', fontWeight: '600', fontFamily: ff }}>{sub}</span>
        </div>
      )}
    </div>
  );
}

function QuickActionBtn({ icon, label, iconBg, iconColor, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: hov ? C.surfaceLow : C.white,
        border: `1px solid ${C.border}`, borderRadius: '8px',
        transition: 'all 0.15s', cursor: 'pointer', textAlign: 'left', fontFamily: ff,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '6px',
          background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: iconColor }}>{icon}</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: C.text }}>{label}</span>
      </div>
      <span className="material-symbols-outlined" style={{
        fontSize: '18px', color: C.muted,
        transform: hov ? 'translateX(2px)' : 'none', transition: 'transform 0.15s',
      }}>chevron_right</span>
    </button>
  );
}

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: C.muted, fontFamily: ff }}>
      <span className="material-symbols-outlined" style={{ fontSize: '32px', marginRight: '12px', animation: 'spin 1s linear infinite' }}>refresh</span>
      Loading dashboard…
    </div>
  );

  const maxPct = Math.max(...CHART_DATA.map(d => d.pct));

  return (
    <div style={{ maxWidth: '1200px', fontFamily: ff }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(210px, 1fr))', gap: isMobile ? '12px' : '20px', marginBottom: isMobile ? '20px' : '28px' }}>
        <StatCard icon="group" label="Total Students" value={stats?.totalStudents?.toLocaleString()} sub="Admitted students" subColor="#16a34a" onClick={() => navigate('/staff/students')} />
        <StatCard icon="badge" label="Active Staff" value={stats?.totalStaff} sub="Full faculty" subColor={C.muted} onClick={() => navigate('/staff/staff-mgmt')} />
        <StatCard icon="person_add" label="Pending Admissions" value={stats?.pendingAdmissions}
          sub={stats?.pendingAdmissions > 0 ? 'Requires review' : 'All reviewed'}
          subColor={stats?.pendingAdmissions > 0 ? C.secondary : '#16a34a'}
          onClick={() => navigate('/staff/admissions')}
        />
        <StatCard icon="menu_book" label="Subjects" value={stats?.totalSubjects} sub="Across all levels" subColor={C.muted} onClick={() => navigate('/staff/subjects')} />
      </div>

      {/* Main bento grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? '16px' : '24px', marginBottom: isMobile ? '16px' : '24px' }}>

        {/* Left: Chart + Recent students */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Enrollment chart */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: C.primary, fontSize: '18px', fontWeight: '700', margin: 0 }}>Student Enrollment Trends</h3>
              <span style={{
                background: C.surfaceLow, border: `1px solid ${C.border}`, borderRadius: '6px',
                padding: '4px 12px', fontSize: '12px', color: C.muted, fontWeight: '500',
              }}>Academic Year {new Date().getFullYear()}/{new Date().getFullYear() + 1}</span>
            </div>
            <div style={{ height: isMobile ? '160px' : '200px', display: 'flex', alignItems: 'flex-end', gap: isMobile ? '6px' : '12px', padding: '0 8px' }}>
              {CHART_DATA.map(({ month, pct }) => (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    height: `${(pct / maxPct) * 180}px`,
                    background: pct === maxPct ? C.secondary : C.surfaceHigh,
                    transition: 'background 0.2s',
                  }} />
                  <span style={{ fontSize: '11px', color: C.muted, fontWeight: '500' }}>{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent students */}
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: `${C.surfaceLow}50`,
            }}>
              <h3 style={{ color: C.primary, fontSize: '16px', fontWeight: '700', margin: 0 }}>Recent Students</h3>
              <button onClick={() => navigate('/staff/students')} style={{
                background: 'none', border: 'none', color: C.secondary, cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', fontFamily: ff,
              }}>View all</button>
            </div>
            {!stats?.recentStudents?.length ? (
              <div style={{ padding: '32px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>No students yet</div>
            ) : stats.recentStudents.map(s => (
              <div key={s._id} style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', background: C.surfaceHigh,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.primary, fontWeight: '700', fontSize: '13px', flexShrink: 0,
                }}>{s.fullName?.[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.fullName}</div>
                  <div style={{ color: C.muted, fontSize: '12px' }}>{s.class} · {s.schoolType}</div>
                </div>
                <span style={{ color: C.muted, fontSize: '12px', flexShrink: 0 }}>{s.admissionNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick actions + Recent activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Quick actions */}
          <div style={card}>
            <h3 style={{ color: C.primary, fontSize: '16px', fontWeight: '700', margin: '0 0 16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <QuickActionBtn icon="person_add" label="Add New Student" iconBg={C.secondaryContainer} iconColor={C.secondary} onClick={() => navigate('/staff/students')} />
              <QuickActionBtn icon="how_to_reg" label="Review Admissions" iconBg={C.primaryFixed} iconColor={C.primary} onClick={() => navigate('/staff/admissions')} />
              <QuickActionBtn icon="menu_book" label="Manage Subjects" iconBg={C.surfaceHigh} iconColor={C.primary} onClick={() => navigate('/staff/subjects')} />
              <QuickActionBtn icon="payments" label="Log Payment" iconBg="rgba(22,163,74,0.12)" iconColor="#16a34a" onClick={() => navigate('/staff/payments')} />
            </div>
          </div>

          {/* Recent applications timeline */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: C.primary, fontSize: '16px', fontWeight: '700', margin: 0 }}>Recent Activity</h3>
              <button onClick={() => navigate('/staff/admissions')} style={{
                background: 'none', border: 'none', color: C.secondary, cursor: 'pointer',
                fontSize: '13px', fontWeight: '600', fontFamily: ff,
              }}>View all</button>
            </div>
            {!stats?.recentApplications?.length ? (
              <div style={{ textAlign: 'center', color: C.muted, fontSize: '14px', padding: '16px 0' }}>No recent applications</div>
            ) : (
              <div style={{ borderLeft: `2px solid ${C.border}`, marginLeft: '8px', paddingLeft: '20px' }}>
                {stats.recentApplications.map((s, i) => (
                  <div key={s._id} style={{ position: 'relative', paddingBottom: i < stats.recentApplications.length - 1 ? '20px' : 0 }}>
                    <div style={{
                      position: 'absolute', left: '-29px', top: '2px',
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: i === 0 ? C.secondary : C.primary,
                      border: `2px solid ${C.white}`,
                    }} />
                    <p style={{ fontSize: '13px', fontWeight: '700', color: C.text, margin: '0 0 2px' }}>
                      New Application
                    </p>
                    <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 2px' }}>
                      {s.fullName} · {s.schoolType}
                    </p>
                    <p style={{
                      fontSize: '11px', color: C.border, margin: 0,
                    }}>{new Date(s.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending admissions table */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: `${C.surfaceLow}40`,
        }}>
          <h3 style={{ color: C.primary, fontSize: '16px', fontWeight: '700', margin: 0 }}>Pending Admissions Review</h3>
          <button onClick={() => navigate('/staff/admissions')} style={{
            background: C.primary, color: C.white, border: 'none', borderRadius: '6px',
            padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: ff,
          }}>View All Admissions</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: ff }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {['Candidate', 'Level', 'Class', 'Date', 'Status', ''].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: C.muted, borderBottom: `1px solid ${C.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!stats?.recentApplications?.length ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>No pending applications</td></tr>
              ) : stats.recentApplications.map(s => {
                const st = STATUS_COLORS[s.admissionStatus] || STATUS_COLORS.pending;
                return (
                  <tr key={s._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.surfaceLow; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%', background: C.surfaceHigh,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: C.primary, fontWeight: '700', fontSize: '12px',
                        }}>{s.fullName?.[0]}</div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: C.text }}>{s.fullName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', color: C.muted, fontSize: '14px' }}>{s.schoolType}</td>
                    <td style={{ padding: '12px 20px', color: C.muted, fontSize: '14px' }}>{s.class || '—'}</td>
                    <td style={{ padding: '12px 20px', color: C.muted, fontSize: '14px' }}>
                      {new Date(s.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                        borderRadius: '999px', fontSize: '11px', fontWeight: '700',
                        background: st.bg, color: st.color, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <button onClick={() => navigate('/staff/admissions')} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: C.primary,
                        display: 'flex', alignItems: 'center',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
