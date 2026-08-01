# Deployment Guide

This guide covers deploying Smugflex AI Academy to production using Docker, Railway, and Vercel.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel (Frontend)                     │
│                    https://ai-schools-mu.vercel.app         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Railway (Backend API)                    │
│                  https://your-app.up.railway.app            │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ PostgreSQL│  │  Redis   │  │  Qdrant  │
        │ (Railway) │  │ (Railway)│  │ (Cloud)  │
        └──────────┘  └──────────┘  └──────────┘
```

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Railway CLI (`npm install -g @railway/cli`)
- Vercel CLI (`npm install -g vercel`)
- Accounts: Clerk, OpenAI, Anthropic, Stripe

---

## Local Development with Docker

### 1. Clone and Setup

```bash
git clone https://github.com/Hoseaurbanus/AI-SCHOOL.git
cd AI-SCHOOL
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 3001
- Frontend on port 5173

### 3. Initialize Database

```bash
docker-compose exec backend npx drizzle-kit push
```

### 4. Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/v1
- API Health: http://localhost:3001/api/v1/health

---

## Deploy Backend to Railway

### 1. Login to Railway

```bash
railway login
```

### 2. Create New Project

```bash
cd backend
railway init
```

### 3. Add PostgreSQL Plugin

```bash
railway add --plugin postgresql
```

### 4. Add Redis Plugin

```bash
railway add --plugin redis
```

### 5. Set Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set CLERK_SECRET_KEY=sk_test_xxx
railway variables set CLERK_PUBLISHABLE_KEY=pk_test_xxx
railway variables set OPENAI_API_KEY=sk-xxx
railway variables set ANTHROPIC_API_KEY=sk-ant-xxx
railway variables set STRIPE_SECRET_KEY=sk_test_xxx
railway variables set STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 6. Deploy

```bash
railway up
```

### 7. Get Backend URL

```bash
railway domain
# Output: https://your-app.up.railway.app
```

---

## Deploy Frontend to Vercel

### 1. Login to Vercel

```bash
vercel login
```

### 2. Link Project

```bash
vercel link
```

### 3. Set Environment Variables

```bash
vercel env add VITE_API_URL
# Enter: https://your-app.up.railway.app/api/v1

vercel env add VITE_CLERK_PUBLISHABLE_KEY
# Enter: pk_test_xxx
```

### 4. Deploy

```bash
# Production deployment
vercel --prod

# Or push to main branch for auto-deploy
git push origin main
```

### 5. Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Environment Variables Reference

### Backend (Railway)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Auto (Railway plugin) |
| `REDIS_URL` | Redis connection string | Auto (Railway plugin) |
| `CLERK_SECRET_KEY` | Clerk backend secret | Yes |
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `QDRANT_URL` | Qdrant vector DB URL | Optional |
| `MEILI_URL` | Meilisearch URL | Optional |

### Frontend (Vercel)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |

---

## Post-Deployment Checklist

### Backend

- [ ] Health check endpoint responds: `GET /api/v1/health`
- [ ] Database migrations ran successfully
- [ ] Redis connection working
- [ ] Clerk authentication working
- [ ] AI providers (OpenAI, Anthropic) responding
- [ ] Stripe webhooks configured

### Frontend

- [ ] Site loads without errors
- [ ] Clerk authentication working
- [ ] API calls reaching backend
- [ ] AI chat streaming working
- [ ] Course enrollment working
- [ ] Payment flow working

### Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.up.railway.app/api/v1/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

---

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
railway logs

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Redis connection failed
```

### Frontend Can't Reach API

```bash
# Check Vercel environment variables
vercel env ls

# Verify API URL is correct
# Should be: https://your-app.up.railway.app/api/v1
```

### Database Issues

```bash
# Connect to database
railway connect postgresql

# Run migrations manually
railway run npx drizzle-kit push
```

---

## Cost Estimation

### Railway (Backend)

- Starter Plan: $5/month
- PostgreSQL: $5-20/month (based on usage)
- Redis: $5-10/month (based on usage)
- **Total: ~$15-35/month**

### Vercel (Frontend)

- Hobby Plan: Free (personal projects)
- Pro Plan: $20/month (team features)
- **Total: $0-20/month**

### External Services

- Clerk: Free tier (10,000 MAUs)
- OpenAI: Pay-per-use (~$0.01-0.10 per request)
- Anthropic: Pay-per-use (~$0.01-0.15 per request)
- Stripe: 2.9% + $0.30 per transaction

**Total Monthly Cost: ~$20-60/month** (depending on usage)
