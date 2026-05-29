import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { C } from '../../utils/constants';

function SubjectCard({ subject }) {
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px',
      padding: '20px', transition: 'border-color 0.15s, box-shadow 0.15s'
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 2px 12px ${C.border}`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '8px', background: C.surfaceHigh,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: '20px' }}>menu_book</span>
        </div>
        <span style={{
          background: C.surfaceHigh, color: C.muted, fontSize: '10px', fontWeight: '600',
          padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>
          {subject.schoolType}
        </span>
      </div>
      <h4 style={{ color: C.text, fontSize: '15px', fontWeight: '700', margin: '0 0 6px' }}>{subject.name}</h4>
      {subject.classes?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
          {subject.classes.map(cls => (
            <span key={cls} style={{
              background: C.surfaceContainer, color: C.primary,
              fontSize: '11px', padding: '2px 8px', borderRadius: '4px'
            }}>{cls}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentSubjects() {
  const { user } = useAuth();
  const profile = user?.profile;
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;
    const fetchSubjects = async () => {
      try {
        const params = new URLSearchParams();
        if (profile.schoolType) params.append('schoolType', profile.schoolType);
        const { data } = await api.get(`/subjects?${params}`);
        // Filter to subjects that include the student's class (or show all for the school type)
        const all = data.data || [];
        const relevant = profile.class
          ? all.filter(s => !s.classes?.length || s.classes.includes(profile.class))
          : all;
        setSubjects(relevant);
      } catch {
        setError('Unable to load subjects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [profile]);

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: C.muted }}>
        Profile not found. Please contact the school administration.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>My Subjects</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {profile.class && (
              <span style={{ background: C.primary, color: C.white, fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '4px' }}>
                {profile.class}
              </span>
            )}
            {profile.schoolType && (
              <span style={{ background: C.surfaceHigh, color: C.muted, fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '4px', border: `1px solid ${C.border}` }}>
                {profile.schoolType}
              </span>
            )}
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: '13px', margin: '6px 0 0' }}>
          Subjects assigned to your class level
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: C.muted }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>refresh</span>
          Loading subjects…
        </div>
      ) : error ? (
        <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '8px', padding: '20px', color: '#DC2626', textAlign: 'center' }}>
          {error}
        </div>
      ) : subjects.length === 0 ? (
        <div style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px',
          padding: '60px', textAlign: 'center', color: C.muted
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px', color: C.border }}>menu_book</span>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>No subjects found</div>
          <div style={{ fontSize: '13px' }}>
            {profile.admissionStatus !== 'admitted'
              ? 'Subjects will be visible once your admission is confirmed.'
              : 'No subjects have been assigned to your class yet. Please check back later.'}
          </div>
        </div>
      ) : (
        <>
          <div style={{ color: C.muted, fontSize: '12px', marginBottom: '16px' }}>
            {subjects.length} subject{subjects.length !== 1 ? 's' : ''} found
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {subjects.map(subject => (
              <SubjectCard key={subject._id} subject={subject} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
