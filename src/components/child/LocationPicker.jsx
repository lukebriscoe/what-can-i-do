import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function LocationPicker({ open, locations, currentId, onPick, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-teal-deep/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card mx-3 mb-3 w-full max-w-md p-4 safe-b"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display mb-3 text-center text-lg font-black text-teal-deep">
              Where are you today?
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {locations.map((loc) => {
                const active = loc.id === currentId
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onPick(loc.id)
                      onClose()
                    }}
                    className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition active:scale-95 ${
                      active ? 'border-teal bg-teal-soft' : 'border-ink/10 bg-white/70'
                    }`}
                  >
                    <span className="text-3xl">{loc.icon}</span>
                    <span className="text-center text-xs font-bold leading-tight">{loc.name}</span>
                    {!loc.earns && <span className="text-[0.6rem] font-semibold text-ink/40">day off</span>}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
