import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import PasswordInput from '../../../components/common/PasswordInput';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(password);
      navigate('/admin/products');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || t('login.wrongPassword');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card-background border border-soft-border rounded-20 p-8 shadow-card">
        <h1 className="text-3xl font-bold text-center mb-8 text-text-dark">{t('Login')}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              كلمة المرور
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-purple text-white font-bold py-3 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : t('Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
