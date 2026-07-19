import React from 'react'
import { motion } from 'motion/react'
import { useStore } from '../../store-context.jsx'
import { todayKey } from '../../lib/date.js'
import { balanceOf, totalEarned, coreEarnedThisWeek, bonusesThisWeek } from '../../state/rewards.js'

const TYPE_META = {
  earn: { icon: '🪙', label: 'Completed a day' },
  bonus: { icon: '💎', label: 'Bonus job' },
  payout: { icon: '💷', label: 'Paid out' },
  adjust: { icon: '✏️', label: 'Adjustment' },
}

export default function Bank() {
  const { state } = useStore()
  const today = todayKey()
  const { currency } = state.settings.reward
  const balance = balanceOf(state.ledger)
  const earned = totalEarned(state.ledger)
  const weekCore = coreEarnedThisWeek(state, today)
  const weekBonus = bonusesThisWeek(state, today)

  const recent = [...state.ledger].sort((a, b) => b.ts - a.ts).slice(0, 25)

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-black text-ink">My bank</h1>

      {/* Treasure chest total */}
      <motion.div
        className="card relative overflow-hidden p-6 text-center"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <div className="text-5xl">🧰</div>
        <p className="font-display mt-1 text-xs font-bold uppercase tracking-wide text-teal">Money to collect</p>
        <p className="font-display text-5xl font-black text-teal-deep">
          {currency}
          {balance.toFixed(2)}
        </p>
        <p className="mt-1 text-sm font-bold text-ink/50">Earned {currency}{earned.toFixed(2)} in total 🌟</p>
      </motion.div>

      {/* This week chips */}
      <div className="grid grid-cols-2 gap-2">
        <div className="card p-4 text-center">
          <div className="text-2xl">🪙</div>
          <p className="font-display text-2xl font-black text-ink">
            {currency}
            {weekCore.toFixed(2)}
          </p>
          <p className="text-xs font-bold text-ink/50">this week's days</p>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl">💎</div>
          <p className="font-display text-2xl font-black text-ink">
            {currency}
            {weekBonus.toFixed(2)}
          </p>
          <p className="text-xs font-bold text-ink/50">this week's bonuses</p>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="font-display mb-2 px-1 text-sm font-black uppercase tracking-wide text-teal">
          Recent
        </h2>
        <div className="space-y-1.5">
          {recent.length === 0 && (
            <div className="card p-6 text-center text-ink/50">
              <p className="font-bold">Your treasure starts here!</p>
              <p className="text-sm">Finish today's plan to bank your first coin. 🪙</p>
            </div>
          )}
          {recent.map((e) => {
            const meta = TYPE_META[e.type] || TYPE_META.adjust
            const positive = e.amount >= 0
            return (
              <div key={e.id} className="card flex items-center gap-3 px-3 py-2.5">
                <span className="text-xl">{meta.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{e.note || meta.label}</p>
                  <p className="text-[0.7rem] font-semibold text-ink/40">
                    {new Date(e.ts).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span className={`font-display font-black ${positive ? 'text-moss' : 'text-coral'}`}>
                  {positive ? '+' : '−'}
                  {currency}
                  {Math.abs(e.amount).toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
