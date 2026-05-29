import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginLayout from '../components/auth/LoginLayout';

export default function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (email, password) => {
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'student') {
        setError('This portal is for staff only. Please use the Student Portal.');
        return;
      }
      navigate('/staff/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginLayout
      portalName="Staff Portal"
      activeNavLabel="Staff Portal"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      emailLabel="Staff Email Address"
      emailPlaceholder="staff@oreofeoluwa.edu.ng"
      switchTo={{
        prompt: 'Are you a student?',
        label: 'Switch to Student Login',
        path: '/student-login',
      }}
    />
  );
}
