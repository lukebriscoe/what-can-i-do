import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const CONFETTI = ['🪙', '⭐', '🎉', '💛', '✨', '🥳', '🌟']

export default function CoinCelebration({ show, amount, currency = '£', onDone }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => onDone?.(), 2600)
    return () => clearTimeout(t)
  }, [show, onDone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-teal-deep/45 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDone}
        >
          {/* confetti rain */}
          {Array.from({ length: 26 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute text-2xl"
              style={{ left: `${(i * 37) % 100}%` }}
              initial={{ top: '-8%', rotate: 0, opacity: 0 }}
              animate={{ top: '110%', rotate: 360, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8 + (i % 5) * 0.25, delay: (i % 8) * 0.08, ease: 'easeIn' }}
            >
              {CONFETTI[i % CONFETTI.length]}
            </motion.span>
          ))}

          <motion.div
            className="card relative z-10 mx-6 max-w-xs px-8 py-7 text-center"
            initial={{ scale: 0.5, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, -12, 12, -8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.9, delay: 0.15 }}
            >
              🪙
            </motion.div>
            <h2 className="font-display mt-2 text-2xl font-black text-teal-deep">Day complete!</h2>
            {amount > 0 ? (
              <p className="mt-1 text-lg font-extrabold text-ink">
                You banked{' '}
                <span className="text-coral">
                  {currency}
                  {amount.toFixed(2)}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-base font-bold text-ink/70">Brilliant effort today! 🌟</p>
            )}
            <p className="mt-3 text-sm font-semibold text-ink/50">Tap to close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
