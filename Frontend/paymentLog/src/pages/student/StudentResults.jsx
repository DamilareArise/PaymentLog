import { C } from '../../utils/constants';

export default function StudentResults() {
  return (
    <div style={{ maxWidth: '760px' }}>
      {/* Empty state */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px',
        padding: '72px 40px', textAlign: 'center'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '72px', color: C.border, display: 'block', marginBottom: '20px' }}>grade</span>
        <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: '0 0 10px' }}>No Results Yet</h2>
        <p style={{ color: C.muted, fontSize: '14px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 28px' }}>
          Your exam results will appear here once you have completed CBT examinations. Results are available immediately after each exam.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: C.surfaceLow, border: `1px solid ${C.border}`, borderRadius: '8px',
          padding: '12px 20px', color: C.muted, fontSize: '13px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: C.primary }}>computer</span>
          CBT Exams are coming in Module 4
        </div>
      </div>

      {/* Results table placeholder */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', marginTop: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '700', margin: 0 }}>Exam History</h3>
          <span style={{ color: C.muted, fontSize: '12px' }}>0 exams completed</span>
        </div>
        <div style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.surfaceLow }}>
                {['Subject', 'Exam Title', 'Date', 'Score', 'Grade'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: C.muted
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
                  No exam records found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
