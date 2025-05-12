import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Facebook, Eye, EyeOff } from 'lucide-react';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook, loading } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setErrors({ general: 'Google login failed' });
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      navigate('/');
    } catch (error) {
      setErrors({ general: 'Facebook login failed' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FFFBF1]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome back!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your DishDecoder account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="mb-4 bg-red-50 p-3 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />

            <div>
              <FormInput
                label="Password"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                className="pr-10"
              />
              <div className="relative">
                <button
                  type="button"
                  className="absolute top-[-32px] right-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-main border-gray-300 rounded focus:ring-primary-light"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-main hover:text-primary-dark"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              Sign in
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="social"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.247,1.334-0.98,2.475-2.025,3.26C15.243,17.93,14.059,18.25,12.545,18.25c-2.772,0-5.019-2.247-5.019-5.019c0-2.772,2.247-5.019,5.019-5.019c1.206,0,2.307,0.425,3.173,1.132l2.799-2.799C16.927,5.117,14.855,4.25,12.545,4.25c-4.959,0-8.977,4.018-8.977,8.977c0,4.959,4.018,8.977,8.977,8.977c4.15,0,7.689-2.844,8.627-6.711l0.249-1.023H12.545V12.151z"
                  />
                </svg>
                Google
              </Button>
              
              <Button
                type="button"
                variant="social"
                onClick={handleFacebookLogin}
                disabled={loading}
              >
                <Facebook size={18} className="mr-2" />
                Facebook
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-main hover:text-primary-dark"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 