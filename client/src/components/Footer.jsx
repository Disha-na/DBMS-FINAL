import { Link } from 'react-router-dom';
import { HiAcademicCap, HiMail, HiHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HiAcademicCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">CampusEvents</span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              Smart College Event Management System — manage, discover, and participate in campus events seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/events', label: 'Browse Events' },
                { to: '/register', label: 'Create Account' },
                { to: '/login', label: 'Sign In' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-dark-400 hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-dark-400 text-sm">
                <HiMail className="w-5 h-5 text-primary-400" />
                <span>events@college.edu</span>
              </div>
              <p className="text-dark-400 text-sm">
                College Campus, Academic Block<br />
                New Delhi, India - 110001
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © 2026 CampusEvents. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm flex items-center gap-1">
            Made with <HiHeart className="w-4 h-4 text-red-500" /> for DBMS Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
