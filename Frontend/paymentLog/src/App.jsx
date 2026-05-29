import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import AdmissionForm from "./pages/AdmissionForm";

// Student portal
import StudentPortal from "./pages/student/StudentPortal";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSubjects from "./pages/student/StudentSubjects";
import StudentCBT from "./pages/student/StudentCBT";
import StudentResults from "./pages/student/StudentResults";

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

function ProtectedRoute({ children, allowedRoles, loginPath = "/staff-login" }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={loginPath} replace />;
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

      {/* Student portal */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']} loginPath="/student-login">
          <StudentPortal />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="subjects" element={<StudentSubjects />} />
        <Route path="exams" element={<StudentCBT />} />
        <Route path="results" element={<StudentResults />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
