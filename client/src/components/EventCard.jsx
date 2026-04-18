import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCalendar, HiLocationMarker, HiUsers } from 'react-icons/hi';

const categoryColors = {
  Technical: 'badge-technical',
  Cultural: 'badge-cultural',
  Sports: 'badge-sports',
  Workshop: 'badge-workshop',
  Seminar: 'badge-seminar',
  Other: 'badge-other',
};

const categoryGradients = {
  Technical: 'from-blue-600/20 to-cyan-600/20',
  Cultural: 'from-purple-600/20 to-pink-600/20',
  Sports: 'from-green-600/20 to-emerald-600/20',
  Workshop: 'from-amber-600/20 to-orange-600/20',
  Seminar: 'from-cyan-600/20 to-teal-600/20',
  Other: 'from-gray-600/20 to-slate-600/20',
};

const EventCard = ({ event, index = 0 }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/events/${event._id}`} className="block group">
        <div className="glass-card-hover overflow-hidden">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[event.category] || categoryGradients.Other}`} />
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[event.category] || categoryGradients.Other} flex items-center justify-center`}>
                <HiCalendar className="w-16 h-16 text-dark-500" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className={categoryColors[event.category] || 'badge-other'}>
                {event.category}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className={`status-${event.status}`}>
                {event.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-dark-400 text-sm line-clamp-2">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-dark-400">
              <div className="flex items-center gap-1.5">
                <HiCalendar className="w-4 h-4 text-primary-400" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiLocationMarker className="w-4 h-4 text-accent-400" />
                <span className="truncate max-w-[150px]">{event.venue}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
              <div className="flex items-center gap-1.5 text-sm text-dark-400">
                <HiUsers className="w-4 h-4" />
                <span>{event.registrationCount || 0} / {event.maxParticipants}</span>
              </div>
              <span className="text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
