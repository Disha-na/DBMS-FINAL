import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiLogin } from 'react-icons/hi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data, data.token);
      toast.success(`Welcome back, ${data.name}!`);

      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'coordinator') navigate('/organizer');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const roles = [
    { value: 'student', label: 'Student', color: 'from-blue-500 to-cyan-500' },
    { value: 'coordinator', label: 'Coordinator', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <HiLogin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-dark-400 mt-2">Sign in to your account</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-dark-800 rounded-xl p-1 mb-6">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setFormData({ ...formData, role: r.value })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  formData.role === r.value
                    ? `bg-gradient-to-r ${r.color} text-white shadow-lg`
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field pl-10" placeholder="you@student.edu" />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field pl-10" placeholder="••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-lg mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
            <p className="text-xs font-semibold text-primary-400 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-dark-400">
              <p><span className="text-dark-300">Student:</span> aarav@student.edu / student123</p>
              <p><span className="text-dark-300">Coordinator:</span> anita@college.edu / coord123</p>
              <p><span className="text-dark-300">Admin:</span> admin@college.edu / admin123</p>
            </div>
          </div>

          <p className="text-center text-dark-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
