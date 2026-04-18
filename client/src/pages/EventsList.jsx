import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { HiSearch, HiFilter, HiCalendar } from 'react-icons/hi';

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];
const statuses = ['All', 'upcoming', 'ongoing', 'completed', 'cancelled'];

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;

      const { data } = await getEvents(params);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [category, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="section-title">Browse Events</h1>
          <p className="text-dark-400 text-lg">Discover and register for exciting campus events</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title or description..."
              className="input-field pl-12 pr-24"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-sm py-1.5 px-4">
              Search
            </button>
          </form>

          {/* Category Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-dark-400">
              <HiFilter className="w-4 h-4" /> Category
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    category === cat
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-dark-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-dark-400">
              <HiCalendar className="w-4 h-4" /> Status
            </div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                    status === s
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-dark-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <>
            <p className="text-dark-400 mb-4">{events.length} event{events.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <HiCalendar className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark-300 mb-2">No Events Found</h2>
            <p className="text-dark-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
