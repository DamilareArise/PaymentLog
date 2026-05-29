import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import { C, CLASSES, SCHOOL_TYPES, STATUS_COLORS } from '../../utils/constants';

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', border: `1.5px solid ${C.border}`, outline: 'none', boxSizing: 'border-box', background: '#fff', color: C.text, fontFamily: 'inherit' };
const labelStyle = { color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' };
const Btn = ({ children, onClick, type = 'button', variant = 'primary', disabled }) => {
  const bg = { primary: C.primary, danger: '#DC2626', ghost: 'transparent', gold: C.gold }[variant];
  const col = { primary: '#fff', danger: '#fff', ghost: C.muted, gold: C.vdark }[variant];
  const brd = variant === 'ghost' ? `1.5px solid ${C.border}` : 'none';
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: disabled ? '#ccc' : bg, color: disabled ? '#888' : col, border: brd,
      padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s'
    }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = '0.85'; }}
      onMouseLeave={e => { e.target.style.opacity = '1'; }}
    >{children}</button>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: C.text, fontSize: '17px', fontWeight: '700', margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '22px', lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);

const SCHEMA = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  gender: Yup.string().required('Gender is required'),
  schoolType: Yup.string().required('School type is required'),
  class: Yup.string().required('Class is required'),
  parentName: Yup.string().required('Parent name is required'),
  parentPhone: Yup.string().required('Parent phone is required'),
});

