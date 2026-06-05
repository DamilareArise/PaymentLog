import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { C } from '../../utils/constants';

const ff = 'Inter, system-ui, sans-serif';
const GRADE_COLOR = { A: '#15803D', B: '#2563EB', C: '#775a19', D: '#d97706', F: '#DC2626' };

function pad(n) { return String(n).padStart(2, '0'); }

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cbt/student/results')
      .then(({ data }) => setResults(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: C.muted, fontFamily: ff, fontSize: '14px' }}>
      Loading results…
    </div>
  );

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  const best = results.length ? Math.max(...results.map(r => r.percentage)) : 0;
  const passed = results.filter(r => r.exam && r.percentage >= (r.exam.passMark || 50)).length;

  return (
    <div style={{ maxWidth: '900px', fontFamily: ff }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>My Results</h2>
        <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Your CBT exam history and scores</p>
      </div>

      {/* Summary cards */}
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { icon: 'quiz', label: 'Exams Taken', value: results.length, iconBg: 'rgba(0,15,34,0.08)', iconColor: C.primary },
            { icon: 'percent', label: 'Average Score', value: `${avg}%`, iconBg: 'rgba(37,99,235,0.08)', iconColor: '#2563EB' },
            { icon: 'emoji_events', label: 'Best Score', value: `${best}%`, iconBg: 'rgba(119,90,25,0.1)', iconColor: C.secondary },
            { icon: 'check_circle', label: 'Passed', value: `${passed}/${results.length}`, iconBg: 'rgba(22,163,74,0.08)', iconColor: '#15803D' },
          ].map(({ icon, label, value, iconBg, iconColor }) => (
            <div key={label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '9px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: iconColor }}>{icon}</span>
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>{label}</div>
                <div style={{ color: C.text, fontSize: '16px', fontWeight: '700' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results table */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '700', margin: 0 }}>Exam History</h3>
          <span style={{ color: C.muted, fontSize: '12px' }}>{results.length} exam{results.length !== 1 ? 's' : ''} completed</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.surfaceLow }}>
                {['#', 'Exam Title', 'Subject', 'Score', '%', 'Grade', 'Time', 'Date'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: C.muted, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: C.muted }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px', color: C.border }}>grade</span>
                    No exam results yet. Complete a CBT exam to see your results here.
                  </td>
                </tr>
              ) : results.map((r, i) => (
                <tr key={r._id} style={{ borderTop: `1px solid ${C.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', color: C.muted, fontSize: '13px' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', fontSize: '14px', color: C.text }}>{r.exam?.title || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{r.exam?.subject || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: C.text }}>{r.score}/{r.totalMarks}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: GRADE_COLOR[r.grade] || C.text }}>{r.percentage}%</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: `${GRADE_COLOR[r.grade]}18`, color: GRADE_COLOR[r.grade], fontWeight: '800', fontSize: '14px', padding: '3px 12px', borderRadius: '999px' }}>
                      {r.grade}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>
                    {r.timeTaken ? `${pad(Math.floor(r.timeTaken / 60))}:${pad(r.timeTaken % 60)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: C.muted, whiteSpace: 'nowrap' }}>
                    {new Date(r.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
