# Sanctuary — Feature Roadmap

## Phase 1 — Core Prayer Experience (No schema changes)
- [x] Prayer History — recent and completed prayers from existing `PrayerCompletion`
- [x] Weekly Streak Tracker — 7-day visual ring with gentle, non-guilt framing
- [x] Quick Revisit & Favorite Actions

## Phase 2 — Daily Scripture Anchor (Small migration)
- [x] `DailyScripture` model — reference, text, reflection, linked prayer
- [x] Admin CRUD for managing daily scriptures at `/admin/scriptures`
- [x] "Begin Prayer" CTA linking scripture to its devotional prayer

## Phase 3 — Personal Sanctuary (Batched migration)
- [ ] `JournalEntry` — private reflections & gratitude prompts
- [ ] `PrayerRequest` — active, answered, and archived prayer logs
- [ ] Answered Prayers praise archive view

## Phase 4 — Be Still (Frontend only)
- [ ] Distraction-free prayer reader: Scripture → Reflection → Prayer → Journal
- [ ] Timer-based quiet stillness moment with minimal UI

## Phase 5 — Ambient Audio (Frontend only)
- [ ] Looping soundscapes (gentle rain, cathedral stillness, quiet piano, dawn nature)
- [ ] Audio player controls (play/pause, volume slider, sleep timer)

## Phase 6 — Community
- [ ] `CommunityPrayer` — opt-in shared prayer requests
- [ ] "I Prayed" tap-to-support interaction
- [ ] Admin moderation queue

## Phase 7 — Sharing & Social
- [ ] Share card generator (`@vercel/og`) for prayers & scriptures
- [ ] One-tap sharing to WhatsApp, Instagram Stories, and direct link copy
- [ ] Instagram Content helper for devotional daily banners

## Phase 8 — Reminders
- [ ] `Reminder` model — custom schedules (morning / midday / evening)
- [ ] Web push notifications with gentle, uplifting copy

## Phase 9 — M-Pesa Support (Isolated model)
- [ ] `Donation` model — Daraja STK Push integration
- [ ] Subtle "Support Sanctuary" entry point (no paywalled prayers)

## Phase 10 — AI Prayer Assistant (Last)
- [ ] Gemini-powered devotional draft assistant inside Admin Curator