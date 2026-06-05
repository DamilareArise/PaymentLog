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
import ExamTakingPage from "./pages/student/ExamTakingPage";
import StudentResults from "./pages/student/StudentResults";

// Staff portal
import StaffPortal from "./pages/staff/StaffPortal";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StudentsPage from "./pages/staff/StudentsPage";
import StaffMgmtPage from "./pages/staff/StaffMgmtPage";
import SubjectsPage from "./pages/staff/SubjectsPage";
import AdmissionsPage from "./pages/staff/AdmissionsPage";
import PaymentsTab from "./pages/staff/PaymentsTab";
import CBTPage from "./pages/staff/CBTPage";

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
        <Route path="cbt" element={<CBTPage />} />
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
        <Route path="exams/:examId" element={<ExamTakingPage />} />
        <Route path="results" element={<StudentResults />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
