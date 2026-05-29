import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { C, SCHOOL_TYPES, CLASSES } from '../utils/constants';

const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '8px', fontSize: '14px', border: `1.5px solid rgba(88,56,32,0.2)`, outline: 'none', boxSizing: 'border-box', background: '#fff', color: C.text, fontFamily: 'inherit', transition: 'border-color 0.2s' };
const labelStyle = { color: C.text, fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' };

const SCHEMA = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  gender: Yup.string().required('Gender is required'),
  schoolType: Yup.string().required('School level is required'),
  class: Yup.string().required('Desired class is required'),
  parentName: Yup.string().required('Parent / guardian name is required'),
  parentPhone: Yup.string().required('Parent phone is required'),
});

const INIT = { fullName: '', gender: '', dateOfBirth: '', schoolType: '', class: '', address: '', parentName: '', parentPhone: '', parentEmail: '', previousSchool: '' };

export default function AdmissionForm() {
  const [submitted, setSubmitted] = useState(null);

  const formik = useFormik({
    initialValues: INIT,
    validationSchema: SCHEMA,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await api.post('/students/apply', values);
        setSubmitted(data.data);
      } catch (e) {
        alert(e.response?.data?.message || 'Submission failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const availableClasses = formik.values.schoolType ? CLASSES[formik.values.schoolType] : [];

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: C.text, fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Application Submitted!</h2>
          <p style={{ color: C.muted, lineHeight: '1.7', marginBottom: '24px' }}>
            Thank you for applying to Ore Ofe Oluwa Schools. Your application has been received and is being reviewed.
          </p>
          <div style={{ background: C.light, borderRadius: '12px', padding: '20px', marginBottom: '28px', border: `1px solid ${C.border}` }}>
            <div style={{ color: C.muted, fontSize: '13px', marginBottom: '4px' }}>Your Application Reference</div>
            <div style={{ color: C.primary, fontSize: '22px', fontWeight: '800', fontFamily: 'monospace' }}>{submitted.admissionNumber}</div>
          </div>
          <p style={{ color: C.muted, fontSize: '13px', marginBottom: '28px' }}>
            Please save your reference number. You will be contacted by our admissions office within 3–5 working days.
          </p>
          <Link to="/" style={{ display: 'inline-block', background: C.primary, color: '#fff', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            ← Back to School Website
          </Link>
        </div>
      </div>
    );
  }

  const Field = ({ name, label, required, type = 'text', opts, span, placeholder, onChange }) => (
    <div style={{ gridColumn: span === 2 ? '1 / -1' : 'auto' }}>
      <label style={labelStyle}>{label}{required && ' *'}</label>
      {type === 'select' ? (
        <select name={name} value={formik.values[name]} onChange={onChange || formik.handleChange} onBlur={formik.handleBlur}
          style={{ ...inputStyle, borderColor: formik.touched[name] && formik.errors[name] ? '#DC2626' : 'rgba(88,56,32,0.2)' }}>
          <option value="">Select…</option>
          {opts?.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={formik.values[name]} placeholder={placeholder}
          onChange={formik.handleChange} onBlur={formik.handleBlur}
          style={{ ...inputStyle, borderColor: formik.touched[name] && formik.errors[name] ? '#DC2626' : 'rgba(88,56,32,0.2)' }}
          onFocus={e => e.target.style.borderColor = C.primary}
        />
      )}
      {formik.touched[name] && formik.errors[name] && <span style={{ color: '#DC2626', fontSize: '12px' }}>{formik.errors[name]}</span>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.light, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, padding: '32px 24px 40px' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>← Back to School Website</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: C.dark, flexShrink: 0 }}>OOS</div>
            <div>
              <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: 0 }}>Admission Application</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '4px 0 0' }}>Ore Ofe Oluwa Schools — {new Date().getFullYear()} Academic Session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '740px', margin: '-20px auto 0', padding: '0 16px 60px' }}>
        <form onSubmit={formik.handleSubmit}>

          {/* Student Info */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(88,56,32,0.06)', border: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.text, fontSize: '16px', fontWeight: '700', marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${C.border}` }}>
              👤 Student Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field name="fullName" label="Full Name" required span={2} />
              <Field name="gender" label="Gender" required type="select" opts={['Male', 'Female']} />
              <Field name="dateOfBirth" label="Date of Birth" type="date" />
              <Field name="schoolType" label="School Level" required type="select" opts={SCHOOL_TYPES}
                onChange={e => { formik.handleChange(e); formik.setFieldValue('class', ''); }} />
              <Field name="class" label="Desired Class" required type="select" opts={availableClasses} />
              <Field name="previousSchool" label="Previous School (if any)" span={2} placeholder="Name of previous school attended" />
              <Field name="address" label="Home Address" span={2} />
            </div>
          </div>

          {/* Parent Info */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(88,56,32,0.06)', border: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.text, fontSize: '16px', fontWeight: '700', marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${C.border}` }}>
              👨‍👩‍👧 Parent / Guardian Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field name="parentName" label="Parent / Guardian Full Name" required span={2} />
              <Field name="parentPhone" label="Phone Number" required />
              <Field name="parentEmail" label="Email Address" type="email" />
            </div>
          </div>

          {/* Declaration */}
          <div style={{ background: `rgba(88,56,32,0.05)`, borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: `1px solid ${C.border}`, fontSize: '13px', color: C.muted, lineHeight: '1.7' }}>
            By submitting this form, I confirm that all information provided is true and accurate. I understand that false information may result in the cancellation of the application.
          </div>

          <button type="submit" disabled={formik.isSubmitting} style={{
            width: '100%', background: formik.isSubmitting ? '#9B6B47' : C.primary, color: '#fff', border: 'none',
            padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: '700',
            cursor: formik.isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
          }}>
            {formik.isSubmitting ? 'Submitting Application…' : 'Submit Application →'}
          </button>
        </form>
      </div>
    </div>
  );
}
