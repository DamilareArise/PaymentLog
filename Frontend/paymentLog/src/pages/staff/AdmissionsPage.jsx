import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { C, STATUS_COLORS } from '../../utils/constants';

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: C.text, fontSize: '17px', fontWeight: '700', margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '22px' }}>×</button>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => value ? (
  <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
    <div style={{ color: C.muted, fontSize: '13px', width: '160px', flexShrink: 0 }}>{label}</div>
    <div style={{ color: C.text, fontSize: '13px', fontWeight: '500' }}>{value}</div>
  </div>
) : null;

export default function AdmissionsPage() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const [viewStudent, setViewStudent] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (statusFilter) params.admissionStatus = statusFilter;
      if (search) params.search = search;
      const { data } = await api.get('/students', { params });
      setStudents(data.data);
      setTotal(data.total);
    } catch { showToast('Failed to load applications.', 'error'); }
    finally { setLoading(false); }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/students/${id}/admission-status`, { admissionStatus: newStatus });
      showToast(`Status updated to "${newStatus}".`);
      fetchStudents();
      if (viewStudent?._id === id) setViewStudent(s => ({ ...s, admissionStatus: newStatus }));
    } catch { showToast('Failed to update status.', 'error'); }
  };

  const pages = Math.ceil(total / LIMIT);

  const statusTabs = [
    { value: '', label: 'All', count: null },
    { value: 'pending', label: 'Pending', count: null },
    { value: 'admitted', label: 'Admitted', count: null },
    { value: 'not_admitted', label: 'Not Admitted', count: null },
  ];

  return (
    <div style={{ maxWidth: '1100px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 300, background: toast.type === 'success' ? '#15803D' : '#DC2626', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: 0 }}>Admission Applications</h2>
        <p style={{ color: C.muted, margin: '3px 0 0', fontSize: '13px' }}>Review and manage all student admission applications</p>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '4px', background: C.white, borderRadius: '10px', padding: '4px', border: `1px solid ${C.border}`, marginBottom: '16px', width: 'fit-content', flexWrap: 'wrap' }}>
        {statusTabs.map(({ value, label }) => (
          <button key={value} onClick={() => { setStatusFilter(value); setPage(1); }} style={{
            padding: '7px 16px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            background: statusFilter === value ? C.primary : 'transparent',
            color: statusFilter === value ? '#fff' : C.muted,
            transition: 'all 0.15s'
          }}>{label}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '14px 18px', marginBottom: '16px' }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name…"
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', border: `1.5px solid ${C.border}`, outline: 'none', maxWidth: '280px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
      </div>

      {/* Table */}
      <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.light }}>
                {['Applicant', 'Desired Class', 'Applied On', 'Parent', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: C.muted, fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>Loading…</td></tr>}
              {!loading && students.length === 0 && <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: C.muted }}>No applications found</td></tr>}
              {students.map((s, i) => {
                const sc = STATUS_COLORS[s.admissionStatus] || STATUS_COLORS.pending;
                return (
                  <tr key={s._id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? '#fff' : '#FDFAF7' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: C.text }}>{s.fullName}</div>
                      <div style={{ fontSize: '12px', color: C.muted }}>{s.gender} · {s.schoolType}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: C.text }}>{s.class || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{new Date(s.createdAt).toLocaleDateString('en-NG')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '13px', color: C.text }}>{s.parentName || '—'}</div>
                      <div style={{ fontSize: '12px', color: C.muted }}>{s.parentPhone || ''}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '600' }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => setViewStudent(s)} style={{ background: `rgba(88,56,32,0.08)`, border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: C.primary, fontSize: '12px', fontWeight: '600' }}>View</button>
                        {s.admissionStatus !== 'admitted' && (
                          <button onClick={() => handleStatusChange(s._id, 'admitted')} style={{ background: 'rgba(22,163,74,0.1)', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#15803D', fontSize: '12px', fontWeight: '600' }}>✓ Admit</button>
                        )}
                        {s.admissionStatus !== 'not_admitted' && (
                          <button onClick={() => handleStatusChange(s._id, 'not_admitted')} style={{ background: 'rgba(220,38,38,0.08)', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: '600' }}>✗ Reject</button>
                        )}
                        {s.admissionStatus !== 'pending' && (
                          <button onClick={() => handleStatusChange(s._id, 'pending')} style={{ background: 'rgba(217,119,6,0.1)', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', color: '#B45309', fontSize: '12px', fontWeight: '600' }}>⟳ Pending</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: C.muted, fontSize: '13px' }}>Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', borderRadius: '6px', border: `1.5px solid ${C.border}`, background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? C.muted : C.text, fontSize: '13px' }}>← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', borderRadius: '6px', border: `1.5px solid ${C.border}`, background: '#fff', cursor: page === pages ? 'not-allowed' : 'pointer', color: page === pages ? C.muted : C.text, fontSize: '13px' }}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {viewStudent && (
        <Modal title="Applicant Details" onClose={() => setViewStudent(null)}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: C.text, fontSize: '18px', fontWeight: '700', margin: 0 }}>{viewStudent.fullName}</h3>
                <div style={{ color: C.muted, fontSize: '13px' }}>{viewStudent.schoolType} — {viewStudent.class || 'Class TBD'}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {viewStudent.admissionStatus !== 'admitted' && (
                  <button onClick={() => handleStatusChange(viewStudent._id, 'admitted')} style={{ background: 'rgba(22,163,74,0.12)', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#15803D', fontSize: '13px', fontWeight: '700' }}>✓ Admit</button>
                )}
                {viewStudent.admissionStatus !== 'not_admitted' && (
                  <button onClick={() => handleStatusChange(viewStudent._id, 'not_admitted')} style={{ background: 'rgba(220,38,38,0.1)', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#DC2626', fontSize: '13px', fontWeight: '700' }}>✗ Reject</button>
                )}
              </div>
            </div>
            <div style={{ background: C.light, borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: C.muted }}>Current Status:</span>
                <span style={{ background: STATUS_COLORS[viewStudent.admissionStatus]?.bg, color: STATUS_COLORS[viewStudent.admissionStatus]?.color, padding: '4px 12px', borderRadius: '50px', fontSize: '13px', fontWeight: '700' }}>
                  {STATUS_COLORS[viewStudent.admissionStatus]?.label}
                </span>
              </div>
            </div>
          </div>
          <h4 style={{ color: C.text, fontWeight: '700', marginBottom: '4px', fontSize: '14px' }}>Student Information</h4>
          <DetailRow label="Full Name" value={viewStudent.fullName} />
          <DetailRow label="Gender" value={viewStudent.gender} />
          <DetailRow label="Date of Birth" value={viewStudent.dateOfBirth ? new Date(viewStudent.dateOfBirth).toLocaleDateString('en-NG') : null} />
          <DetailRow label="School Level" value={viewStudent.schoolType} />
          <DetailRow label="Desired Class" value={viewStudent.class} />
          <DetailRow label="Address" value={viewStudent.address} />
          <h4 style={{ color: C.text, fontWeight: '700', margin: '16px 0 4px', fontSize: '14px' }}>Parent / Guardian</h4>
          <DetailRow label="Name" value={viewStudent.parentName} />
          <DetailRow label="Phone" value={viewStudent.parentPhone} />
          <DetailRow label="Email" value={viewStudent.parentEmail} />
          <DetailRow label="Applied On" value={new Date(viewStudent.createdAt).toLocaleString('en-NG')} />
        </Modal>
      )}
    </div>
  );
}
