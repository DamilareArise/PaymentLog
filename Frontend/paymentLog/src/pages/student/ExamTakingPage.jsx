import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { C } from '../../utils/constants';

const ff = 'Inter, system-ui, sans-serif';
const GRADE_COLOR = { A: '#15803D', B: '#2563EB', C: '#775a19', D: '#d97706', F: '#DC2626' };

function pad(n) { return String(n).padStart(2, '0'); }

export default function ExamTakingPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('loading'); // loading | briefing | active | submitted
  const [exam, setExam] = useState(null);
  const [error, setError] = useState('');

  // Exam state
  const [answers, setAnswers] = useState([]); // -1 = unanswered
  const [current, setCurrent] = useState(0);
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Result
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/cbt/student/exams/${examId}`)
      .then(({ data }) => {
        setExam(data.data);
        setAnswers(new Array(data.data.questions.length).fill(-1));
        setTimeLeft(data.data.duration * 60);
        setPhase('briefing');
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Exam not available.');
        setPhase('error');
      });
  }, [examId]);

  const submit = useCallback(async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    const timeTaken = exam ? exam.duration * 60 - timeLeft : 0;
    try {
      const { data } = await api.post(`/cbt/student/exams/${examId}/submit`, { answers, timeTaken });
      setResult(data.data);
      setPhase('submitted');
    } catch (e) {
      setError(e.response?.data?.message || 'Submission failed.');
      if (!auto) setSubmitting(false);
    }
  }, [answers, examId, exam, timeLeft, submitting]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'active') return;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line

  const answered = answers.filter(a => a !== -1).length;
  const total = exam?.questions?.length ?? 0;
  const timerWarning = timeLeft < 120;

  if (phase === 'loading') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', fontFamily: ff, color: C.muted }}>Loading exam…</div>
  );

  if (phase === 'error') return (
    <div style={{ maxWidth: '480px', margin: '60px auto', textAlign: 'center', fontFamily: ff }}>
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: C.error, display: 'block', marginBottom: '12px' }}>error</span>
      <div style={{ color: C.text, fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>Unable to load exam</div>
      <div style={{ color: C.muted, fontSize: '14px', marginBottom: '24px' }}>{error}</div>
      <button onClick={() => navigate('/student/exams')} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: ff }}>
        Back to Exams
      </button>
    </div>
  );

  // ── Briefing screen ──────────────────────────────────────────────────────────
  if (phase === 'briefing') return (
    <div style={{ maxWidth: '600px', fontFamily: ff }}>
      <div style={{
        background: `linear-gradient(135deg, #000f22 0%, #001d3d 55%, #003566 100%)`,
        borderRadius: '12px', padding: '32px', marginBottom: '24px', color: '#fff',
      }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '8px', fontWeight: '500' }}>You are about to start</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{exam.title}</h2>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{exam.subject} · {exam.class}</div>
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ color: C.text, fontSize: '14px', fontWeight: '700', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Exam Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { icon: 'help', label: 'Questions', value: `${total}` },
            { icon: 'timer', label: 'Duration', value: `${exam.duration} minutes` },
            { icon: 'grade', label: 'Total Marks', value: `${exam.totalMarks}` },
            { icon: 'flag', label: 'Pass Mark', value: `${exam.passMark}%` },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: C.surfaceLow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: C.primary }}>{icon}</span>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: C.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: C.text }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {exam.instructions && (
        <div style={{ background: 'rgba(119,90,25,0.07)', border: '1px solid rgba(119,90,25,0.2)', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ fontWeight: '700', fontSize: '13px', color: '#775a19', marginBottom: '6px' }}>Instructions</div>
          <p style={{ color: '#5b4132', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{exam.instructions}</p>
        </div>
      )}

      <div style={{ background: C.surfaceLow, borderRadius: '8px', padding: '14px 16px', marginBottom: '24px', fontSize: '13px', color: C.muted, lineHeight: 1.6 }}>
        <strong style={{ color: C.text }}>Important:</strong> Once you start, the timer cannot be paused. Make sure you have a stable internet connection before proceeding.
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => navigate('/student/exams')} style={{ background: C.surfaceLow, color: C.text, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: ff }}>
          Cancel
        </button>
        <button onClick={() => setPhase('active')} style={{ flex: 1, background: C.primary, color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: ff, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_arrow</span>
          Start Exam
        </button>
      </div>
    </div>
  );

  // ── Result screen ────────────────────────────────────────────────────────────
  if (phase === 'submitted' && result) {
    const passed = result.percentage >= exam.passMark;
    return (
      <div style={{ maxWidth: '600px', fontFamily: ff }}>
        <div style={{
          background: passed ? 'linear-gradient(135deg, #14532d, #15803D)' : 'linear-gradient(135deg, #7f1d1d, #DC2626)',
          borderRadius: '12px', padding: '36px', marginBottom: '24px', color: '#fff', textAlign: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '56px', display: 'block', marginBottom: '12px' }}>
            {passed ? 'emoji_events' : 'sentiment_dissatisfied'}
          </span>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '6px' }}>
            {passed ? 'Congratulations! You passed.' : 'Keep studying — you can do better!'}
          </div>
          <div style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.02em' }}>{result.percentage}%</div>
          <div style={{ fontSize: '14px', opacity: 0.75, marginTop: '6px' }}>
            {result.score} / {result.totalMarks} marks
          </div>
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Grade</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: GRADE_COLOR[result.grade] || C.text }}>{result.grade}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Score</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: C.text }}>{result.score}/{result.totalMarks}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Time Taken</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: C.text }}>{pad(Math.floor(result.timeTaken / 60))}:{pad(result.timeTaken % 60)}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/student/results')} style={{ flex: 1, background: C.surfaceLow, color: C.text, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: ff }}>
            View All Results
          </button>
          <button onClick={() => navigate('/student/exams')} style={{ flex: 1, background: C.primary, color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: ff }}>
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  // ── Active exam ──────────────────────────────────────────────────────────────
  const q = exam.questions[current];

  return (
    <div style={{ maxWidth: '900px', fontFamily: ff }}>
      {/* Top bar */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px',
        padding: '14px 20px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: C.text }}>{exam.title}</div>
          <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px' }}>{answered}/{total} answered</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: timerWarning ? 'rgba(220,38,38,0.08)' : C.surfaceLow,
          border: `1px solid ${timerWarning ? '#DC2626' : C.border}`,
          borderRadius: '8px', padding: '8px 16px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: timerWarning ? '#DC2626' : C.primary }}>timer</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: timerWarning ? '#DC2626' : C.text, fontVariantNumeric: 'tabular-nums' }}>
            {pad(Math.floor(timeLeft / 60))}:{pad(timeLeft % 60)}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', alignItems: 'start' }}>
        {/* Question card */}
        <div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '28px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Question {current + 1} of {total}
              </span>
              <button
                onClick={() => setFlagged(f => { const n = new Set(f); n.has(current) ? n.delete(current) : n.add(current); return n; })}
                style={{
                  background: flagged.has(current) ? 'rgba(217,119,6,0.1)' : 'transparent',
                  border: `1px solid ${flagged.has(current) ? '#d97706' : C.border}`,
                  borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                  color: flagged.has(current) ? '#d97706' : C.muted,
                  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>flag</span>
                {flagged.has(current) ? 'Flagged' : 'Flag'}
              </button>
            </div>

            <p style={{ fontSize: '16px', fontWeight: '600', color: C.text, lineHeight: 1.6, margin: '0 0 24px' }}>{q.text}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {q.options.map((opt, oi) => {
                const selected = answers[current] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setAnswers(a => { const n = [...a]; n[current] = oi; return n; })}
                    style={{
                      width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: '8px', cursor: 'pointer',
                      border: `2px solid ${selected ? C.primary : C.border}`,
                      background: selected ? C.surfaceLow : '#fff',
                      fontFamily: ff, fontSize: '14px', color: C.text, fontWeight: selected ? '700' : '400',
                      display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.1s',
                    }}
                  >
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, fontSize: '12px', fontWeight: '700',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: selected ? C.primary : C.surfaceHigh,
                      color: selected ? '#fff' : C.muted,
                    }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
            <button
              disabled={current === 0}
              onClick={() => setCurrent(c => c - 1)}
              style={{ background: C.surfaceLow, color: current === 0 ? C.muted : C.text, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: current === 0 ? 'not-allowed' : 'pointer', fontFamily: ff, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span> Previous
            </button>
            {current < total - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: ff, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Next <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={() => submit(false)}
                disabled={submitting}
                style={{ background: '#15803D', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: ff, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                {submitting ? 'Submitting…' : 'Submit Exam'}
              </button>
            )}
          </div>
        </div>

        {/* Question navigator */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px', position: 'sticky', top: '80px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Question Navigator</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {exam.questions.map((_, idx) => {
              const isAnswered = answers[idx] !== -1;
              const isCurrent = idx === current;
              const isFlagged = flagged.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', border: `2px solid ${isCurrent ? C.primary : isAnswered ? '#15803D' : C.border}`,
                    background: isCurrent ? C.primary : isAnswered ? 'rgba(22,163,74,0.1)' : '#fff',
                    color: isCurrent ? '#fff' : isAnswered ? '#15803D' : C.muted,
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: ff,
                    position: 'relative',
                  }}
                >
                  {idx + 1}
                  {isFlagged && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} />}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(22,163,74,0.1)', border: '2px solid #15803D', display: 'inline-block' }} />
              Answered ({answered})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fff', border: `2px solid ${C.border}`, display: 'inline-block' }} />
              Unanswered ({total - answered})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d97706', display: 'inline-block' }} />
              Flagged ({flagged.size})
            </div>
          </div>
          {answered === total && (
            <button
              onClick={() => submit(false)}
              disabled={submitting}
              style={{ width: '100%', marginTop: '16px', background: '#15803D', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: ff }}
            >
              {submitting ? 'Submitting…' : 'Submit Exam'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
