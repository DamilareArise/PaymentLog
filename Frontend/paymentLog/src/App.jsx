import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import AdmissionForm from "./pages/AdmissionForm";

// Staff portal
import StaffPortal from "./pages/staff/StaffPortal";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StudentsPage from "./pages/staff/StudentsPage";
import StaffMgmtPage from "./pages/staff/StaffMgmtPage";
import SubjectsPage from "./pages/staff/SubjectsPage";
import AdmissionsPage from "./pages/staff/AdmissionsPage";
import PaymentsTab from "./pages/staff/PaymentsTab";

// Legacy payment logger (preserved)
import PaymentInvoice from "./components/PaymentHome";
import DetailedInvoice from "./components/DetailedInvoice";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/staff-login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/staff-login" element={<StaffLogin />} />
      <Route path="/apply" element={<AdmissionForm />} />

      {/* Legacy payment logger */}
      <Route path="/payment" element={<PaymentInvoice />} />
      <Route path="/detailedInvoice" element={<DetailedInvoice />} />

      {/* Staff portal — nested routes */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
          <StaffPortal />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="staff-mgmt" element={<StaffMgmtPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="admissions" element={<AdmissionsPage />} />
        <Route path="payments" element={<PaymentsTab />} />
        <Route path="cbt" element={
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>💻</div>
            <h2 style={{ color: '#2D1B10', marginBottom: '8px' }}>CBT Module</h2>
            <p style={{ color: '#8B5E3C' }}>Coming in the next module — exams, questions, auto-grading, and student results.</p>
          </div>
        } />
      </Route>

      {/* Student portal — placeholder until Module 3 */}
      <Route path="/student/*" element={
        <ProtectedRoute allowedRoles={['student']}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui', background: '#FDF6EC' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
              <h1 style={{ color: '#583820', marginBottom: '8px' }}>Student Dashboard</h1>
              <p style={{ color: '#8B5E3C' }}>Coming in Module 3!</p>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
