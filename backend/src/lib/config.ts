export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  host: process.env.HOST || "0.0.0.0",
  logLevel: process.env.LOG_LEVEL || "debug",

  // Database
  databaseUrl: process.env.DATABASE_URL!,

  // Redis
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",

  // Clerk
  clerkSecretKey: process.env.CLERK_SECRET_KEY!,
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET!,

  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY!,
  openaiOrgId: process.env.OPENAI_ORG_ID,

  // Anthropic
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,

  // Google
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY,

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,

  // Qdrant
  qdrantUrl: process.env.QDRANT_URL || "http://localhost:6333",
  qdrantApiKey: process.env.QDRANT_API_KEY,

  // Meilisearch
  meilisearchUrl: process.env.MEILISEARCH_URL || "http://localhost:7700",
  meilisearchApiKey: process.env.MEILISEARCH_API_KEY,

  // R2
  r2AccountId: process.env.R2_ACCOUNT_ID!,
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID!,
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  r2BucketName: process.env.R2_BUCKET_NAME || "smugflex-uploads",

  // AI
  aiDefaultModel: process.env.AI_DEFAULT_MODEL || "gpt-4o-mini",
  aiComplexModel: process.env.AI_COMPLEX_MODEL || "gpt-4o",
  aiEmbeddingModel: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-large",
  aiMaxTokens: parseInt(process.env.AI_MAX_TOKENS || "4096", 10),
  aiTemperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),

  // Rate Limiting
  rateLimitMaxRequests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "100",
    10,
  ),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
} as const
