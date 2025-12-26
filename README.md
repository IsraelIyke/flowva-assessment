<p align="center">
  <img src="screenshots/referral.png" alt="Project Screenshot" width="600" />
</p>

# Rewards Page – React + Supabase Technical Assessment

This project is a recreation of the **Rewards page** on [FlowvaHub](https://www.flowvahub.com), built as part of a React Full-Stack technical assessment.

The goal of this implementation is to closely match the original UI and behavior while demonstrating clean React architecture, meaningful Supabase usage, and proper handling of real-world application states.

---

## 🔗 Live Demo

👉 **Live URL:** https://flowva-assessment.vercel.app   
👉 **GitHub Repository:** https://github.com/IsraelIyke/flowva_assessment   
👉 **Screenshots:** https://github.com/IsraelIyke/flowva_assessment/tree/main/screenshots

---

## 🎯 Scope of Implementation

- Rewards dashboard UI recreation
- Authentication using Supabase Auth
- Referrals, streaks, and points data stored and queried from Supabase
- Realtime updates using Supabase subscriptions
- Loading, empty, and error states handled explicitly
- Clean separation of concerns (components, hooks, data logic)

---

## 🧱 Tech Stack

- **Frontend:** React (Next.js App Router)
- **Language:** TypeScript
- **Backend / Database:** Supabase
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS

Supabase is used directly for:

- User authentication
- Database queries
- Realtime subscriptions
- Secure user-scoped data access

---

## 📁 Project Structure
```
app/
├─ auth/ # Authentication routes
├─ dashboard/ # Rewards page & related UI
├─ layout.tsx
└─ globals.css

contexts/
└─ AuthContext.tsx # Centralized auth state

hooks/
├─ useRewards.ts
├─ useStreaks.ts
├─ useRealtimeSubscription.ts
└─ useNotifications.ts

lib/
├─ supabase.ts # Supabase client
├─ rewards.ts # Rewards queries
└─ notifications.ts
```
```
```
## 🔐 Environment Setup
````
Create a `.env.local` file in the root directory:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
````

Ensure the following redirect URL is added in Supabase Auth settings:

```
https://your-project.supabase.co/auth/v1/callback
```

---

## 🚀 Running the Project Locally

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔄 Data Handling & State Management

- Authentication state is managed globally using `AuthContext`
- Global state is managed globally using `Zustand`
- Realtime updates are handled via Supabase subscriptions
- Explicit UI states:

  - Loading indicators while fetching data
  - Empty states when no rewards or streaks exist
  - Error handling for failed queries

---

## 🛡 Security Considerations

- Supabase Row Level Security (RLS) is enabled
- Users can only access their own rewards and streak data
- Environment variables are excluded from version control

---

## 🧠 Assumptions & Trade-offs

- The backend schema is designed to closely match expected rewards behavior rather than replicate internal FlowvaHub logic exactly
- Some svg icons were replaced by available react icons
- Notifications are handled client-side via Supabase realtime instead of external job queues to keep scope focused

---

Thank you for reviewing this submission.

```

```