const INIT = { fullName: '', gender: '', dateOfBirth: '', schoolType: '', class: '', section: '', address: '', parentName: '', parentPhone: '', parentEmail: '', email: '', phone: '', admissionStatus: 'admitted' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ schoolType: '', class: '', admissionStatus: 'admitted' });
  const [page, setPage] = useState(1);
  const LIMIT = 15;
  const [modal, setModal] = useState(null); // null | { mode:'add'|'edit', student }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createAccountModal, setCreateAccountModal] = useState(null);
  const [accountForm, setAccountForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, ...filters };
      if (search) params.search = search;
      const { data } = await api.get('/students', { params });
      setStudents(data.data);
      setTotal(data.total);
    } catch { showToast('Failed to load students.', 'error'); }
    finally { setLoading(false); }
  }, [page, filters, search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const formik = useFormik({
    initialValues: modal?.student ? { ...INIT, ...modal.student } : INIT,
    enableReinitialize: true,
    validationSchema: SCHEMA,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (modal.mode === 'add') await api.post('/students', values);
        else await api.put(`/students/${modal.student._id}`, values);
        showToast(`Student ${modal.mode === 'add' ? 'added' : 'updated'} successfully.`);
        setModal(null);
        fetchStudents();
      } catch (e) { showToast(e.response?.data?.message || 'Error saving student.', 'error'); }
      finally { setSubmitting(false); }
    },
  });

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${deleteTarget._id}`);
      showToast('Student deleted.');
      setDeleteTarget(null);
      fetchStudents();
    } catch { showToast('Failed to delete student.', 'error'); }
  };

  const handleCreateAccount = async () => {
    try {
      await api.post('/auth/create-user', {
        email: accountForm.email,
        password: accountForm.password,
        role: 'student',
        referenceId: createAccountModal._id,
      });
      showToast('Login account created successfully.');
      setCreateAccountModal(null);
      setAccountForm({ email: '', password: '' });
      fetchStudents();
    } catch (e) { showToast(e.response?.data?.message || 'Failed to create account.', 'error'); }
  };

  const pages = Math.ceil(total / LIMIT);
  const availableClasses = formik.values.schoolType ? CLASSES[formik.values.schoolType] : [];
  const filterClasses = filters.schoolType ? CLASSES[filters.schoolType] : [];

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 300, background: toast.type === 'success' ? '#15803D' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>Students</h2>
          <p style={{ color: C.muted, margin: '3px 0 0', fontSize: '13px' }}>{total} student{total !== 1 ? 's' : ''} found</p>
        </div>
        <Btn onClick={() => setModal({ mode: 'add', student: null })}>+ Add Student</Btn>
      </div>

      {/* Filters */}
      <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name…" style={{ ...inputStyle, maxWidth: '240px', flex: '1 1 160px' }} />
        <select value={filters.schoolType} onChange={e => { setFilters(f => ({ ...f, schoolType: e.target.value, class: '' })); setPage(1); }} style={{ ...inputStyle, maxWidth: '160px' }}>
          <option value="">All Levels</option>
          {SCHOOL_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filters.class} onChange={e => { setFilters(f => ({ ...f, class: e.target.value })); setPage(1); }} style={{ ...inputStyle, maxWidth: '140px' }} disabled={!filters.schoolType}>
          <option value="">All Classes</option>
          {filterClasses.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filters.admissionStatus} onChange={e => { setFilters(f => ({ ...f, admissionStatus: e.target.value })); setPage(1); }} style={{ ...inputStyle, maxWidth: '160px' }}>
          <option value="">All Statuses</option>
          <option value="admitted">Admitted</option>
          <option value="pending">Pending</option>
          <option value="not_admitted">Not Admitted</option>
        </select>
        {(search || filters.schoolType || filters.class || filters.admissionStatus) && (
          <button onClick={() => { setSearch(''); setFilters({ schoolType: '', class: '', admissionStatus: '' }); setPage(1); }} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '13px' }}>Clear filters</button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.light }}>
                {['Adm. No.', 'Full Name', 'Class', 'Gender', 'Parent Phone', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: C.muted, fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>Loading…</td></tr>
              )}
              {!loading && students.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>No students found</td></tr>
              )}
              {students.map((s, i) => {
                const sc = STATUS_COLORS[s.admissionStatus] || STATUS_COLORS.pending;
                return (
                  <tr key={s._id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#FDFAF7' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted, fontFamily: 'monospace' }}>{s.admissionNumber || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: C.text }}>{s.fullName}</div>
                      <div style={{ fontSize: '12px', color: C.muted }}>{s.schoolType}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: C.text }}>{s.class || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: C.text }}>{s.gender || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{s.parentPhone || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '600' }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => setModal({ mode: 'edit', student: s })} style={{ background: `rgba(88,56,32,0.08)`, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: C.primary, fontSize: '13px', fontWeight: '600' }}>Edit</button>
                        {!s.userId && (
                          <button onClick={() => { setCreateAccountModal(s); setAccountForm({ email: s.email || '', password: '' }); }} style={{ background: 'rgba(37,99,235,0.08)', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#2563EB', fontSize: '13px', fontWeight: '600' }}>Create Login</button>
                        )}
                        <button onClick={() => setDeleteTarget(s)} style={{ background: 'rgba(220,38,38,0.08)', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#DC2626', fontSize: '13px', fontWeight: '600' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: C.muted, fontSize: '13px' }}>Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', borderRadius: '6px', border: `1.5px solid ${C.border}`, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? C.muted : C.text, fontSize: '13px' }}>← Prev</button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1.5px solid ${p === page ? C.primary : C.border}`, background: p === page ? C.primary : '#fff', color: p === page ? '#fff' : C.text, cursor: 'pointer', fontWeight: p === page ? '700' : '400', fontSize: '13px' }}>{p}</button>
              ))}
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', borderRadius: '6px', border: `1.5px solid ${C.border}`, background: '#fff', cursor: page === pages ? 'not-allowed' : 'pointer', color: page === pages ? C.muted : C.text, fontSize: '13px' }}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add New Student' : 'Edit Student'} onClose={() => setModal(null)}>
          <form onSubmit={formik.handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { name: 'fullName', label: 'Full Name *', span: 2 },
                { name: 'gender', label: 'Gender *', type: 'select', opts: ['Male', 'Female'] },
                { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                { name: 'schoolType', label: 'School Level *', type: 'select', opts: SCHOOL_TYPES, onChange: (e) => { formik.handleChange(e); formik.setFieldValue('class', ''); } },
                { name: 'class', label: 'Class *', type: 'select', opts: availableClasses },
                { name: 'section', label: 'Section' },
                { name: 'admissionStatus', label: 'Status *', type: 'select', opts: ['admitted', 'pending', 'not_admitted'] },
                { name: 'parentName', label: 'Parent / Guardian Name *', span: 2 },
                { name: 'parentPhone', label: 'Parent Phone *' },
                { name: 'parentEmail', label: 'Parent Email', type: 'email' },
                { name: 'address', label: 'Address', span: 2 },
                { name: 'email', label: 'Student Email', type: 'email' },
                { name: 'phone', label: 'Student Phone' },
              ].map(({ name, label, type, opts, span, onChange }) => (
                <div key={name} style={{ gridColumn: span === 2 ? '1 / -1' : 'auto' }}>
                  <label style={labelStyle}>{label}</label>
                  {type === 'select' ? (
                    <select name={name} value={formik.values[name]} onChange={onChange || formik.handleChange} onBlur={formik.handleBlur}
                      style={{ ...inputStyle, borderColor: formik.touched[name] && formik.errors[name] ? '#DC2626' : C.border }}>
                      <option value="">Select…</option>
                      {opts?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type || 'text'} name={name} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      style={{ ...inputStyle, borderColor: formik.touched[name] && formik.errors[name] ? '#DC2626' : C.border }} />
                  )}
                  {formik.touched[name] && formik.errors[name] && <span style={{ color: '#DC2626', fontSize: '12px' }}>{formik.errors[name]}</span>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Saving…' : modal.mode === 'add' ? 'Add Student' : 'Save Changes'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Login Account Modal */}
      {createAccountModal && (
        <Modal title={`Create Login — ${createAccountModal.fullName}`} onClose={() => setCreateAccountModal(null)}>
          <p style={{ color: C.muted, fontSize: '14px', marginBottom: '20px' }}>
            This creates a login account so the student can access their portal at <strong>/student-login</strong>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Email (used to log in)</label>
              <input type="email" value={accountForm.email} onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} placeholder="student@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={accountForm.password} onChange={e => setAccountForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} placeholder="Min. 6 characters" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Btn variant="ghost" onClick={() => setCreateAccountModal(null)}>Cancel</Btn>
            <button onClick={handleCreateAccount} disabled={!accountForm.email || accountForm.password.length < 6} style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: (!accountForm.email || accountForm.password.length < 6) ? 0.5 : 1 }}>
              Create Account
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <Modal title="Delete Student" onClose={() => setDeleteTarget(null)}>
          <p style={{ color: C.text, fontSize: '15px', marginBottom: '24px' }}>
            Are you sure you want to delete <strong>{deleteTarget.fullName}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Btn variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={handleDelete}>Delete</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
