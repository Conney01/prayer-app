# Sanctuary — Feature Roadmap

## Phase 1 — Core Prayer Experience (No schema changes)
- [x] Prayer History — recent and completed prayers from existing `PrayerCompletion`
- [x] Weekly Streak Tracker — 7-day visual ring with gentle, non-guilt framing
- [x] Quick Revisit & Favorite Actions

## Phase 2 — Daily Scripture Anchor (Small migration)
- [x] `DailyScripture` model — reference, text, reflection, linked prayer
- [x] Automated daily scripture & reflection rotation on dashboard

## Phase 3 — Personal Sanctuary (Batched migration)
- [ ] `JournalEntry` — private reflections & gratitude prompts
- [ ] `PrayerRequest` — active, answered, and archived prayer logs

## Phase 4 — Be Still (Frontend only)
- [ ] Distraction-free prayer reader & timer-based quiet stillness moment

## Phase 5 — Ambient Audio (Frontend only)
- [ ] Looping soundscapes (gentle rain, cathedral stillness, quiet piano)

## Phase 6 — Community
- [ ] `CommunityPrayer` — opt-in shared prayer requests & support taps

## Phase 7 — Sharing & Social
- [ ] Share card generator (`@vercel/og`) for prayers & scriptures

## Phase 8 — Reminders
- [ ] `Reminder` model — custom schedules & web push notifications

## Phase 9 — M-Pesa Support (Isolated model)
- [x] `Donation` model — Daraja STK Push integration at `/support`
- [x] Subtle "Support M-Pesa" entry point in dashboard header

## Phase 10 — AI Prayer Assistant (Last)
- [ ] Gemini-powered devotional draft assistant inside Admin Curator