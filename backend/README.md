# Smugflex AI Academy Backend

Backend API for the Smugflex AI Academy platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **Auth**: Clerk
- **AI**: OpenAI + Anthropic (multi-provider)
- **Vector DB**: Qdrant (for RAG)

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your API keys
```

### Database Setup

```bash
# Generate migration
npm run db:generate

# Run migration
npm run db:migrate

# Or push schema directly (development)
npm run db:push
```

### Development

```bash
# Start development server
npm run dev
```

### Production

```bash
# Build
npm run build

# Start
npm start
```

## API Endpoints

### Health
- `GET /api/v1/health` - Health check

### Courses
- `GET /api/v1/courses` - List courses
- `GET /api/v1/courses/:id` - Get course
- `POST /api/v1/courses` - Create course
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/:id` - Delete course

### Enrollments
- `GET /api/v1/enrollments/me` - Get user enrollments
- `POST /api/v1/enrollments` - Enroll in course
- `PUT /api/v1/enrollments/:id/progress` - Update progress

### AI
- `POST /api/v1/ai/chat` - Chat with AI (streaming)
- `POST /api/v1/ai/code/review` - Code review
- `POST /api/v1/ai/code/hint` - Get hint
- `GET /api/v1/ai/recommendations` - Get recommendations

### Users
- `GET /api/v1/users/me` - Get profile
- `PUT /api/v1/users/me` - Update profile
- `GET /api/v1/users/me/progress` - Get progress

### Assessments
- `GET /api/v1/assessments/:id` - Get assessment
- `POST /api/v1/assessments/:id/start` - Start assessment
- `POST /api/v1/assessments/:id/submit` - Submit assessment
- `GET /api/v1/assessments/me/results` - Get results

### Submissions
- `POST /api/v1/submissions` - Create submission
- `GET /api/v1/submissions/:id` - Get submission
- `GET /api/v1/submissions/me` - Get user submissions

### Certificates
- `GET /api/v1/certificates/me` - Get user certificates
- `GET /api/v1/certificates/:id/verify` - Verify certificate

## Architecture

```
src/
├── ai/                    # AI orchestration layer
│   ├── orchestrator.ts    # Main AI orchestrator
│   ├── providers/         # AI provider implementations
│   │   ├── openai.ts
│   │   └── anthropic.ts
│   └── types.ts           # AI type definitions
├── db/                    # Database
│   └── schema.ts          # Drizzle schema
├── lib/                   # Shared utilities
│   ├── config.ts
│   └── logger.ts
├── plugins/               # Fastify plugins
│   ├── auth.ts
│   ├── db.ts
│   ├── redis.ts
│   └── ai.ts
├── routes/                # API routes
│   ├── index.ts
│   ├── courses.ts
│   ├── enrollments.ts
│   ├── ai.ts
│   ├── users.ts
│   ├── assessments.ts
│   ├── submissions.ts
│   └── certificates.ts
└── index.ts               # Entry point
```
