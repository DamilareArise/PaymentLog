import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { C } from '../../utils/constants';

const ff = 'Inter, system-ui, sans-serif';

export default function StudentCBT() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cbt/student/exams')
      .then(({ data }) => setExams(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: C.muted, fontFamily: ff, fontSize: '14px' }}>
        Loading exams…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', fontFamily: ff }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>CBT Exams</h2>
        <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Your available computer-based tests</p>
      </div>

      {exams.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: C.border, display: 'block', marginBottom: '12px' }}>quiz</span>
          <div style={{ color: C.text, fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>No exams available</div>
          <div style={{ color: C.muted, fontSize: '13px' }}>Your teacher hasn't published any exams for your class yet.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {exams.map(exam => (
            <div key={exam._id} style={{
              background: C.white,
              border: `1px solid ${exam.attempted ? C.border : C.primary + '44'}`,
              borderRadius: '12px', padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '16px', flexWrap: 'wrap',
              opacity: exam.attempted ? 0.75 : 1,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: C.text }}>{exam.title}</span>
                  {exam.attempted && (
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '999px', background: 'rgba(22,163,74,0.1)', color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Completed
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: C.muted }}>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>menu_book</span>{exam.subject}</span>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>timer</span>{exam.duration} minutes</span>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>help</span>{exam.questions?.length ?? 0} questions · {exam.totalMarks} marks</span>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>flag</span>Pass: {exam.passMark}%</span>
                </div>
                {exam.instructions && (
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: C.muted, fontStyle: 'italic' }}>{exam.instructions}</p>
                )}
              </div>

              <button
                disabled={exam.attempted}
                onClick={() => navigate(`/student/exams/${exam._id}`)}
                style={{
                  background: exam.attempted ? C.surfaceLow : C.primary,
                  color: exam.attempted ? C.muted : '#fff',
                  border: 'none', borderRadius: '8px', padding: '10px 20px',
                  fontSize: '13px', fontWeight: '600', cursor: exam.attempted ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, fontFamily: ff,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {exam.attempted ? 'check_circle' : 'play_arrow'}
                </span>
                {exam.attempted ? 'Submitted' : 'Start Exam'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
