import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminStats, getAdminAnalytics } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HiUsers, HiCalendar, HiClipboardList, HiStar, HiCheckCircle, HiChartBar } from 'react-icons/hi';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#818cf8', '#60a5fa'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([getAdminStats(), getAdminAnalytics()]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: HiUsers, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
    { label: 'Total Events', value: stats?.totalEvents || 0, icon: HiCalendar, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
    { label: 'Registrations', value: stats?.totalRegistrations || 0, icon: HiClipboardList, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
    { label: 'Feedback', value: stats?.totalFeedback || 0, icon: HiStar, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' },
    { label: 'Check-ins', value: stats?.checkedInCount || 0, icon: HiCheckCircle, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-500/10' },
    { label: 'Attendance Rate', value: `${stats?.attendanceRate || 0}%`, icon: HiChartBar, color: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-500/10' },
  ];

  const categoryData = analytics?.eventsByCategory?.map((c) => ({ name: c._id, value: c.count })) || [];
  const statusData = analytics?.eventsByStatus?.map((s) => ({ name: s._id, value: s.count })) || [];
  const regTimeData = analytics?.registrationsOverTime?.map((r) => ({ date: r._id.slice(5), count: r.count })) || [];
  const topEventsData = analytics?.topEvents?.map((e) => ({ name: e.title.length > 20 ? e.title.slice(0, 20) + '...' : e.title, count: e.count })) || [];
  const feedbackData = analytics?.feedbackStats?.map((f) => ({ name: f.title.length > 20 ? f.title.slice(0, 20) + '...' : f.title, rating: f.avgRating, reviews: f.count })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-3 shadow-xl">
          <p className="text-white font-medium text-sm">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="text-dark-400">Comprehensive analytics and insights for your campus events</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ color: CHART_COLORS[i] }} />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-dark-400 text-xs mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Events by Category - Pie */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Events by Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span className="text-dark-300 text-sm">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-dark-500 text-center py-16">No data available</p>
            )}
          </motion.div>

          {/* Registrations Over Time - Line */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Registrations Over Time</h3>
            {regTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={regTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} name="Registrations" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-dark-500 text-center py-16">No recent registrations</p>
            )}
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Events - Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Top Events by Registrations</h3>
            {topEventsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topEventsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} name="Registrations">
                    {topEventsData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-dark-500 text-center py-16">No data available</p>
            )}
          </motion.div>

          {/* Feedback Ratings - Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Event Feedback Ratings</h3>
            {feedbackData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedbackData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" domain={[0, 5]} stroke="#64748b" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rating" fill="#f59e0b" radius={[0, 6, 6, 0]} name="Rating">
                    {feedbackData.map((_, i) => <Cell key={i} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-dark-500 text-center py-16">No feedback yet</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
