import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEvent, registerForEvent, unregisterFromEvent, getMyRegistrations, getEventFeedback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FeedbackForm from '../components/FeedbackForm';
import toast from 'react-hot-toast';
import { HiCalendar, HiLocationMarker, HiUsers, HiUser, HiArrowLeft, HiStar, HiCheckCircle } from 'react-icons/hi';

const categoryColors = {
  Technical: 'badge-technical',
  Cultural: 'badge-cultural',
  Sports: 'badge-sports',
  Workshop: 'badge-workshop',
  Seminar: 'badge-seminar',
  Other: 'badge-other',
};

const EventDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isStudent } = useAuth();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ feedback: [], avgRating: 0, totalReviews: 0 });

  const fetchEvent = async () => {
    try {
      const { data } = await getEvent(id);
      setEvent(data);
    } catch (error) {
      toast.error('Failed to load event');
    }
    setLoading(false);
  };

  const checkRegistration = async () => {
    if (!isAuthenticated || !isStudent()) return;
    try {
      const { data } = await getMyRegistrations();
      setIsRegistered(data.some((r) => r.event?._id === id));
    } catch {}
  };

  const fetchFeedback = async () => {
    try {
      const { data } = await getEventFeedback(id);
      setFeedback(data);
    } catch {}
  };

  useEffect(() => {
    fetchEvent();
    checkRegistration();
    fetchFeedback();
  }, [id]);

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      await registerForEvent(id);
      setIsRegistered(true);
      toast.success('Successfully registered!');
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    setActionLoading(false);
  };

  const handleUnregister = async () => {
    if (!confirm('Are you sure you want to unregister?')) return;
    setActionLoading(true);
    try {
      await unregisterFromEvent(id);
      setIsRegistered(false);
      toast.success('Successfully unregistered');
      fetchEvent();
    } catch (error) {
      toast.error('Failed to unregister');
    }
    setActionLoading(false);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-300 mb-4">Event Not Found</h2>
          <Link to="/events" className="btn-primary">Back to Events</Link>
        </div>
      </div>
    );
  }

  const capacityPercent = event.maxParticipants ? Math.min(100, ((event.registrationCount || 0) / event.maxParticipants) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 mb-6 transition-colors">
          <HiArrowLeft className="w-5 h-5" /> Back to Events
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
            {event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-600/30 to-purple-600/30 flex items-center justify-center">
                <HiCalendar className="w-24 h-24 text-dark-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className={categoryColors[event.category] || 'badge-other'}>{event.category}</span>
              <span className={`status-${event.status}`}>{event.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{event.title}</h1>
                <p className="text-dark-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiCalendar className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-xs font-medium">Date & Time</p>
                    <p className="text-white font-semibold">{formatDate(event.date)}</p>
                    <p className="text-dark-400 text-sm">{formatTime(event.date)}</p>
                    {event.endDate && <p className="text-dark-500 text-xs mt-1">Ends: {formatDate(event.endDate)}</p>}
                  </div>
                </div>

                <div className="glass-card p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiLocationMarker className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-xs font-medium">Venue</p>
                    <p className="text-white font-semibold">{event.venue}</p>
                  </div>
                </div>

                <div className="glass-card p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiUsers className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-xs font-medium">Participants</p>
                    <p className="text-white font-semibold">{event.registrationCount || 0} / {event.maxParticipants}</p>
                    <div className="w-full bg-dark-700 rounded-full h-1.5 mt-2">
                      <div className={`h-1.5 rounded-full transition-all ${capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${capacityPercent}%` }} />
                    </div>
                  </div>
                </div>

                {event.coordinator && (
                  <div className="glass-card p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HiUser className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-dark-400 text-xs font-medium">Coordinator</p>
                      <p className="text-white font-semibold">{event.coordinator.name}</p>
                      <p className="text-dark-500 text-xs">{event.coordinator.department}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Results */}
              {event.results && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <HiCheckCircle className="w-5 h-5 text-green-400" /> Results
                  </h3>
                  <p className="text-dark-300 whitespace-pre-wrap">{event.results}</p>
                </div>
              )}

              {/* Feedback Section */}
              {event.status === 'completed' && (
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <HiStar className="w-5 h-5 text-accent-400" /> Feedback
                    </h3>
                    {feedback.totalReviews > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <HiStar key={s} className={`w-4 h-4 ${s <= Math.round(feedback.avgRating) ? 'text-accent-400' : 'text-dark-600'}`} />
                          ))}
                        </div>
                        <span className="text-dark-300 text-sm">{feedback.avgRating} ({feedback.totalReviews})</span>
                      </div>
                    )}
                  </div>

                  {isAuthenticated && isStudent() && isRegistered && (
                    <FeedbackForm eventId={id} onSubmitted={fetchFeedback} />
                  )}

                  {feedback.feedback.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-dark-700">
                      {feedback.feedback.map((f) => (
                        <div key={f._id} className="bg-dark-800/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-dark-300 font-medium text-sm">{f.student?.name}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <HiStar key={s} className={`w-3.5 h-3.5 ${s <= f.rating ? 'text-accent-400' : 'text-dark-600'}`} />
                              ))}
                            </div>
                          </div>
                          {f.comment && <p className="text-dark-400 text-sm">{f.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Registration Card */}
              <div className="glass-card p-6 space-y-4 sticky top-24">
                <h3 className="text-lg font-bold text-white">Event Registration</h3>

                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <p className="text-dark-400 text-sm">Please log in to register for this event.</p>
                    <Link to="/login" className="btn-primary w-full block text-center">Log In to Register</Link>
                  </div>
                ) : !isStudent() ? (
                  <p className="text-dark-400 text-sm">Only students can register for events.</p>
                ) : event.status !== 'upcoming' && event.status !== 'ongoing' ? (
                  <p className="text-dark-400 text-sm">Registration is closed for this event.</p>
                ) : isRegistered ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <HiCheckCircle className="w-5 h-5" />
                      <span className="font-semibold">You're Registered!</span>
                    </div>
                    <button onClick={handleUnregister} disabled={actionLoading} className="btn-danger w-full">
                      {actionLoading ? 'Processing...' : 'Unregister'}
                    </button>
                  </div>
                ) : (event.registrationCount || 0) >= event.maxParticipants ? (
                  <p className="text-red-400 font-semibold">Event is full</p>
                ) : (
                  <button onClick={handleRegister} disabled={actionLoading} className="btn-primary w-full">
                    {actionLoading ? 'Registering...' : 'Register Now'}
                  </button>
                )}

                <div className="pt-4 border-t border-dark-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Spots Left</span>
                    <span className="text-white font-semibold">{Math.max(0, event.maxParticipants - (event.registrationCount || 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Category</span>
                    <span className={categoryColors[event.category] || 'badge-other'}>{event.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;
