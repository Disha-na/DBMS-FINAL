import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { HiLightningBolt, HiUserGroup, HiShieldCheck, HiCalendar, HiArrowRight, HiQrcode, HiStar, HiChartBar } from 'react-icons/hi';

const features = [
  {
    icon: HiCalendar,
    title: 'Event Discovery',
    description: 'Browse and discover exciting campus events across all categories.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: HiLightningBolt,
    title: 'Quick Registration',
    description: 'Register for events with a single click. Manage all your events in one place.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: HiQrcode,
    title: 'QR Check-in',
    description: 'Seamless check-in at events using QR codes. No more long queues!',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: HiStar,
    title: 'Event Feedback',
    description: 'Rate and review events to help organizers improve future events.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: HiUserGroup,
    title: 'Organizer Tools',
    description: 'Powerful tools for coordinators to manage events and participants.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: HiChartBar,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics for admins to track engagement and performance.',
    color: 'from-rose-500 to-red-500',
  },
];

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await getEvents({ status: 'upcoming' });
        setUpcomingEvents(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium">
              <HiLightningBolt className="w-4 h-4 mr-2" />
              Smart Campus Event Management
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
              <span className="text-white">Discover & Join</span>
              <br />
              <span className="gradient-text">Campus Events</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-dark-400 leading-relaxed">
              Your one-stop platform for discovering, registering, and managing college events. 
              From hackathons to cultural fests — never miss an event again.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/events" className="btn-primary text-lg py-3.5 px-8 flex items-center gap-2">
                Explore Events <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="btn-secondary text-lg py-3.5 px-8">
                Get Started
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-16 pt-8">
              {[
                { value: '50+', label: 'Events' },
                { value: '1000+', label: 'Students' },
                { value: '20+', label: 'Departments' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-dark-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-dark-600 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-primary-500 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Why CampusEvents?</h2>
            <p className="text-dark-400 max-w-2xl mx-auto text-lg">
              Everything you need to manage campus events, all in one powerful platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card-hover p-6 space-y-4"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="text-dark-400 text-lg">Don't miss out on these exciting upcoming events.</p>
            </div>
            <Link to="/events" className="btn-secondary flex items-center gap-2">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <HiCalendar className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 text-lg">No upcoming events at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative glass-card p-8 sm:p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/10" />
            <div className="relative space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Get Involved?
              </h2>
              <p className="text-dark-400 text-lg max-w-xl mx-auto">
                Create an account today and start exploring amazing events happening on campus.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary text-lg py-3.5 px-8">
                  Create Free Account
                </Link>
                <Link to="/events" className="btn-secondary text-lg py-3.5 px-8">
                  Browse Events
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
