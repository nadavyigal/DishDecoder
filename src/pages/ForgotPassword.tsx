import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const ForgotPassword: React.FC = () => {
  const { resetPassword, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }
    
    try {
      await resetPassword(email);
      setSuccess(true);
      setError('');
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FFFBF1]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We'll send you an email with a link to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="mb-4 bg-green-50 p-4 rounded-md">
                <p className="text-green-800">
                  Password reset email sent! Check your inbox for further instructions.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center text-primary-main hover:text-primary-dark"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 p-3 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <FormInput
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                />

                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                >
                  Send reset link
                  <Send size={16} className="ml-2" />
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-primary-main hover:text-primary-dark"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 