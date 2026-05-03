# FUAI — AI-Powered Content Transformation Platform

> A modern SaaS platform built with Next.js 14, Tailwind CSS, Prisma ORM, PostgreSQL, and the OpenAI API. Inspired by content transformation tools — built from scratch with a clean, scalable architecture.

---

## 🗂 Folder Structure

```
fuai/
├── prisma/
│   └── schema.prisma          # DB schema: User, Request, Subscription
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (fonts, toast provider)
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── dashboard/         # Dashboard (stats, quick actions)
│   │   │   └── layout.tsx     # Shared sidebar + header layout
│   │   ├── tools/             # AI Tool interface (core feature)
│   │   ├── history/           # Paginated generation history
│   │   ├── profile/           # User profile + subscription
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── signup/    # POST — create account
│   │       │   ├── login/     # POST — authenticate
│   │       │   ├── logout/    # POST — clear session
│   │       │   └── me/        # GET  — current user
│   │       ├── generate/      # POST — core AI generation
│   │       ├── history/       # GET/DELETE — request history
│   │       └── user/          # GET/PATCH — profile + stats
│   │
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── ToolsSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   └── Footer.tsx
│   │   └── dashboard/
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   │
│   ├── hooks/
│   │   └── useAuth.ts         # Client auth hook (login/signup/logout)
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # JWT sign/verify + session cookies
│   │   ├── ai.ts              # Tool config + OpenAI integration
│   │   └── utils.ts           # cn(), formatDate, wordCount, etc.
│   │
│   ├── middleware.ts           # Route protection + guest redirects
│   ├── types/index.ts         # Shared TypeScript types
│   └── styles/globals.css     # Tailwind + custom CSS tokens
│
├── .env.example               # Environment variable template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd fuai
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in DATABASE_URL, JWT_SECRET, OPENAI_API_KEY
```

### 3. Set up PostgreSQL

**Option A: Local (using psql)**
```bash
psql -U postgres
CREATE DATABASE fuai;
\q
```

**Option B: Docker**
```bash
docker run --name fuai-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=fuai \
  -p 5432:5432 \
  -d postgres:16
```

**Option C: Supabase / Neon (cloud free tier)**
- Create a project, copy the connection string into `DATABASE_URL`

### 4. Run database migrations

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to DB (dev)
# OR for production migrations:
npm run db:migrate
```

### 5. Start the dev server

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🧪 Running Without OpenAI Key

If `OPENAI_API_KEY` is not set, the app runs in **Demo Mode** — all API calls return a mock response. This lets you test the full flow (auth, history, UI) without spending credits.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens (use `openssl rand -base64 32`) |
| `OPENAI_API_KEY` | Optional | OpenAI API key (app runs in demo mode without it) |
| `NEXT_PUBLIC_APP_URL` | Optional | Your production URL |

---

## 🏗 Architecture

### Authentication Flow
1. User submits email/password to `/api/auth/login` or `/api/auth/signup`
2. Server validates, hashes password with bcrypt, creates JWT
3. JWT is stored in a **HttpOnly cookie** (not localStorage — safer)
4. `middleware.ts` checks the cookie on every protected route
5. `useAuth()` hook fetches `/api/auth/me` on client load

### AI Generation Flow
1. Client sends `{ toolType, inputText }` to `POST /api/generate`
2. Server authenticates user via cookie
3. Checks monthly usage against subscription limit
4. Calls OpenAI with tool-specific system prompt
5. Saves request + output to `requests` table
6. Increments `subscription.requestsUsed`
7. Returns output to client

### Database Design
```
User ─┬─ Subscription (1:1)
      └─ Request[] (1:many)
```

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

```bash
npm i -g vercel
vercel
# Follow the prompts
# Add env vars in Vercel dashboard → Settings → Environment Variables
```

### Option 2: Railway

1. Push code to GitHub
2. Create new Railway project → Deploy from GitHub
3. Add PostgreSQL service (Railway provides one)
4. Set env vars in Railway settings
5. Deploy

### Option 3: Self-hosted (Docker)

```dockerfile
# Dockerfile (add to project root)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000
```

```bash
docker build -t fuai .
docker run -p 3000:3000 --env-file .env.local fuai
```

---

## 🔐 Security Notes

- Passwords are hashed with **bcrypt (12 rounds)**
- Sessions use **HttpOnly, Secure, SameSite=Lax** cookies
- Input is validated with **Zod** on every API route
- SQL injection is impossible — all DB access goes through **Prisma**
- Rate limiting and usage caps prevent abuse
- Never expose `JWT_SECRET` or `OPENAI_API_KEY` to the client

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom tokens |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Custom JWT + HttpOnly cookies |
| AI | OpenAI GPT-3.5-turbo / GPT-4 |
| Validation | Zod |
| Notifications | react-hot-toast |
| Fonts | Syne (display) + DM Sans (body) |

---

## 🛣 Roadmap

- [ ] Google OAuth login
- [ ] Stripe payment integration (Pro/Enterprise plans)
- [ ] API access for developers
- [ ] Team workspace + shared history
- [ ] Custom AI personas
- [ ] Webhook notifications
- [ ] Export history as PDF/CSV

---

## 📄 License

MIT © FUAI
