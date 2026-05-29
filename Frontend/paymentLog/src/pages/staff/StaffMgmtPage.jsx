import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import { C } from '../../utils/constants';

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', border: `1.5px solid ${C.border}`, outline: 'none', boxSizing: 'border-box', background: '#fff', color: C.text, fontFamily: 'inherit' };
const labelStyle = { color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' };

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: C.text, fontSize: '17px', fontWeight: '700', margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '22px' }}>×</button>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);

const SCHEMA = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
});

const INIT = { fullName: '', email: '', phone: '', role: 'teacher', address: '', subjects: '' };

export default function StaffMgmtPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createAccountModal, setCreateAccountModal] = useState(null);
  const [accountForm, setAccountForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await api.get('/staff', { params });
      setStaff(data.data);
    } catch { showToast('Failed to load staff.', 'error'); }
    finally { setLoading(false); }
  }, [search, roleFilter]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const formik = useFormik({
    initialValues: modal?.member ? { ...INIT, ...modal.member, subjects: (modal.member.subjects || []).join(', ') } : INIT,
    enableReinitialize: true,
    validationSchema: SCHEMA,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = { ...values, subjects: values.subjects ? values.subjects.split(',').map(s => s.trim()).filter(Boolean) : [] };
        if (modal.mode === 'add') await api.post('/staff', payload);
        else await api.put(`/staff/${modal.member._id}`, payload);
        showToast(`Staff ${modal.mode === 'add' ? 'added' : 'updated'} successfully.`);
        setModal(null);
        fetchStaff();
      } catch (e) { showToast(e.response?.data?.message || 'Error saving staff.', 'error'); }
      finally { setSubmitting(false); }
    },
  });

  const handleDelete = async () => {
    try {
      await api.delete(`/staff/${deleteTarget._id}`);
      showToast('Staff member deleted.');
      setDeleteTarget(null);
      fetchStaff();
    } catch { showToast('Failed to delete staff member.', 'error'); }
  };

  const handleCreateAccount = async () => {
    try {
      await api.post('/auth/create-user', {
        email: accountForm.email,
        password: accountForm.password,
        role: createAccountModal.role,
        referenceId: createAccountModal._id,
      });
      showToast('Login account created successfully.');
      setCreateAccountModal(null);
      setAccountForm({ email: '', password: '' });
    } catch (e) { showToast(e.response?.data?.message || 'Failed to create account.', 'error'); }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/staff/${id}/toggle-active`);
      fetchStaff();
    } catch { showToast('Failed to update status.', 'error'); }
  };

  return (
    <div style={{ maxWidth: '1100px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 300, background: toast.type === 'success' ? '#15803D' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>Staff Management</h2>
          <p style={{ color: C.muted, margin: '3px 0 0', fontSize: '13px' }}>{staff.length} staff member{staff.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', member: null })} style={{ background: C.primary, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          + Add Staff Member
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '14px 18px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…" style={{ ...inputStyle, maxWidth: '220px', flex: '1 1 150px' }} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...inputStyle, maxWidth: '160px' }}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.light }}>
                {['Staff ID', 'Name', 'Role', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: C.muted, fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>Loading…</td></tr>}
              {!loading && staff.length === 0 && <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>No staff found</td></tr>}
              {staff.map((m, i) => (
                <tr key={m._id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#FDFAF7' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted, fontFamily: 'monospace' }}>{m.staffId || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: C.text }}>{m.fullName}</div>
                    <div style={{ fontSize: '12px', color: C.muted }}>{(m.subjects || []).slice(0, 2).join(', ') || 'No subjects'}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: m.role === 'admin' ? 'rgba(88,56,32,0.12)' : 'rgba(37,99,235,0.1)', color: m.role === 'admin' ? C.primary : '#2563EB', padding: '3px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>{m.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{m.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{m.phone || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleToggleActive(m._id)} style={{ background: m.isActive ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: m.isActive ? '#15803D' : '#DC2626', border: 'none', padding: '3px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button onClick={() => setModal({ mode: 'edit', member: m })} style={{ background: `rgba(88,56,32,0.08)`, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: C.primary, fontSize: '12px', fontWeight: '600' }}>Edit</button>
                      {!m.userId && (
                        <button onClick={() => { setCreateAccountModal(m); setAccountForm({ email: m.email, password: '' }); }} style={{ background: 'rgba(37,99,235,0.08)', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#2563EB', fontSize: '12px', fontWeight: '600' }}>Create Login</button>
                      )}
                      <button onClick={() => setDeleteTarget(m)} style={{ background: 'rgba(220,38,38,0.08)', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: '600' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add Staff Member' : 'Edit Staff Member'} onClose={() => setModal(null)}>
          <form onSubmit={formik.handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { name: 'fullName', label: 'Full Name *', span: 2 },
                { name: 'role', label: 'Role *', type: 'select', opts: ['admin', 'teacher'] },
                { name: 'email', label: 'Email *', type: 'email' },
                { name: 'phone', label: 'Phone' },
                { name: 'address', label: 'Address', span: 2 },
                { name: 'subjects', label: 'Subjects (comma-separated)', span: 2, placeholder: 'e.g. Mathematics, English Language' },
              ].map(({ name, label, type, opts, span, placeholder }) => (
                <div key={name} style={{ gridColumn: span === 2 ? '1 / -1' : 'auto' }}>
                  <label style={labelStyle}>{label}</label>
                  {type === 'select' ? (
                    <select name={name} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      style={{ ...inputStyle, borderColor: formik.touched[name] && formik.errors[name] ? '#DC2626' : C.border }}>
                      {opts.map(o => <option key={o} value={o} style={{ textTransform: 'capitalize' }}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                  ) : (
                    <input type={type || 'text'} name={name} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      placeholder={placeholder}
                      style={{ ...inputStyle, borderColor: formik.touched[name] && formik.errors[name] ? '#DC2626' : C.border }} />
                  )}
                  {formik.touched[name] && formik.errors[name] && <span style={{ color: '#DC2626', fontSize: '12px' }}>{formik.errors[name]}</span>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setModal(null)} style={{ background: 'none', border: `1.5px solid ${C.border}`, padding: '9px 18px', borderRadius: '8px', fontSize: '14px', color: C.muted, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={formik.isSubmitting} style={{ background: C.primary, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                {formik.isSubmitting ? 'Saving…' : modal.mode === 'add' ? 'Add Staff' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Login Account Modal */}
      {createAccountModal && (
        <Modal title={`Create Login Account — ${createAccountModal.fullName}`} onClose={() => setCreateAccountModal(null)}>
          <p style={{ color: C.muted, fontSize: '14px', marginBottom: '20px' }}>
            This will create a login account for this staff member so they can access the portal.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Email (used to log in)</label>
              <input type="email" value={accountForm.email} onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={accountForm.password} placeholder="Set a password (min. 6 chars)" onChange={e => setAccountForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setCreateAccountModal(null)} style={{ background: 'none', border: `1.5px solid ${C.border}`, padding: '9px 18px', borderRadius: '8px', fontSize: '14px', color: C.muted, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleCreateAccount} style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Create Account</button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <Modal title="Delete Staff Member" onClose={() => setDeleteTarget(null)}>
          <p style={{ color: C.text, fontSize: '15px', marginBottom: '24px' }}>
            Are you sure you want to delete <strong>{deleteTarget.fullName}</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setDeleteTarget(null)} style={{ background: 'none', border: `1.5px solid ${C.border}`, padding: '9px 18px', borderRadius: '8px', fontSize: '14px', color: C.muted, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleDelete} style={{ background: '#DC2626', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
