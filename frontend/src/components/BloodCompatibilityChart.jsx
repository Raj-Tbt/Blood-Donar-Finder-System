/**
 * BloodCompatibilityChart Component
 *
 * Interactive chart showing blood group donation and receiving compatibility.
 * Users click a blood group to see which groups it can donate to and receive from.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY, BLOOD_GROUP_COLORS } from '../utils/bloodGroups';

export default function BloodCompatibilityChart() {
  const [selected, setSelected] = useState(null);

  const compatibility = selected ? BLOOD_COMPATIBILITY[selected] : null;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 md:p-8 shadow-lg">
      <h3 className="section-heading text-2xl mb-2 text-center">Blood Compatibility</h3>
      <p className="section-subheading text-center mb-8">
        Click a blood group to see who can donate and receive
      </p>

      {/* Blood group selection buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {BLOOD_GROUPS.map((group) => {
          const isSelected = selected === group;
          const canDonate = compatibility?.canDonateTo?.includes(group);
          const canReceive = compatibility?.canReceiveFrom?.includes(group);
          const color = BLOOD_GROUP_COLORS[group];

          return (
            <motion.button
              key={group}
              onClick={() => setSelected(selected === group ? null : group)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-16 h-16 rounded-2xl font-bold text-sm transition-all duration-300 ${
                isSelected
                  ? 'text-white shadow-xl scale-110'
                  : selected
                  ? canDonate
                    ? 'ring-2 ring-green-400 text-white shadow-lg'
                    : canReceive
                    ? 'ring-2 ring-blue-400 text-white shadow-lg'
                    : 'opacity-30 text-white'
                  : 'text-white shadow-md hover:shadow-lg'
              }`}
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${color}, ${color}bb)`
                  : `linear-gradient(135deg, ${color}cc, ${color}99)`,
                boxShadow: isSelected ? `0 8px 25px ${color}50` : undefined,
              }}
            >
              {group}
              {selected && canDonate && !isSelected && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">
                  +
                </span>
              )}
              {selected && canReceive && !canDonate && !isSelected && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                  -
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Compatibility details panel */}
      <AnimatePresence mode="wait">
        {selected && compatibility && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 text-sm">
                {selected} can donate to:
              </h4>
              <div className="flex flex-wrap gap-2">
                {compatibility.canDonateTo.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-lg text-sm font-medium text-white"
                    style={{ background: BLOOD_GROUP_COLORS[g] }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 text-sm">
                {selected} can receive from:
              </h4>
              <div className="flex flex-wrap gap-2">
                {compatibility.canReceiveFrom.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-lg text-sm font-medium text-white"
                    style={{ background: BLOOD_GROUP_COLORS[g] }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            {compatibility.label && (
              <div className="md:col-span-2 text-center">
                <span className="badge-pill bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold">
                  {compatibility.label}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Click any blood group to explore compatibility
        </p>
      )}
    </div>
  );
}
