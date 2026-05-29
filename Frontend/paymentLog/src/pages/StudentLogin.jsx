import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginLayout from '../components/auth/LoginLayout';

export default function StudentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (email, password) => {
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'student') {
        setError('This portal is for students only. Please use the Staff Portal.');
        return;
      }
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginLayout
      portalName="Student Portal"
      activeNavLabel="Student Portal"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      emailLabel="Email Address"
      emailPlaceholder="student@email.com"
      switchTo={{
        prompt: 'Are you a faculty member or administrator?',
        label: 'Switch to Staff Login',
        path: '/staff-login',
      }}
    />
  );
}
