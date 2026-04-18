import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyRegistrations, unregisterFromEvent, getQRCode } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiCalendar, HiLocationMarker, HiQrcode, HiTrash, HiCheckCircle, HiClock, HiViewGrid } from 'react-icons/hi';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState(null);
  const { user } = useAuth();

  const fetchRegistrations = async () => {
    try {
      const { data } = await getMyRegistrations();
      setRegistrations(data);
    } catch (error) {
      toast.error('Failed to load registrations');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const handleUnregister = async (eventId, eventTitle) => {
    if (!confirm(`Unregister from "${eventTitle}"?`)) return;
    try {
      await unregisterFromEvent(eventId);
      toast.success('Successfully unregistered');
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to unregister');
    }
  };

  const showQR = async (regId) => {
    try {
      const { data } = await getQRCode(regId);
      setQrModal(data.qrCode);
    } catch {
      toast.error('Failed to load QR code');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const statusIcon = (reg) => {
    if (reg.checkedIn) return <HiCheckCircle className="w-5 h-5 text-green-400" />;
    return <HiClock className="w-5 h-5 text-amber-400" />;
  };

  const upcoming = registrations.filter(r => r.event?.status === 'upcoming' || r.event?.status === 'ongoing');
  const past = registrations.filter(r => r.event?.status === 'completed' || r.event?.status === 'cancelled');

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}!</h1>
                  <p className="text-dark-400">{user?.email} • {user?.collegeId}</p>
                </div>
              </div>
              <Link to="/events" className="btn-primary flex items-center gap-2">
                <HiCalendar className="w-5 h-5" /> Browse Events
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Total Registered', value: registrations.length, color: 'text-primary-400' },
                { label: 'Upcoming', value: upcoming.length, color: 'text-blue-400' },
                { label: 'Attended', value: registrations.filter(r => r.checkedIn).length, color: 'text-green-400' },
              ].map((s) => (
                <div key={s.label} className="bg-dark-800/50 rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-dark-400 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : registrations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <HiViewGrid className="w-20 h-20 text-dark-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark-300 mb-2">No Registrations Yet</h2>
            <p className="text-dark-500 mb-6">Start exploring events and register for ones that interest you!</p>
            <Link to="/events" className="btn-primary">Browse Events</Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Events */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <HiClock className="w-6 h-6 text-blue-400" /> Upcoming Events ({upcoming.length})
                </h2>
                <div className="grid gap-4">
                  {upcoming.map((reg, i) => (
                    <motion.div
                      key={reg._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {statusIcon(reg)}
                        <div className="flex-1 min-w-0">
                          <Link to={`/events/${reg.event?._id}`} className="text-lg font-semibold text-white hover:text-primary-400 transition-colors">
                            {reg.event?.title}
                          </Link>
                          <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-dark-400">
                            <span className="flex items-center gap-1"><HiCalendar className="w-4 h-4" /> {formatDate(reg.event?.date)}</span>
                            <span className="flex items-center gap-1"><HiLocationMarker className="w-4 h-4" /> {reg.event?.venue}</span>
                          </div>
                          <span className={`inline-block mt-2 status-${reg.event?.status}`}>{reg.event?.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button onClick={() => showQR(reg._id)} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1.5 flex-1 sm:flex-initial justify-center">
                          <HiQrcode className="w-4 h-4" /> QR Code
                        </button>
                        <button onClick={() => handleUnregister(reg.event?._id, reg.event?.title)} className="btn-danger text-sm py-2 px-3 flex items-center gap-1.5 flex-1 sm:flex-initial justify-center">
                          <HiTrash className="w-4 h-4" /> Unregister
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {past.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <HiCheckCircle className="w-6 h-6 text-green-400" /> Past Events ({past.length})
                </h2>
                <div className="grid gap-4">
                  {past.map((reg, i) => (
                    <motion.div
                      key={reg._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-5 opacity-75"
                    >
                      <div className="flex items-start gap-4">
                        <HiCheckCircle className="w-5 h-5 text-dark-500 mt-0.5" />
                        <div>
                          <Link to={`/events/${reg.event?._id}`} className="text-lg font-semibold text-dark-300 hover:text-primary-400 transition-colors">
                            {reg.event?.title}
                          </Link>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-dark-500">
                            <span>{formatDate(reg.event?.date)}</span>
                            <span>{reg.event?.venue}</span>
                            {reg.checkedIn && <span className="text-green-500">✓ Attended</span>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setQrModal(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-4">Your QR Code</h3>
            <div className="bg-white rounded-xl p-4 inline-block">
              <img src={qrModal} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-dark-400 text-sm mt-4">Show this QR code at the event for check-in</p>
            <button onClick={() => setQrModal(null)} className="btn-secondary mt-4 w-full">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
