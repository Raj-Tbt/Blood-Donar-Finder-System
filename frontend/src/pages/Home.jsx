/**
 * Home Page
 *
 * Landing page with hero section, animated statistics,
 * how-it-works steps, blood compatibility chart, eligibility checker,
 * and a call-to-action section.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDroplet, FiUsers, FiHeart, FiArrowRight, FiSearch, FiShield, FiCheckCircle } from 'react-icons/fi';
import StatsCounter from '../components/StatsCounter';
import BloodCompatibilityChart from '../components/BloodCompatibilityChart';
import EligibilityChecker from '../components/EligibilityChecker';
import api from '../utils/api';

export default function Home() {
  const [stats, setStats] = useState({ totalDonors: 0, totalRequests: 0, totalDonations: 0 });

  /* Fetch dashboard statistics for the counters section */
  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-dark-bg to-blood-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blood-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blood-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blood-500/5 rounded-full blur-3xl" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-blood-500/20"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                fontSize: `${30 + i * 10}px`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <FiDroplet />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated icon */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-6 inline-block text-blood-400"
            >
              <FiDroplet className="w-16 h-16" />
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              One Drop.{' '}
              <span className="bg-gradient-to-r from-blood-400 to-blood-600 bg-clip-text text-transparent">
                One Life.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with blood donors near you. Every donation is a chance to save someone's life.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg !px-8 !py-4 flex items-center space-x-2">
                <FiHeart className="w-5 h-5" />
                <span>Become a Donor</span>
              </Link>
              <Link
                to="/donors"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <FiSearch className="w-5 h-5" />
                <span>Find Donors</span>
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StatsCounter
              value={stats.totalDonors}
              label="Registered Donors"
              icon={<FiUsers />}
              suffix="+"
            />
            <StatsCounter
              value={stats.totalDonations}
              label="Total Donations"
              icon={<FiDroplet />}
              suffix="+"
            />
            <StatsCounter
              value={stats.totalRequests}
              label="Blood Requests"
              icon={<FiHeart />}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading">Three simple steps to save a life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiUsers className="w-8 h-8" />,
                title: 'Register',
                desc: 'Sign up as a donor or hospital. Share your blood group and location.',
                step: '01'
              },
              {
                icon: <FiSearch className="w-8 h-8" />,
                title: 'Find & Match',
                desc: 'Search donors by blood group and city. Our system matches you intelligently.',
                step: '02'
              },
              {
                icon: <FiHeart className="w-8 h-8" />,
                title: 'Donate & Save',
                desc: 'Connect with hospitals, donate blood, earn badges, and save lives!',
                step: '03'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="card-hover p-8 text-center relative"
              >
                <div className="absolute top-4 right-4 font-display text-5xl font-bold text-gray-100 dark:text-gray-800">
                  {item.step}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blood-50 dark:bg-blood-900/20 text-blood-500 rounded-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Compatibility Chart */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4">
          <BloodCompatibilityChart />
        </div>
      </section>

      {/* Eligibility Checker */}
      <section className="py-20 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-4xl mx-auto px-4">
          <EligibilityChecker />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blood-500 to-blood-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of donors and hospitals. Your blood donation can save up to three lives.
          </p>
          <Link to="/register" className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blood-600 font-bold rounded-xl shadow-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-lg">
            <span>Get Started</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
