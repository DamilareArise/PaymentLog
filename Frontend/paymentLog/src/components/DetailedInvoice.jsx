import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { C } from '../utils/constants';

const ff = 'Inter, system-ui, sans-serif';

const PURPOSES = [
  'School Fee', 'Cardigan', 'Vest', 'Literature', 'Certificate',
  'Exam Fee', 'Party Fee', 'VS', 'Best Solution', 'BECE',
];

const API_BASE = import.meta.env.VITE_API_URL || 'https://paymentlog.onrender.com';

const iStyle = {
  padding: '7px 10px', border: `1px solid ${C.border}`,
  borderRadius: '6px', fontSize: '13px', color: C.text, background: C.white,
  outline: 'none', fontFamily: ff,
};

const DetailedInvoice = () => {
  const navigate = useNavigate();

  const [allPayment, setAllPayment] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [schoolType, setSchoolType] = useState('SEC');
  const [paymentType, setPaymentType] = useState('Income');

  // Search / filter state
  const [search, setSearch] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const isIncome = paymentType === 'Income';
  const colSpan = isIncome ? 7 : 5;

  useEffect(() => {
    setLoading(true);
    api.get('/pay/all-payment', {
      params: { schoolType, type: paymentType },
    })
      .then(({ data }) => {
        const result = data.data || [];
        setAllPayment(result);
        setTotalAmount(result.reduce((acc, cur) => acc + cur.amount, 0));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [schoolType, paymentType]);

  const handleDelete = () => {
    if (!confirm('Delete ALL payment logs for this school type and category? This cannot be undone.')) return;
    api.delete('/pay/delete-all-log', { params: { schoolType, type: paymentType } })
      .then(() => navigate('/'))
      .catch(() => alert('Failed to delete log. Please try again.'));
  };

  // Client-side filtering
  const filtered = allPayment.filter(p => {
    if (search && !p.payer.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPurpose && p.purpose !== filterPurpose) return false;
    if (filterClass && (p.class || '') !== filterClass) return false;
    return true;
  });

  const filteredTotal = filtered.reduce((acc, cur) => acc + cur.amount, 0);
  const classOptions = [...new Set(allPayment.map(p => p.class).filter(Boolean))].sort();

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

  // Build PDF URL with current filters so the exported PDF respects applied filters
  const pdfParams = new URLSearchParams({ schoolType, type: paymentType });
  if (search) pdfParams.set('q', search);
  if (filterPurpose) pdfParams.set('purpose', filterPurpose);
  if (filterClass) pdfParams.set('class', filterClass);
  const pdfHref = `${API_BASE}/pay/export-pdf?${pdfParams}`;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', display: 'flex', flexDirection: 'column', fontFamily: ff }}>

      {/* Top bar */}
      <header style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: C.primary, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </Link>
          <div>
            <div style={{ color: C.primary, fontSize: '17px', fontWeight: '700', letterSpacing: '-0.01em' }}>
              ORE OFE OLUWA
            </div>
            <div style={{ color: C.muted, fontSize: '12px' }}>All Payment Records</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href={pdfHref}
            download
            style={{
              background: C.primary, color: '#fff', borderRadius: '8px', padding: '8px 16px',
              fontSize: '13px', fontWeight: '600', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>download</span>
            Export PDF
          </a>
          <button
            onClick={handleDelete}
            style={{
              background: C.errorContainer, color: C.error, border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontFamily: ff,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>delete</span>
            Delete Logs
          </button>
        </div>
      </header>

      <main style={{ padding: '32px 40px', flex: 1 }}>

        {/* Filter bar */}
        <div style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
          padding: '16px 20px', marginBottom: '20px',
          display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-end',
        }}>
          {/* School type */}
          <div>
            <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>School</div>
            <div style={{ display: 'flex', background: '#eff4ff', borderRadius: '6px', padding: '2px' }}>
              {toggleBtn(schoolType === 'SEC', 'Secondary', () => setSchoolType('SEC'), C.primary)}
              {toggleBtn(schoolType === 'PRI', 'Primary', () => setSchoolType('PRI'), C.primary)}
            </div>
          </div>

          {/* Payment type */}
          <div>
            <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Type</div>
            <div style={{ display: 'flex', background: '#eff4ff', borderRadius: '6px', padding: '2px' }}>
              {toggleBtn(isIncome, 'Income', () => setPaymentType('Income'), '#15803D')}
              {toggleBtn(!isIncome, 'Expense', () => setPaymentType('Expense'), C.error)}
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', background: C.border, alignSelf: 'flex-end' }} />

          {/* Search payer */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Search Payer</div>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: C.muted }}>search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name…"
                style={{ ...iStyle, paddingLeft: '32px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Filter by purpose (income only) */}
          {isIncome && (
            <div>
              <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Purpose</div>
              <select value={filterPurpose} onChange={(e) => setFilterPurpose(e.target.value)} style={iStyle}>
                <option value="">All</option>
                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          {/* Filter by class */}
          {classOptions.length > 0 && (
            <div>
              <div style={{ color: C.muted, fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>Class</div>
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={iStyle}>
                <option value="">All</option>
                {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

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

        {/* Table */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: ff }}>
              <thead>
                <tr style={{ background: '#eff4ff' }}>
                  {[
                    'S/N',
                    isIncome ? "Payer's Name" : 'Title',
                    ...(isIncome ? ['Class', 'Purpose'] : []),
                    'Amount (₦)',
                    'Date',
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
                {loading ? (
                  <tr>
                    <td colSpan={colSpan} style={{ padding: '48px', textAlign: 'center', color: C.muted }}>
                      Loading records…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} style={{ padding: '48px', textAlign: 'center', color: C.muted }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '10px', color: C.border }}>
                        receipt_long
                      </span>
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr
                      key={p._id}
                      style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#eff4ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: C.text }}>{p.payer}</td>
                      {isIncome && (
                        <>
                          <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                            {p.class
                              ? <span style={{ background: '#e5eeff', color: C.primary, fontWeight: '700', fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}>{p.class}</span>
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
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted, whiteSpace: 'nowrap' }}>
                        {new Date(p.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
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
            borderTop: `1px solid ${C.border}`, background: '#eff4ff', flexWrap: 'wrap', gap: '12px',
          }}>
            <span style={{ color: C.muted, fontSize: '13px' }}>
              {filtered.length} of {allPayment.length} record{allPayment.length !== 1 ? 's' : ''}
              {(search || filterPurpose || filterClass) ? ' (filtered)' : ''}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: C.muted, fontSize: '14px' }}>Total</span>
              <span style={{ color: C.text, fontSize: '20px', fontWeight: '700' }}>
                ₦{filteredTotal.toLocaleString()}
              </span>
              {filteredTotal !== totalAmount && (
                <span style={{ color: C.muted, fontSize: '12px' }}>
                  (All: ₦{totalAmount.toLocaleString()})
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer style={{
        background: C.primary, color: '#fff', padding: '16px 40px',
        fontSize: '13px', fontWeight: '500',
      }}>
        © Copyright 2024 — Ore Ofe Oluwa Schools
      </footer>
    </div>
  );
};

export default DetailedInvoice;
