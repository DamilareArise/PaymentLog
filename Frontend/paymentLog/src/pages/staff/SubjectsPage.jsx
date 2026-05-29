import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import { C, SCHOOL_TYPES, CLASSES } from '../../utils/constants';

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', border: `1.5px solid ${C.border}`, outline: 'none', boxSizing: 'border-box', background: '#fff', color: C.text, fontFamily: 'inherit' };
const labelStyle = { color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' };

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: C.text, fontSize: '17px', fontWeight: '700', margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '22px' }}>×</button>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);

const SCHEMA = Yup.object({
  name: Yup.string().required('Subject name is required'),
  schoolType: Yup.string().required('School level is required'),
});
const INIT = { name: '', code: '', schoolType: '', classes: [] };

const LEVEL_COLORS = { Nursery: '#9B6B47', Primary: C.primary, Secondary: C.dark };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter ? { schoolType: filter } : {};
      const { data } = await api.get('/subjects', { params });
      setSubjects(data.data);
    } catch { showToast('Failed to load subjects.', 'error'); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const formik = useFormik({
    initialValues: modal?.subject ? { ...INIT, ...modal.subject } : INIT,
    enableReinitialize: true,
    validationSchema: SCHEMA,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (modal.mode === 'add') await api.post('/subjects', values);
        else await api.put(`/subjects/${modal.subject._id}`, values);
        showToast(`Subject ${modal.mode === 'add' ? 'added' : 'updated'}.`);
        setModal(null);
        fetchSubjects();
      } catch (e) { showToast(e.response?.data?.message || 'Error.', 'error'); }
      finally { setSubmitting(false); }
    },
  });

  const handleDelete = async () => {
    try {
      await api.delete(`/subjects/${deleteTarget._id}`);
      showToast('Subject deleted.');
      setDeleteTarget(null);
      fetchSubjects();
    } catch { showToast('Failed to delete.', 'error'); }
  };

  const availableClasses = formik.values.schoolType ? CLASSES[formik.values.schoolType] : [];

  const grouped = SCHOOL_TYPES.reduce((acc, t) => {
    acc[t] = subjects.filter(s => s.schoolType === t);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '900px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 300, background: toast.type === 'success' ? '#15803D' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>Subjects</h2>
          <p style={{ color: C.muted, margin: '3px 0 0', fontSize: '13px' }}>{subjects.length} subject{subjects.length !== 1 ? 's' : ''} total</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...inputStyle, maxWidth: '160px' }}>
            <option value="">All Levels</option>
            {SCHOOL_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <button onClick={() => setModal({ mode: 'add', subject: null })} style={{ background: C.primary, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Add Subject
          </button>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px', color: C.muted }}>Loading…</div>}

      {/* Grouped by level */}
      {!loading && SCHOOL_TYPES.map(level => {
        const list = grouped[level];
        if (filter && filter !== level) return null;
        return (
          <div key={level} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: LEVEL_COLORS[level] }} />
              <h3 style={{ color: C.text, fontSize: '16px', fontWeight: '700', margin: 0 }}>{level} School</h3>
              <span style={{ color: C.muted, fontSize: '13px' }}>({list.length})</span>
            </div>
            {list.length === 0 ? (
              <div style={{ padding: '20px', background: C.white, borderRadius: '10px', border: `1px dashed ${C.border}`, textAlign: 'center', color: C.muted, fontSize: '14px' }}>
                No {level} subjects yet — <button onClick={() => { setModal({ mode: 'add', subject: null }); formik.setFieldValue('schoolType', level); }} style={{ background: 'none', border: 'none', color: C.primary, cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>add one</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                {list.map(s => (
                  <div key={s._id} style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: C.text, fontWeight: '700', fontSize: '15px' }}>{s.name}</div>
                      {s.code && <div style={{ color: C.muted, fontSize: '12px', marginTop: '2px' }}>{s.code}</div>}
                      {s.classes?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                          {s.classes.map(c => (
                            <span key={c} style={{ background: C.light, color: C.primary, padding: '2px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: '600' }}>{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => setModal({ mode: 'edit', subject: s })} style={{ background: `rgba(88,56,32,0.08)`, border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: C.primary, fontSize: '12px', fontWeight: '600' }}>Edit</button>
                      <button onClick={() => setDeleteTarget(s)} style={{ background: 'rgba(220,38,38,0.08)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: '600' }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Subject' : 'Edit Subject'} onClose={() => setModal(null)}>
          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Subject Name *</label>
              <input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} style={{ ...inputStyle, borderColor: formik.touched.name && formik.errors.name ? '#DC2626' : C.border }} />
              {formik.touched.name && formik.errors.name && <span style={{ color: '#DC2626', fontSize: '12px' }}>{formik.errors.name}</span>}
            </div>
            <div>
              <label style={labelStyle}>Subject Code (optional)</label>
              <input name="code" value={formik.values.code} onChange={formik.handleChange} placeholder="e.g. MTH101" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>School Level *</label>
              <select name="schoolType" value={formik.values.schoolType} onChange={e => { formik.handleChange(e); formik.setFieldValue('classes', []); }}
                style={{ ...inputStyle, borderColor: formik.touched.schoolType && formik.errors.schoolType ? '#DC2626' : C.border }}>
                <option value="">Select level…</option>
                {SCHOOL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              {formik.touched.schoolType && formik.errors.schoolType && <span style={{ color: '#DC2626', fontSize: '12px' }}>{formik.errors.schoolType}</span>}
            </div>
            {availableClasses.length > 0 && (
              <div>
                <label style={labelStyle}>Applicable Classes</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableClasses.map(cls => (
                    <label key={cls} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: C.text }}>
                      <input type="checkbox" checked={formik.values.classes.includes(cls)}
                        onChange={e => {
                          const curr = formik.values.classes;
                          formik.setFieldValue('classes', e.target.checked ? [...curr, cls] : curr.filter(c => c !== cls));
                        }} />
                      {cls}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button type="button" onClick={() => setModal(null)} style={{ background: 'none', border: `1.5px solid ${C.border}`, padding: '9px 18px', borderRadius: '8px', fontSize: '14px', color: C.muted, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={formik.isSubmitting} style={{ background: C.primary, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                {formik.isSubmitting ? 'Saving…' : modal.mode === 'add' ? 'Add Subject' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete Subject" onClose={() => setDeleteTarget(null)}>
          <p style={{ color: C.text, fontSize: '15px', marginBottom: '24px' }}>Delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setDeleteTarget(null)} style={{ background: 'none', border: `1.5px solid ${C.border}`, padding: '9px 18px', borderRadius: '8px', fontSize: '14px', color: C.muted, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleDelete} style={{ background: '#DC2626', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
