import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { C, CLASSES, SCHOOL_TYPES } from '../../utils/constants';

const ff = 'Inter, system-ui, sans-serif';
const iStyle = { width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '14px', color: C.text, background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: ff };
const lStyle = { color: C.text, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' };

const GRADE_COLOR = { A: '#15803D', B: '#2563EB', C: '#775a19', D: '#d97706', F: '#DC2626' };

const emptyExam = { title: '', subject: '', schoolType: 'Secondary', class: '', duration: 30, instructions: '', passMark: 50 };
const emptyQ = { text: '', options: ['', '', '', ''], answer: 0, mark: 1 };

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: wide ? '860px' : '560px', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: ff }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: C.text, fontSize: '17px', fontWeight: '700', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '22px', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 400, background: type === 'error' ? '#DC2626' : '#15803D', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      {msg}
    </div>
  );
}

// ─── Question Editor ──────────────────────────────────────────────────────────
function QuestionEditor({ questions, onChange }) {
  const add = () => onChange([...questions, { ...emptyQ, options: ['', '', '', ''] }]);
  const remove = (i) => onChange(questions.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const qs = questions.map((q, idx) => idx === i ? { ...q, [field]: val } : q);
    onChange(qs);
  };
  const updateOption = (qi, oi, val) => {
    const qs = questions.map((q, idx) => {
      if (idx !== qi) return q;
      const opts = [...q.options]; opts[oi] = val;
      return { ...q, options: opts };
    });
    onChange(qs);
  };

  return (
    <div>
      {questions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: C.muted, fontSize: '14px', background: C.bg, borderRadius: '8px', marginBottom: '16px' }}>
          No questions yet. Click "Add Question" to begin.
        </div>
      )}
      {questions.map((q, qi) => (
        <div key={qi} style={{ border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '700', fontSize: '13px', color: C.primary }}>Q{qi + 1}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '12px', color: C.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Marks:
                <input type="number" min="1" max="10" value={q.mark} onChange={e => update(qi, 'mark', Number(e.target.value))}
                  style={{ ...iStyle, width: '56px', padding: '4px 8px', fontSize: '13px' }} />
              </label>
              <button onClick={() => remove(qi)} style={{ background: 'rgba(220,38,38,0.08)', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: '600' }}>Remove</button>
            </div>
          </div>

          <textarea
            value={q.text}
            onChange={e => update(qi, 'text', e.target.value)}
            placeholder={`Question ${qi + 1} text…`}
            rows={2}
            style={{ ...iStyle, resize: 'vertical', marginBottom: '12px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {q.options.map((opt, oi) => (
              <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={`answer-${qi}`}
                  checked={q.answer === oi}
                  onChange={() => update(qi, 'answer', oi)}
                  style={{ accentColor: '#15803D', width: '16px', height: '16px', flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={opt}
                  onChange={e => updateOption(qi, oi, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                  style={{ ...iStyle, flex: 1, borderColor: q.answer === oi ? '#15803D' : C.border, background: q.answer === oi ? 'rgba(22,163,74,0.05)' : '#fff' }}
                />
              </label>
            ))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#15803D', fontWeight: '600' }}>
            ✓ Correct: Option {String.fromCharCode(65 + q.answer)}
          </div>
        </div>
      ))}
      <button onClick={add} style={{ background: C.surfaceLow, border: `1.5px dashed ${C.border}`, borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', color: C.primary, fontSize: '13px', fontWeight: '600', width: '100%', fontFamily: ff }}>
        + Add Question
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CBTPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modals: 'create' | 'edit' | 'questions' | 'results' | 'delete' | null
  const [modal, setModal] = useState(null);
  const [activeExam, setActiveExam] = useState(null);

  // Form state
  const [form, setForm] = useState(emptyExam);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  // Results
  const [results, setResults] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchExams = () => {
    setLoading(true);
    api.get('/cbt/exams').then(({ data }) => setExams(data.data || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchExams(); }, []);

  const availableClasses = form.schoolType ? CLASSES[form.schoolType] || [] : [];

  const openCreate = () => { setForm(emptyExam); setModal('create'); };
  const openEdit = (exam) => {
    setActiveExam(exam);
    setForm({ title: exam.title, subject: exam.subject, schoolType: exam.schoolType, class: exam.class, duration: exam.duration, instructions: exam.instructions || '', passMark: exam.passMark });
    setModal('edit');
  };
  const openQuestions = async (exam) => {
    const { data } = await api.get(`/cbt/exams/${exam._id}`);
    setActiveExam(data.data);
    setQuestions(data.data.questions || []);
    setModal('questions');
  };
  const openResults = async (exam) => {
    setActiveExam(exam);
    const { data } = await api.get(`/cbt/exams/${exam._id}/results`);
    setResults(data.data || []);
    setModal('results');
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/cbt/exams', form);
        showToast('Exam created.');
      } else {
        await api.put(`/cbt/exams/${activeExam._id}`, form);
        showToast('Exam updated.');
      }
      setModal(null);
      fetchExams();
    } catch (e) { showToast(e.response?.data?.message || 'Error saving exam.', 'error'); }
    finally { setSaving(false); }
  };

  const handleSaveQuestions = async () => {
    setSaving(true);
    try {
      await api.put(`/cbt/exams/${activeExam._id}`, { questions });
      showToast('Questions saved.');
      setModal(null);
      fetchExams();
    } catch (e) { showToast(e.response?.data?.message || 'Error saving questions.', 'error'); }
    finally { setSaving(false); }
  };

  const handlePublish = async (exam) => {
    try {
      await api.patch(`/cbt/exams/${exam._id}/publish`);
      showToast(exam.status === 'published' ? 'Exam set to draft.' : 'Exam published!');
      fetchExams();
    } catch (e) { showToast(e.response?.data?.message || 'Error.', 'error'); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/cbt/exams/${activeExam._id}`);
      showToast('Exam deleted.');
      setModal(null);
      fetchExams();
    } catch { showToast('Failed to delete.', 'error'); }
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ maxWidth: '1100px', fontFamily: ff }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: '0 0 4px' }}>CBT Exams</h2>
          <p style={{ color: C.muted, margin: 0, fontSize: '13px' }}>Create and manage computer-based tests for students</p>
        </div>
        <button onClick={openCreate} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          New Exam
        </button>
      </div>

      {/* Exam cards */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: C.muted }}>Loading exams…</div>
      ) : exams.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: C.border, display: 'block', marginBottom: '12px' }}>quiz</span>
          <div style={{ color: C.text, fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>No exams yet</div>
          <div style={{ color: C.muted, fontSize: '13px' }}>Create your first CBT exam to get started.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {exams.map(exam => (
            <div key={exam._id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: C.text }}>{exam.title}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '999px',
                    background: exam.status === 'published' ? 'rgba(22,163,74,0.1)' : 'rgba(119,90,25,0.1)',
                    color: exam.status === 'published' ? '#15803D' : '#775a19',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{exam.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: C.muted }}>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>menu_book</span>{exam.subject}</span>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>class</span>{exam.class}</span>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>timer</span>{exam.duration} min</span>
                  <span><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '3px' }}>help</span>{exam.questions?.length ?? 0} questions · {exam.totalMarks} marks</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                <Btn onClick={() => openQuestions(exam)} variant="ghost">Questions</Btn>
                <Btn onClick={() => openEdit(exam)} variant="ghost">Edit</Btn>
                <Btn onClick={() => openResults(exam)} variant="ghost">Results</Btn>
                <Btn onClick={() => handlePublish(exam)} variant={exam.status === 'published' ? 'warn' : 'primary'}>
                  {exam.status === 'published' ? 'Unpublish' : 'Publish'}
                </Btn>
                <Btn onClick={() => { setActiveExam(exam); setModal('delete'); }} variant="danger">Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit info modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'New Exam' : 'Edit Exam'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lStyle}>Exam Title *</label>
              <input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. First Term Mathematics Exam" style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Subject *</label>
              <input value={form.subject} onChange={e => setField('subject', e.target.value)} placeholder="e.g. Mathematics" style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Duration (minutes) *</label>
              <input type="number" min="5" value={form.duration} onChange={e => setField('duration', Number(e.target.value))} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>School Level *</label>
              <select value={form.schoolType} onChange={e => { setField('schoolType', e.target.value); setField('class', ''); }} style={iStyle}>
                {SCHOOL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Class *</label>
              <select value={form.class} onChange={e => setField('class', e.target.value)} style={iStyle}>
                <option value="">Select class…</option>
                {availableClasses.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Pass Mark (%)</label>
              <input type="number" min="1" max="100" value={form.passMark} onChange={e => setField('passMark', Number(e.target.value))} style={iStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lStyle}>Instructions (optional)</label>
              <textarea value={form.instructions} onChange={e => setField('instructions', e.target.value)} rows={3} placeholder="Instructions shown to students before the exam…" style={{ ...iStyle, resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={handleSaveInfo} disabled={saving || !form.title || !form.subject || !form.class}>
              {saving ? 'Saving…' : modal === 'create' ? 'Create Exam' : 'Save Changes'}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Questions modal */}
      {modal === 'questions' && (
        <Modal title={`Questions — ${activeExam?.title}`} onClose={() => setModal(null)} wide>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: C.muted }}>{questions.length} question{questions.length !== 1 ? 's' : ''} · {questions.reduce((s, q) => s + (q.mark || 1), 0)} total marks</span>
          </div>
          <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
            <QuestionEditor questions={questions} onChange={setQuestions} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: `1px solid ${C.border}`, paddingTop: '16px' }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={handleSaveQuestions} disabled={saving}>
              {saving ? 'Saving…' : 'Save Questions'}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Results modal */}
      {modal === 'results' && (
        <Modal title={`Results — ${activeExam?.title}`} onClose={() => setModal(null)} wide>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: C.muted, fontSize: '14px' }}>No submissions yet.</div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Submissions', value: results.length },
                  { label: 'Avg Score', value: `${Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)}%` },
                  { label: 'Highest', value: `${Math.max(...results.map(r => r.percentage))}%` },
                  { label: 'Pass Rate', value: `${Math.round(results.filter(r => r.percentage >= activeExam.passMark).length / results.length * 100)}%` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: C.surfaceLow, borderRadius: '8px', padding: '12px 18px', flex: 1, minWidth: '100px' }}>
                    <div style={{ color: C.muted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
                    <div style={{ color: C.text, fontSize: '20px', fontWeight: '700' }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: C.surfaceLow }}>
                      {['#', 'Student', 'Adm. No.', 'Class', 'Score', '%', 'Grade', 'Time Taken'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: C.muted, fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={r._id} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td style={{ padding: '10px 14px', color: C.muted }}>{i + 1}</td>
                        <td style={{ padding: '10px 14px', fontWeight: '600', color: C.text }}>{r.student?.fullName || '—'}</td>
                        <td style={{ padding: '10px 14px', color: C.muted, fontFamily: 'monospace' }}>{r.student?.admissionNumber || '—'}</td>
                        <td style={{ padding: '10px 14px', color: C.muted }}>{r.student?.class || '—'}</td>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>{r.score}/{r.totalMarks}</td>
                        <td style={{ padding: '10px 14px', fontWeight: '700', color: GRADE_COLOR[r.grade] || C.text }}>{r.percentage}%</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: `${GRADE_COLOR[r.grade]}20`, color: GRADE_COLOR[r.grade], fontWeight: '700', fontSize: '13px', padding: '2px 10px', borderRadius: '999px' }}>{r.grade}</span>
                        </td>
                        <td style={{ padding: '10px 14px', color: C.muted }}>{r.timeTaken ? `${Math.floor(r.timeTaken / 60)}m ${r.timeTaken % 60}s` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* Delete confirm */}
      {modal === 'delete' && (
        <Modal title="Delete Exam" onClose={() => setModal(null)}>
          <p style={{ color: C.text, fontSize: '15px', marginBottom: '8px' }}>
            Delete <strong>{activeExam?.title}</strong>? This will also remove all student results for this exam.
          </p>
          <p style={{ color: C.muted, fontSize: '13px', marginBottom: '24px' }}>This action cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={handleDelete}>Delete Exam</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', disabled }) {
  const styles = {
    primary: { bg: C.primary, color: '#fff' },
    ghost: { bg: 'transparent', color: C.muted, border: `1.5px solid ${C.border}` },
    danger: { bg: '#DC2626', color: '#fff' },
    warn: { bg: '#d97706', color: '#fff' },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? '#ccc' : styles.bg, color: disabled ? '#888' : styles.color,
      border: styles.border || 'none', borderRadius: '7px', padding: '7px 14px',
      fontSize: '13px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: ff,
    }}>
      {children}
    </button>
  );
}
