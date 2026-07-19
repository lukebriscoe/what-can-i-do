# What Can I Do? 🧭

A friendly, offline-first web app that gives primary-school kids (roughly 5–11) a
bit of structure over the long UK summer holiday — and pays them pocket money for
following the plan.

When my kids are on summer holidays and not booked in to clubs, I get asked
"what can I do?" 40 times a day. It's code for them to basically say "I'm bored, can
I go on my screen?". I built this app to answer that question!

They open it, see **what to do now**, tick things off, and **bank real
pocket money** for completing the day. It frees up parents who are trying to work
from home and cuts down the reflexive reach for a screen.

> Built for one family, shared for all of them. MIT licensed — fork it, rename it,
> make it yours.

**👉 Try it now: [lukebriscoe.com/what-can-i-do](https://lukebriscoe.com/what-can-i-do/)**

---

## 👩‍👦 For grown-ups — getting started

**You don't need to install anything or fork this repo.** Just open the link above,
set it up for your child, and add it to their home screen. It takes about five minutes.

### 1. Put it on the child's device

- Open **[lukebriscoe.com/what-can-i-do](https://lukebriscoe.com/what-can-i-do/)** in
  **Safari** (iPad/iPhone) or Chrome (Android).
- **iPad/iPhone:** tap the **Share** button → **Add to Home Screen**.
- It now launches full-screen like a proper app and **keeps working with no internet**.

### 2. Open the grown-up area

Tap the **⚙️ cog** in the top-right. You'll land on **Setup**. (There's no PIN yet, so
it's open — you'll set one in a moment.)

### 3. Set it up (the ⚙️ area has five tabs)

- **Setup** — your child's **name & avatar**, the **first Monday of the holiday** and
  **number of weeks** (this draws their journey map), and a **PIN** to lock the
  grown-up area so little fingers can't change the rules. *Also here: back up your
  data — see below.*
- **Rewards** — money **per completed day**, the **weekly limit**, **which days can
  earn** (default Mon–Fri), and the list of **bonus jobs** (extra helpful tasks worth
  a few pennies). There's an optional screen-time reward too.
- **Schedules** — the plans themselves. Add/edit/reorder activities, mark which ones
  **count** toward finishing the day, and which are **jobs** (chores).
- **Places** — where your child will be (Home, Grandparents, Summer club, On Holiday…).
  Each place has its own schedule. Use the **week-by-week planner** to set where they
  are each day — plan the whole holiday ahead if you like. Turn a place's **"Earns"**
  off for days that shouldn't pay out (e.g. away on holiday).
- **Bank** — the running balance you owe, a full history, **record cash payouts** when
  you hand money over, and make **manual adjustments** (a spontaneous reward, or put a
  **minus sign** in front to dock money for bad behaviour).

### 4. Hand it over

Your child opens **Today**, sees what to do now, and taps each activity as they finish.
When every "counts" activity is done, the day is complete, the coins drop 🪙, and the
day's money is banked (up to the weekly limit). They can also claim **bonus jobs** —
you double-check those in the **Bank** tab. The **Week** tab lets them see what's coming
up, including days at Grandparents, clubs, or away.

### 5. Pay out & keep a backup

- Pocket money is tracked as a running total (an IOU). When you actually hand over
  cash, go to **⚙️ → Bank → Record a payout** so the balance stays honest.
- Your data lives **only on that device**. Now and then, open **⚙️ → Setup → Download a
  backup file** and keep it somewhere safe. You can restore it on any device — handy if
  you get a new iPad or want the same setup on two devices.

### How the money works

Complete a day → bank the daily amount (default **£1**), up to a weekly limit
(default **£5**). Weekends are off by default. Bonus jobs and manual rewards are on top
of the weekly limit. Everything is configurable in **⚙️ → Rewards**.

---

## 🔒 Your data & privacy

- **No accounts, no server, no tracking, no cost.** Everything is stored locally in the
  browser on your device (IndexedDB).
- Because of that, **every family's data is completely private to their own device** —
  lots of families can use the same link and never see each other's data.
- The **grown-up PIN** is a light gate to keep children out of the settings, not real
  security. There's nothing sensitive stored and nothing leaves the device — but don't
  treat the PIN as protecting anything important.
- The trade-off: if the device is wiped and you have no backup, the data is gone. So
  **download a backup now and then** (⚙️ → Setup).

---

## What it does

- **A daily plan the child drives themselves** — a tappable schedule with a clear
  "do this now", big friendly targets, and a progress ring toward the day's coin.
- **Pocket money that adds up** — complete the day → bank the daily amount, up to a
  weekly cap. Fully configurable: amount, cap, and which days count.
- **Bonus jobs** — extra helpful jobs (water the plants, help wash the car…) the child
  can claim for a few extra pennies. A grown-up double-checks in the bank.
- **Places** — every day has a location (Home, Grandparents, Summer club, On Holiday…)
  and each place has its own schedule, so the child can see what's coming up. Days
  "off" still show a plan but don't earn.
- **A week-by-week journey map** — the whole holiday at a glance, with a per-day peek so
  kids can look ahead.
- **A PIN-locked grown-up area** — set up schedules, places, rewards and bonus jobs;
  record real cash payouts so the running balance stays honest.
- **Your data stays yours** — everything is stored locally on the device (IndexedDB).
  No accounts, no server, no tracking, no cost. One-tap JSON **backup & restore**.

---

## 🛠️ Run or self-host it yourself

You only need this section if you want to **change the code, tweak the starter defaults,
or host your own copy** — most people can just use the link above.

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
Pages, a Raspberry Pi…). It works fully offline once loaded. This repo auto-deploys to
GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every
push to `main`.

Prefer to change the starter schedules, places or bonus jobs in code? They all live in
[`src/state/defaults.js`](src/state/defaults.js) — though you can edit all of it in-app
without touching code.

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
npm test        # run the reward-maths + render tests
```

## Contributing

Issues and PRs welcome — especially new schedule ideas, translations, and
accessibility improvements. Keep the child-facing UI simple, big-tappable and
readable for a five-year-old.

## License

[MIT](LICENSE).
