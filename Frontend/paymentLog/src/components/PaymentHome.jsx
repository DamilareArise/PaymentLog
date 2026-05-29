import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../utils/api';
import { C } from '../utils/constants';

const ff = 'Inter, system-ui, sans-serif';

const PURPOSES = [
  'School Fee', 'Cardigan', 'Vest', 'Literature', 'Certificate',
  'Exam Fee', 'Party Fee', 'VS', 'Best Solution', 'BECE',
];

const iStyle = {
  width: '100%', padding: '9px 12px', border: `1px solid ${C.border}`,
  borderRadius: '6px', fontSize: '14px', color: C.text, background: C.white,
  outline: 'none', boxSizing: 'border-box', fontFamily: ff,
};

function LabeledField({ label, children }) {
  return (
    <div>
      <label style={{
        display: 'block', color: C.muted, fontSize: '11px', fontWeight: '600',
        textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

LabeledField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Searchable student dropdown — searches the /students endpoint as the user types
function PayerCombobox({ value, onNameChange, onStudentPick }) {
  const [query, setQuery] = useState(value || '');
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const boxRef = useRef(null);

  // Sync when parent clears the value
  useEffect(() => { if (!value) setQuery(''); }, [value]);

  // Close on outside click
  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Debounced student search — fires 300 ms after the user stops typing
  useEffect(() => {
    if (query.length < 2) { setStudents([]); return; }
    const timer = setTimeout(async () => {
      setBusy(true);
      try {
        const { data } = await api.get('/students', { params: { search: query, limit: 10 } });
        setStudents(data.data || []);
      } catch { setStudents([]); }
      finally { setBusy(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const pick = (s) => {
    setQuery(s.fullName);
    onNameChange(s.fullName);
    onStudentPick(s._id, s.class || '');
    setStudents([]);
    setOpen(false);
  };

  const useManual = () => {
    onNameChange(query);
    onStudentPick(null, '');
    setOpen(false);
  };

  const showDrop = open && query.length >= 2;

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onNameChange(e.target.value);
          onStudentPick(null, '');
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder="Search student name, or type payer manually…"
        style={iStyle}
      />
      {showDrop && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,15,34,0.12)', zIndex: 300,
          maxHeight: '240px', overflowY: 'auto',
        }}>
          {busy && (
            <div style={{ padding: '12px 16px', color: C.muted, fontSize: '13px', fontFamily: ff }}>
              Searching students…
            </div>
          )}
          {students.map((s) => (
            <div
              key={s._id}
              onMouseDown={() => pick(s)}
              style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: `1px solid ${C.border}` }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: '600', fontSize: '13px', color: C.text, fontFamily: ff }}>{s.fullName}</div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px', fontFamily: ff }}>
                {s.class && (
                  <span style={{
                    background: C.surfaceContainer, color: C.primary, padding: '1px 6px',
                    borderRadius: '4px', marginRight: '6px', fontWeight: '700', fontSize: '10px',
                  }}>{s.class}</span>
                )}
                {s.admissionNumber || ''}
              </div>
            </div>
          ))}
          {!busy && (
            <div
              onMouseDown={useManual}
              style={{
                padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: '8px', color: C.secondary, fontSize: '13px', fontWeight: '600', fontFamily: ff,
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
              Use &ldquo;{query}&rdquo; as manual payer name
            </div>
          )}
        </div>
      )}
    </div>
  );
}

PayerCombobox.propTypes = {
  value: PropTypes.string,
  onNameChange: PropTypes.func.isRequired,
  onStudentPick: PropTypes.func.isRequired,
};
PayerCombobox.defaultProps = { value: '' };

// Modal form for adding an income or expense entry
function EntryModal({ paymentType, schoolType, onSuccess, onClose }) {
  const [payerName, setPayerName] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [studentClass, setStudentClass] = useState('');
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const isIncome = paymentType === 'Income';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payerName.trim()) { setErr('Payer name is required.'); return; }
    if (!amount || Number(amount) <= 0) { setErr('Enter a valid amount greater than 0.'); return; }
    setSaving(true);
    try {
      const endpoint = isIncome ? '/pay/log-payment' : '/pay/log-expense';
      const resolvedPurpose = purpose === 'Other' ? customPurpose.trim() : purpose;
      await api.post(endpoint, {
        payer: payerName.trim(),
        amount: Number(amount),
        schoolType,
        ...(isIncome && { purpose: resolvedPurpose || '', class: studentClass || '', studentId: studentId || undefined }),
      });
      onSuccess();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,15,34,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500,
    }}>
      <div style={{
        background: C.white, borderRadius: '12px', padding: '32px',
        width: '100%', maxWidth: '480px', margin: '0 16px',
        boxShadow: '0 24px 64px rgba(0,15,34,0.25)', fontFamily: ff,
      }}>
        {/* Modal header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: isIncome ? 'rgba(22,163,74,0.1)' : 'rgba(186,26,26,0.1)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isIncome ? '#15803D' : C.error }}>
                {isIncome ? 'add_circle' : 'remove_circle'}
              </span>
            </div>
            <h3 style={{ color: C.text, fontSize: '17px', fontWeight: '700', margin: 0 }}>
              Add {paymentType}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: '4px', display: 'flex' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {err && (
          <div style={{
            background: C.errorContainer, color: C.error, borderRadius: '6px',
            padding: '10px 14px', marginBottom: '16px', fontSize: '13px',
          }}>
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Payer combobox */}
          <LabeledField label={isIncome ? "Payer's Name" : 'Title'}>
            <PayerCombobox
              value={payerName}
              onNameChange={(name) => { setPayerName(name); setErr(''); }}
              onStudentPick={(id, cls) => { setStudentId(id); setStudentClass(cls); }}
            />
          </LabeledField>

          {/* Class badge — auto-filled when student is selected */}
          {studentClass && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: C.secondary }}>school</span>
              <span style={{ fontSize: '12px', color: C.muted }}>Class auto-filled:</span>
              <span style={{
                background: C.surfaceContainer, color: C.primary, fontWeight: '700',
                fontSize: '12px', padding: '3px 12px', borderRadius: '999px',
              }}>{studentClass}</span>
            </div>
          )}

          {/* Purpose — Income only */}
          {isIncome && (
            <LabeledField label="Purpose of Payment">
              <select
                value={purpose}
                onChange={(e) => { setPurpose(e.target.value); setCustomPurpose(''); }}
                style={iStyle}
              >
                <option value="">Select purpose (optional)…</option>
                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="Other">Other…</option>
              </select>
            </LabeledField>
          )}
          {isIncome && purpose === 'Other' && (
            <LabeledField label="Specify Purpose">
              <input
                type="text"
                value={customPurpose}
                onChange={(e) => setCustomPurpose(e.target.value)}
                placeholder="Enter custom purpose…"
                style={iStyle}
                autoFocus
              />
            </LabeledField>
          )}

          {/* Amount */}
          <LabeledField label="Amount (₦)">
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setErr(''); }}
              placeholder="0"
              style={iStyle}
              required
            />
          </LabeledField>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1, background: isIncome ? '#15803D' : C.error,
                color: '#fff', border: 'none', borderRadius: '8px', padding: '11px',
                fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1, fontFamily: ff,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {isIncome ? 'save' : 'save'}
              </span>
              {saving ? 'Saving…' : `Save ${paymentType}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: C.surfaceLow, color: C.text, border: `1px solid ${C.border}`,
                borderRadius: '8px', padding: '11px 20px', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', fontFamily: ff,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EntryModal.propTypes = {
  paymentType: PropTypes.string.isRequired,
  schoolType: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PaymentHome() {
  const navigate = useNavigate();

  const [modal, setModal] = useState(null); // 'Income' | 'Expense' | null
  const [schoolType, setSchoolType] = useState('SEC');
  const [paymentType, setPaymentType] = useState('Income');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [payments, setPayments] = useState([]);
  const [loadingPay, setLoadingPay] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // Local search / filter state
  const [search, setSearch] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const isIncome = paymentType === 'Income';
  const colSpan = isIncome ? 7 : 5;

  // Fetch payments for selected date
  useEffect(() => {
    setLoadingPay(true);
    api.get('/pay/payment-by-date', {
      params: { date: selectedDate, schoolType, type: paymentType },
    })
      .then(({ data }) => setPayments(data.data || []))
      .catch(console.error)
      .finally(() => setLoadingPay(false));
  }, [selectedDate, schoolType, paymentType, refresh]);

  const handleSuccess = () => { setModal(null); setRefresh(r => r + 1); };

  // Client-side filter on fetched records
  const filtered = payments.filter(p => {
    if (search && !p.payer.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPurpose && p.purpose !== filterPurpose) return false;
    if (filterClass && (p.class || '') !== filterClass) return false;
    return true;
  });

  const total = filtered.reduce((s, p) => s + p.amount, 0);
  const classOptions = [...new Set(payments.map(p => p.class).filter(Boolean))].sort();

  const filterBarInput = {
    ...iStyle, padding: '7px 10px', fontSize: '13px', width: 'auto',
  };

  const toggleBtn = (active, label, onClick, activeColor) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: '5px', border: 'none', cursor: 'pointer',
        fontSize: '12px', fontWeight: '600', fontFamily: ff, transition: 'all 0.15s',
        background: active ? activeColor : 'transparent',
        color: active ? '#fff' : C.muted,
      }}
    >{label}</button>
  );

  return (
    <div style={{ fontFamily: ff }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: C.text, fontSize: '20px', fontWeight: '700', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
            Payment Log
          </h2>
          <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>
            Record and track daily income and expenses
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setModal('Income')}
            style={{
              background: '#15803D', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontFamily: ff,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Add Income
          </button>
          <button
            onClick={() => setModal('Expense')}
            style={{
              background: C.error, color: '#fff', border: 'none', borderRadius: '8px',
              padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontFamily: ff,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
            Add Expense
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
        padding: '16px 20px', marginBottom: '20px',
        display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-end',
      }}>
        {/* Date */}
        <div>
          <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Date</div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={filterBarInput}
          />
        </div>

        <div style={{ width: '1px', height: '36px', background: C.border, alignSelf: 'flex-end' }} />

        {/* School type */}
        <div>
          <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>School</div>
          <div style={{ display: 'flex', background: C.surfaceLow, borderRadius: '6px', padding: '2px' }}>
            {toggleBtn(schoolType === 'SEC', 'Secondary', () => setSchoolType('SEC'), C.primary)}
            {toggleBtn(schoolType === 'PRI', 'Primary', () => setSchoolType('PRI'), C.primary)}
          </div>
        </div>

        {/* Payment type */}
        <div>
          <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Type</div>
          <div style={{ display: 'flex', background: C.surfaceLow, borderRadius: '6px', padding: '2px' }}>
            {toggleBtn(isIncome, 'Income', () => setPaymentType('Income'), '#15803D')}
            {toggleBtn(!isIncome, 'Expense', () => setPaymentType('Expense'), C.error)}
          </div>
        </div>

        <div style={{ width: '1px', height: '36px', background: C.border, alignSelf: 'flex-end' }} />

        {/* Search payer */}
        <div style={{ flex: 1, minWidth: '160px' }}>
          <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Search Payer</div>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: C.muted }}>search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name…"
              style={{ ...filterBarInput, paddingLeft: '32px', width: '100%' }}
            />
          </div>
        </div>

        {/* Filter by purpose (income only) */}
        {isIncome && (
          <div>
            <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Purpose</div>
            <select value={filterPurpose} onChange={(e) => setFilterPurpose(e.target.value)} style={filterBarInput}>
              <option value="">All</option>
              {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}

        {/* Filter by class (shown when class data exists) */}
        {classOptions.length > 0 && (
          <div>
            <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Class</div>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={filterBarInput}>
              <option value="">All</option>
              {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {/* Clear filters pill */}
        {(search || filterPurpose || filterClass) && (
          <button
            onClick={() => { setSearch(''); setFilterPurpose(''); setFilterClass(''); }}
            style={{
              background: C.errorContainer, color: C.error, border: 'none', borderRadius: '999px',
              padding: '5px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-end', fontFamily: ff,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
            Clear
          </button>
        )}
      </div>

      {/* ── Payment table ── */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: ff }}>
            <thead>
              <tr style={{ background: C.surfaceLow }}>
                {[
                  'S/N',
                  isIncome ? "Payer's Name" : 'Title',
                  ...(isIncome ? ['Class', 'Purpose'] : []),
                  'Amount (₦)',
                  'Day Total',
                  'Pay ID',
                ].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em',
                    color: C.muted, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingPay ? (
                <tr>
                  <td colSpan={colSpan} style={{ padding: '48px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>
                    Loading payments…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} style={{ padding: '48px', textAlign: 'center', color: C.muted }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '10px', color: C.border }}>
                      {isIncome ? 'payments' : 'receipt_long'}
                    </span>
                    No {paymentType.toLowerCase()} records found for this date.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p._id || i}
                    style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{i + 1}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: C.text }}>{p.payer}</td>
                    {isIncome && (
                      <>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                          {p.class
                            ? <span style={{ background: C.surfaceContainer, color: C.primary, fontWeight: '700', fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}>{p.class}</span>
                            : <span style={{ color: C.muted }}>—</span>}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: C.text }}>
                          {p.purpose || <span style={{ color: C.muted }}>—</span>}
                        </td>
                      </>
                    )}
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '700', color: isIncome ? '#15803D' : C.error }}>
                      ₦{p.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: C.text }}>
                      ₦{p.subTotal.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: C.muted, fontFamily: 'monospace' }}>
                      {p.schoolType}-00{p.payId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div style={{
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: `1px solid ${C.border}`, background: C.surfaceLow, flexWrap: 'wrap', gap: '12px',
        }}>
          <button
            onClick={() => navigate('/detailedInvoice')}
            style={{
              background: C.primary, color: '#fff', border: 'none', borderRadius: '8px',
              padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: ff, display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>receipt_long</span>
            All Records
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(search || filterPurpose || filterClass) && (
              <span style={{ color: C.muted, fontSize: '12px' }}>
                {filtered.length} of {payments.length} record{payments.length !== 1 ? 's' : ''}
              </span>
            )}
            <span style={{ color: C.muted, fontSize: '14px' }}>Total</span>
            <span style={{ color: C.text, fontSize: '20px', fontWeight: '700' }}>
              ₦{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Entry modal */}
      {modal && (
        <EntryModal
          paymentType={modal}
          schoolType={schoolType}
          onSuccess={handleSuccess}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
