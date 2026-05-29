import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { C, STATUS_COLORS } from '../../utils/constants';

const ff = 'Inter, system-ui, sans-serif';

function StatCard({ icon, label, value, iconBg, iconColor }) {
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
      padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
      fontFamily: ff, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: iconBg || C.surfaceHigh, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: iconColor || C.primary }}>{icon}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{label}</div>
        <div style={{ color: C.text, fontSize: '16px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, to, iconBg, iconColor, navigate: nav }) {
  return (
    <button
      onClick={() => nav(to)}
      style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
        padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '10px', cursor: 'pointer', transition: 'all 0.15s', width: '100%',
        fontFamily: ff,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.surfaceLow; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.white; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: iconBg || C.surfaceHigh,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: iconColor || C.primary }}>{icon}</span>
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: C.text, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </button>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = user?.profile;
  const statusInfo = STATUS_COLORS[profile?.admissionStatus] || STATUS_COLORS.pending;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ maxWidth: '960px', fontFamily: ff }}>

      {/* Welcome banner */}
      <div style={{
        background: `linear-gradient(135deg, #000f22 0%, #001d3d 55%, #003566 100%)`,
        borderRadius: '12px', padding: '32px 36px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orb */}
        <div style={{
          position: 'absolute', right: '140px', top: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '40px', bottom: '-80px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(119,90,25,0.15)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>
            {greeting()},
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '26px', fontWeight: '700', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            {profile?.fullName || 'Student'}
          </h2>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            Welcome to your student portal — Ore Ofe Oluwa Schools
          </div>
        </div>

        <div style={{ textAlign: 'right', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: statusInfo.bg, color: statusInfo.color,
            fontWeight: '700', fontSize: '11px', padding: '6px 16px',
            borderRadius: '999px', letterSpacing: '0.06em', textTransform: 'uppercase',
            border: `1px solid ${statusInfo.color}33`,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusInfo.color, display: 'inline-block' }} />
            {statusInfo.label}
          </div>
          {profile?.admissionNumber && (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
              {profile.admissionNumber}
            </div>
          )}
        </div>
      </div>

      {/* Admission status alerts */}
      {profile?.admissionStatus === 'pending' && (
        <div style={{
          background: 'rgba(119,90,25,0.07)', border: '1px solid rgba(119,90,25,0.2)',
          borderRadius: '8px', padding: '14px 20px', marginBottom: '24px',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#775a19', fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>info</span>
          <div>
            <div style={{ color: '#775a19', fontWeight: '700', fontSize: '13px', marginBottom: '2px' }}>Application Under Review</div>
            <div style={{ color: '#5b4132', fontSize: '12px', lineHeight: 1.5 }}>
              Your admission application is currently being reviewed by the admissions board. You will be notified once a decision is made.
            </div>
          </div>
        </div>
      )}

      {profile?.admissionStatus === 'not_admitted' && (
        <div style={{
          background: 'rgba(186,26,26,0.06)', border: '1px solid rgba(186,26,26,0.2)',
          borderRadius: '8px', padding: '14px 20px', marginBottom: '24px',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#ba1a1a', fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>cancel</span>
          <div>
            <div style={{ color: '#ba1a1a', fontWeight: '700', fontSize: '13px', marginBottom: '2px' }}>Admission Not Granted</div>
            <div style={{ color: '#93000a', fontSize: '12px', lineHeight: 1.5 }}>
              We regret to inform you that your admission application was not successful at this time. Please contact the admissions office for further information.
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon="badge" label="Admission No." value={profile?.admissionNumber}
          iconBg="rgba(0,15,34,0.08)" iconColor={C.primary} />
        <StatCard icon="class" label="Current Class" value={profile?.class}
          iconBg="rgba(119,90,25,0.1)" iconColor={C.secondary} />
        <StatCard icon="school" label="School Level" value={profile?.schoolType}
          iconBg="rgba(22,163,74,0.08)" iconColor="#15803D" />
        <StatCard icon="person" label="Gender" value={profile?.gender}
          iconBg="rgba(59,130,246,0.08)" iconColor="#2563EB" />
      </div>

      {/* Quick Actions */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
        padding: '24px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '700', margin: 0, letterSpacing: '-0.01em' }}>
            Quick Actions
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <QuickAction icon="person" label="View Profile" to="/student/profile" navigate={navigate}
            iconBg="rgba(0,15,34,0.08)" iconColor={C.primary} />
          <QuickAction icon="menu_book" label="My Subjects" to="/student/subjects" navigate={navigate}
            iconBg="rgba(119,90,25,0.1)" iconColor={C.secondary} />
          <QuickAction icon="computer" label="CBT Exams" to="/student/exams" navigate={navigate}
            iconBg="rgba(59,130,246,0.08)" iconColor="#2563EB" />
          <QuickAction icon="grade" label="My Results" to="/student/results" navigate={navigate}
            iconBg="rgba(22,163,74,0.08)" iconColor="#15803D" />
        </div>
      </div>

      {/* Parent / Guardian */}
      {(profile?.parentName || profile?.parentPhone || profile?.parentEmail) && (
        <div style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
          padding: '24px',
        }}>
          <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '700', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            Parent / Guardian
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {profile?.parentName && (
              <div>
                <div style={{ color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Full Name</div>
                <div style={{ color: C.text, fontSize: '14px', fontWeight: '500' }}>{profile.parentName}</div>
              </div>
            )}
            {profile?.parentPhone && (
              <div>
                <div style={{ color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Phone</div>
                <div style={{ color: C.text, fontSize: '14px', fontWeight: '500' }}>{profile.parentPhone}</div>
              </div>
            )}
            {profile?.parentEmail && (
              <div>
                <div style={{ color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Email</div>
                <div style={{ color: C.text, fontSize: '14px', fontWeight: '500' }}>{profile.parentEmail}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
