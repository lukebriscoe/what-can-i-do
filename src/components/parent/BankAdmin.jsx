import React, { useState } from 'react'
import { useStore } from '../../store-context.jsx'
import { balanceOf, totalEarned, totalPaidOut, money } from '../../state/rewards.js'
import { Section, NumberInput, TextInput, Button } from './controls.jsx'

const TYPE_ICON = { earn: '🪙', bonus: '💎', payout: '💷', adjust: '✏️' }

export default function BankAdmin() {
  const { state, dispatch } = useStore()
  const { currency } = state.settings.reward
  const balance = balanceOf(state.ledger)
  const [payout, setPayout] = useState('')
  const [adjAmount, setAdjAmount] = useState('')
  const [adjNote, setAdjNote] = useState('')

  const ledger = [...state.ledger].sort((a, b) => b.ts - a.ts)

  return (
    <div>
      <Section title="Balance owed">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="To pay" value={money(balance, currency)} big />
          <Stat label="Earned" value={money(totalEarned(state.ledger), currency)} />
          <Stat label="Paid out" value={money(totalPaidOut(state.ledger), currency)} />
        </div>
      </Section>

      <Section title="Record a payout" hint="Log real cash you've handed over so the balance stays accurate.">
        <div className="flex items-center gap-2">
          <NumberInput value={payout} prefix={currency} onChange={setPayout} />
          <Button
            className="flex-1"
            onClick={() => {
              if (Number(payout) > 0) {
                dispatch({ type: 'recordPayout', amount: payout, note: `Paid ${money(Number(payout), currency)}` })
                setPayout('')
              }
            }}
          >
            Mark as paid
          </Button>
        </div>
        <div className="mt-2 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => setPayout(balance)}>
            Pay it all ({money(balance, currency)})
          </Button>
        </div>
      </Section>

      <Section
        title="Manual adjustment"
        hint={`Add money for a spontaneous reward. To take money away for bad behaviour, put a minus sign in front of the amount, e.g. -${Number(0.5).toFixed(2)}.`}
      >
        <TextInput
          value={adjNote}
          placeholder="Reason (optional)"
          onChange={(e) => setAdjNote(e.target.value)}
          className="mb-2 w-full"
        />
        <div className="flex items-center gap-2">
          <NumberInput value={adjAmount} prefix={currency} step={0.5} min={-999} onChange={setAdjAmount} />
          <Button
            variant="amber"
            className="flex-1"
            onClick={() => {
              if (adjAmount !== '' && Number(adjAmount) !== 0) {
                dispatch({ type: 'addAdjust', amount: adjAmount, note: adjNote || 'Adjustment' })
                setAdjAmount('')
                setAdjNote('')
              }
            }}
          >
            Apply
          </Button>
        </div>
        {adjAmount !== '' && Number(adjAmount) !== 0 && (
          <p className={`mt-2 text-sm font-bold ${Number(adjAmount) < 0 ? 'text-coral' : 'text-moss'}`}>
            {Number(adjAmount) < 0
              ? `➖ This will take ${currency}${Math.abs(Number(adjAmount)).toFixed(2)} away.`
              : `➕ This will add ${currency}${Number(adjAmount).toFixed(2)}.`}
          </p>
        )}
      </Section>

      <Section title="Full history" hint="Tap 🗑 to undo any entry.">
        <div className="space-y-1.5">
          {ledger.length === 0 && <p className="text-sm text-ink/50">No entries yet.</p>}
          {ledger.map((e) => (
            <div key={e.id} className="flex items-center gap-2 rounded-xl border-2 border-ink/10 bg-white/70 px-2.5 py-2">
              <span>{TYPE_ICON[e.type] || '•'}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{e.note}</p>
                <p className="text-[0.7rem] font-semibold text-ink/40">
                  {new Date(e.ts).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <span className={`font-display font-black ${e.amount >= 0 ? 'text-moss' : 'text-coral'}`}>
                {e.amount >= 0 ? '+' : '−'}
                {currency}
                {Math.abs(e.amount).toFixed(2)}
              </span>
              <button
                onClick={() => dispatch({ type: 'removeLedgerEntry', id: e.id })}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-coral/10 text-coral"
                aria-label="Delete entry"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Stat({ label, value, big }) {
  return (
    <div className="rounded-xl border-2 border-ink/10 bg-white/70 p-3">
      <p className={`font-display font-black text-teal-deep ${big ? 'text-2xl' : 'text-lg'}`}>{value}</p>
      <p className="text-[0.7rem] font-bold text-ink/50">{label}</p>
    </div>
  )
}
