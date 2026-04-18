import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerStudent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiIdentification, HiLockClosed, HiPhone, HiAcademicCap, HiCalendar } from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeId: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await registerStudent({
        name: formData.name,
        email: formData.email,
        collegeId: formData.collegeId,
        password: formData.password,
        phone: formData.phone,
        department: formData.department,
        year: parseInt(formData.year) || undefined,
      });

      login(data, data.token);
      toast.success('Registration successful! Welcome aboard!');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.errors?.join(', ') || 'Registration failed';
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <HiUser className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-dark-400 mt-2">Join CampusEvents and start exploring</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name *</label>
                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field pl-10" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="input-label">College ID *</label>
                <div className="relative">
                  <HiIdentification className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="text" name="collegeId" value={formData.collegeId} onChange={handleChange} required className="input-field pl-10" placeholder="CS2024001" />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Email Address *</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field pl-10" placeholder="you@student.edu" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Password *</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="input-field pl-10" placeholder="••••••" />
                </div>
              </div>
              <div>
                <label className="input-label">Confirm Password *</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field pl-10" placeholder="••••••" />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Phone Number</label>
              <div className="relative">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-10" placeholder="9876543210" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Department</label>
                <div className="relative">
                  <HiAcademicCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <select name="department" value={formData.department} onChange={handleChange} className="input-field pl-10 appearance-none">
                    <option value="">Select</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">Year</label>
                <div className="relative">
                  <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <select name="year" value={formData.year} onChange={handleChange} className="input-field pl-10 appearance-none">
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-lg mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-dark-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
