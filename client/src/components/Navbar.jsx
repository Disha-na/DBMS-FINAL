import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiAcademicCap, HiLogout, HiUser, HiCalendar, HiHome, HiViewGrid, HiChartBar } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isStudent, isCoordinator, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HiHome, show: true },
    { to: '/events', label: 'Events', icon: HiCalendar, show: true },
    { to: '/dashboard', label: 'Dashboard', icon: HiViewGrid, show: isAuthenticated && isStudent() },
    { to: '/organizer', label: 'Organizer Panel', icon: HiAcademicCap, show: isAuthenticated && isCoordinator() },
    { to: '/admin', label: 'Admin', icon: HiChartBar, show: isAuthenticated && isAdmin() },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300">
              <HiAcademicCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">CampusEvents</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.filter(l => l.show).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-dark-300 hover:text-white hover:bg-dark-700/50 transition-all duration-300 text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-700">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-dark-200 font-medium">{user?.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 font-semibold capitalize">{user?.role}</span>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-xl text-dark-400 hover:text-red-400 hover:bg-dark-700/50 transition-all duration-300">
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl text-dark-300 hover:text-white hover:bg-dark-700/50 transition-all">
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-dark-700/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.filter(l => l.show).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-dark-700/50 transition-all duration-300"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-dark-700">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-dark-700/50 transition-all">
                      <HiLogout className="w-5 h-5" />
                      <span className="font-medium">Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center btn-secondary py-3">Log In</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center btn-primary py-3">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
