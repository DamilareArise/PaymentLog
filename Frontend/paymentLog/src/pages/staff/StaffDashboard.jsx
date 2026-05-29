import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { C, STATUS_COLORS } from '../../utils/constants';

const StatCard = ({ icon, label, value, sub, color, onClick }) => (
  <div onClick={onClick} style={{
    background: C.white, borderRadius: '16px', padding: '24px',
    border: `1px solid ${C.border}`, cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex', flexDirection: 'column', gap: '12px'
  }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(88,56,32,0.12)'; }}}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
      }}>{icon}</div>
    </div>
    <div>
      <div style={{ color: C.text, fontSize: '28px', fontWeight: '800' }}>{value ?? '—'}</div>
      <div style={{ color: C.muted, fontSize: '13px', marginTop: '2px' }}>{label}</div>
      {sub && <div style={{ color, fontSize: '12px', marginTop: '6px', fontWeight: '600' }}>{sub}</div>}
    </div>
  </div>
);

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <div style={{ color: C.muted, fontSize: '15px' }}>Loading dashboard…</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ color: C.text, fontSize: '22px', fontWeight: '700', margin: 0 }}>Welcome back 👋</h2>
        <p style={{ color: C.muted, margin: '4px 0 0', fontSize: '14px' }}>Here's what's happening at Ore Ofe Oluwa Schools today.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon="👥" label="Admitted Students" value={stats?.totalStudents} color="#583820" onClick={() => navigate('/staff/students')} />
        <StatCard icon="👔" label="Active Staff" value={stats?.totalStaff} color="#16A34A" onClick={() => navigate('/staff/staff-mgmt')} />
        <StatCard icon="📚" label="Subjects" value={stats?.totalSubjects} color="#2563EB" onClick={() => navigate('/staff/subjects')} />
        <StatCard icon="📋" label="Pending Admissions" value={stats?.pendingAdmissions}
          sub={stats?.pendingAdmissions > 0 ? 'Needs review' : 'All reviewed'}
          color={stats?.pendingAdmissions > 0 ? '#D97706' : '#16A34A'}
          onClick={() => navigate('/staff/admissions')}
        />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        {/* Recent students */}
        <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: C.text, fontSize: '15px', fontWeight: '700', margin: 0 }}>Recent Students</h3>
            <button onClick={() => navigate('/staff/students')} style={{
              background: 'none', border: 'none', color: C.primary, cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>View all →</button>
          </div>
          <div>
            {stats?.recentStudents?.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>No students yet</div>
            )}
            {stats?.recentStudents?.map(s => (
              <div key={s._id} style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                borderBottom: `1px solid ${C.border}`
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: `rgba(88,56,32,0.1)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.primary, fontWeight: '700', fontSize: '14px', flexShrink: 0
                }}>{s.fullName?.[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.fullName}</div>
                  <div style={{ color: C.muted, fontSize: '12px' }}>{s.class} · {s.schoolType}</div>
                </div>
                <div style={{ color: C.muted, fontSize: '12px', flexShrink: 0 }}>
                  {s.admissionNumber}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending applications */}
        <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: C.text, fontSize: '15px', fontWeight: '700', margin: 0 }}>Pending Applications</h3>
            <button onClick={() => navigate('/staff/admissions')} style={{
              background: 'none', border: 'none', color: C.primary, cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>Review →</button>
          </div>
          <div>
            {stats?.recentApplications?.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>No pending applications</div>
            )}
            {stats?.recentApplications?.map(s => (
              <div key={s._id} style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                borderBottom: `1px solid ${C.border}`
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(217,119,6,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#B45309', fontWeight: '700', fontSize: '14px', flexShrink: 0
                }}>{s.fullName?.[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.fullName}</div>
                  <div style={{ color: C.muted, fontSize: '12px' }}>{s.class || 'Class TBD'} · {s.schoolType}</div>
                </div>
                <span style={{
                  background: STATUS_COLORS.pending.bg, color: STATUS_COLORS.pending.color,
                  fontSize: '11px', padding: '3px 8px', borderRadius: '50px', fontWeight: '600', flexShrink: 0
                }}>Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: '20px', background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, padding: '20px' }}>
        <h3 style={{ color: C.text, fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: '+ Add Student', path: '/staff/students', color: C.primary },
            { label: '📋 Review Admissions', path: '/staff/admissions', color: '#D97706' },
            { label: '📚 Add Subject', path: '/staff/subjects', color: '#2563EB' },
            { label: '💰 Log Payment', path: '/staff/payments', color: '#16A34A' },
          ].map(({ label, path, color }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              background: `${color}12`, border: `1.5px solid ${color}30`, color,
              padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.15s'
            }}
              onMouseEnter={e => { e.target.style.background = `${color}20`; }}
              onMouseLeave={e => { e.target.style.background = `${color}12`; }}
            >{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
