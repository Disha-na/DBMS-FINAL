import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEvents, createEvent, updateEvent, deleteEvent, getEventParticipants, getAdminStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QRScanner from '../components/QRScanner';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiUsers, HiEye, HiX, HiCalendar, HiCheckCircle, HiChartBar } from 'react-icons/hi';

const categories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const OrganizerPanel = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', endDate: '', venue: '', category: 'Technical', maxParticipants: 100, image: '', status: 'upcoming', results: ''
  });

  const fetchData = async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([getEvents(), getAdminStats()]);
      setEvents(eventsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      const { data: eventsData } = await getEvents();
      setEvents(eventsData);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({ title: '', description: '', date: '', endDate: '', venue: '', category: 'Technical', maxParticipants: 100, image: '', status: 'upcoming', results: '' });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      venue: event.venue,
      category: event.category,
      maxParticipants: event.maxParticipants,
      image: event.image || '',
      status: event.status,
      results: event.results || ''
    });
    setEditingEvent(event._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent, formData);
        toast.success('Event updated successfully!');
      } else {
        await createEvent(formData);
        toast.success('Event created successfully!');
      }
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const viewParticipants = async (eventId, title) => {
    try {
      const { data } = await getEventParticipants(eventId);
      setParticipants(data);
      setSelectedEventTitle(title);
    } catch (error) {
      toast.error('Failed to load participants');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Organizer Panel</h1>
            <p className="text-dark-400">Manage your events, participants, and check-ins</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowScanner(!showScanner)} className="btn-secondary flex items-center gap-2">
              <HiCheckCircle className="w-5 h-5" /> {showScanner ? 'Hide Scanner' : 'QR Check-in'}
            </button>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
              <HiPlus className="w-5 h-5" /> Create Event
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Events', value: stats.totalEvents, icon: HiCalendar, color: 'text-primary-400' },
              { label: 'Total Students', value: stats.totalStudents, icon: HiUsers, color: 'text-blue-400' },
              { label: 'Registrations', value: stats.totalRegistrations, icon: HiChartBar, color: 'text-green-400' },
              { label: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: HiCheckCircle, color: 'text-accent-400' },
            ].map((s) => (
              <div key={s.label} className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                  <div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-dark-400 text-sm">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Scanner */}
        {showScanner && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-6 mb-8">
            <QRScanner />
          </motion.div>
        )}

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={resetForm}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                <button onClick={resetForm} className="p-2 rounded-xl hover:bg-dark-700 text-dark-400"><HiX className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="input-field" />
                </div>
                <div>
                  <label className="input-label">Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Start Date & Time *</label>
                    <input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">End Date & Time</label>
                    <input type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Venue *</label>
                    <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Category *</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Max Participants</label>
                    <input type="number" value={formData.maxParticipants} onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })} min={1} className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field">
                      {['upcoming', 'ongoing', 'completed', 'cancelled'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="input-label">Image URL</label>
                  <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="input-field" placeholder="https://..." />
                </div>
                {editingEvent && (
                  <div>
                    <label className="input-label">Results / Announcements</label>
                    <textarea value={formData.results} onChange={(e) => setFormData({ ...formData, results: e.target.value })} rows={3} className="input-field resize-none" placeholder="Publish results here..." />
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">{editingEvent ? 'Update Event' : 'Create Event'}</button>
                  <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Events List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Your Events ({events.length})</h2>
            {events.length === 0 ? (
              <div className="text-center py-16 glass-card">
                <HiCalendar className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">No events yet. Create your first event!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-dark-400 text-sm border-b border-dark-700">
                      <th className="py-3 px-4 font-medium">Event</th>
                      <th className="py-3 px-4 font-medium hidden md:table-cell">Date</th>
                      <th className="py-3 px-4 font-medium hidden lg:table-cell">Category</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event._id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <p className="text-white font-medium">{event.title}</p>
                          <p className="text-dark-500 text-xs md:hidden">{formatDate(event.date)}</p>
                        </td>
                        <td className="py-3 px-4 text-dark-400 text-sm hidden md:table-cell">{formatDate(event.date)}</td>
                        <td className="py-3 px-4 hidden lg:table-cell"><span className={`badge-${event.category.toLowerCase()}`}>{event.category}</span></td>
                        <td className="py-3 px-4"><span className={`status-${event.status}`}>{event.status}</span></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => viewParticipants(event._id, event.title)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-blue-400 transition-colors" title="View Participants">
                              <HiEye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(event)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-accent-400 transition-colors" title="Edit">
                              <HiPencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(event._id, event.title)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-colors" title="Delete">
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Participants Modal */}
        {participants && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setParticipants(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Participants — {selectedEventTitle}</h2>
                <button onClick={() => setParticipants(null)} className="p-2 rounded-xl hover:bg-dark-700 text-dark-400"><HiX className="w-5 h-5" /></button>
              </div>
              <p className="text-dark-400 text-sm mb-4">{participants.length} participant{participants.length !== 1 ? 's' : ''}</p>
              {participants.length === 0 ? (
                <p className="text-dark-500 text-center py-8">No participants yet</p>
              ) : (
                <div className="space-y-2">
                  {participants.map((reg) => (
                    <div key={reg._id} className="flex items-center justify-between bg-dark-800/50 rounded-xl p-3">
                      <div>
                        <p className="text-white font-medium text-sm">{reg.student?.name}</p>
                        <p className="text-dark-500 text-xs">{reg.student?.email} • {reg.student?.collegeId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {reg.checkedIn ? (
                          <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                            <HiCheckCircle className="w-4 h-4" /> Checked In
                          </span>
                        ) : (
                          <span className="text-dark-500 text-xs">Not checked in</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerPanel;
