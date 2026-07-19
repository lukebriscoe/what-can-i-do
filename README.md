# What Can I Do? 🧭

A friendly, offline-first web app that gives primary-school kids (roughly 5–11) a
bit of structure over the long UK summer holiday — and pays them pocket money for
following the plan.

When my kids are on summer holidays and not booked in to clubs, I get asked 
"what can I do?" 40 times a way. It's code for them to basically say "I'm bored, can
I go on my screen?". I built this app to answer that question!

They open it, see **what to do now**, tick things off, and **bank real
pocket money** for completing the day. It frees up parents who are trying to work
from home and cutting down the reflexive reach for a screen.

> Built for one family, shared for all of them. MIT licensed — fork it, rename it,
> make it yours.

## What it does

- **A daily plan the child drives themselves** — a tappable schedule with a clear
  "do this now", big friendly targets, and a progress ring toward the day's coin.
- **Pocket money that adds up** — complete the day → bank £1 (configurable), up to a
  weekly cap (default £5). Fully configurable: amount, cap, and which days count.
- **Bonus jobs** — extra helpful jobs (empty the dishwasher, feed the pet…) the child
  can claim for a few extra pennies. A grown-up double-checks in the bank.
- **Places** — every day has a location (Home, Grandad's, Sports club, Away…) and each
  place has its own schedule, so the child can see what's coming up. Days "off" (e.g.
  away with grandparents) still show a plan but don't earn.
- **A 7-week journey map** — the whole holiday at a glance, week by week.
- **A PIN-locked grown-up area** — set up schedules, places, rewards and bonus jobs;
  record real cash payouts so the running balance stays honest.
- **Your data stays yours** — everything is stored locally on the device (IndexedDB).
  No accounts, no server, no tracking, no cost. One-tap JSON **backup & restore**.

## Quick start

```bash
npm install
npm run icons   # generate the app icons (one-off)
npm run dev     # http://localhost:5173
```

Build a static bundle:

```bash
npm run build
npm run preview
```

`dist/` is a plain static site — host it anywhere (GitHub Pages, Netlify, Cloudflare
Pages, a Raspberry Pi…). It works fully offline once loaded.

### Put it on the child's iPad

1. Host the built app somewhere with HTTPS (or run `npm run preview` on your network).
2. Open it in **Safari** on the iPad.
3. Share → **Add to Home Screen**. It launches full-screen like a native app and
   keeps working offline.

## Make it yours

Almost everything is editable in-app from the ⚙️ **grown-up area** — no code needed:

- **Rewards** – currency, £/day, weekly cap, which days earn, bonus jobs, optional
  screen-time reward.
- **Schedules** – build the list of activities for each kind of day; mark which ones
  "count" toward completing the day and which are chores.
- **Places** – add locations, point each at a schedule, plan the next two weeks.
- **Setup** – child's name & avatar, holiday start date & length, the PIN, backups.

Prefer to change the starter defaults in code? They all live in
[`src/state/defaults.js`](src/state/defaults.js).

## How it's built

- **Vite + React + Tailwind CSS**, animations by [Motion](https://motion.dev).
- **State**: one serialisable document persisted to **IndexedDB** via `idb-keyval`
  ([`src/state/store.js`](src/state/store.js)). That's what makes backup/restore a
  single JSON file.
- **Reward logic** is pure and unit-tested — see
  [`src/state/rewards.js`](src/state/rewards.js),
  [`src/state/reducer.js`](src/state/reducer.js) and the tests in
  [`src/state/rewards.test.js`](src/state/rewards.test.js).

```bash
npm test        # run the reward-maths tests
```

## A note on the "PIN"

The grown-up PIN is a light gate to keep little fingers out of the settings — not
real security. Because the app is offline and data lives only on the device, there's
nothing to hack, but don't treat the PIN as protecting anything sensitive.

## Contributing

Issues and PRs welcome — especially new schedule ideas, translations, and
accessibility improvements. Keep the child-facing UI simple, big-tappable and
readable for a five-year-old.

## License

[MIT](LICENSE).
