import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core"

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "student",
  "instructor",
  "admin",
])
export const courseStatusEnum = pgEnum("course_status", [
  "draft",
  "published",
  "archived",
])
export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "dropped",
])
export const lessonProgressStatusEnum = pgEnum("lesson_progress_status", [
  "not_started",
  "in_progress",
  "completed",
])
export const submissionTypeEnum = pgEnum("submission_type", [
  "code",
  "assignment",
  "project",
])
export const submissionStatusEnum = pgEnum("submission_status", [
  "submitted",
  "graded",
  "returned",
])
export const conversationAgentEnum = pgEnum("conversation_agent", [
  "tutor",
  "mentor",
  "coder",
  "assessor",
  "coach",
])
export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
])
export const memoryCategoryEnum = pgEnum("memory_category", [
  "session",
  "lesson",
  "course",
  "profile",
  "history",
])
export const contentTypeEnum = pgEnum("content_type", [
  "lesson",
  "exercise",
  "project",
])

// Tenants (for future multi-tenancy)
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
})

// Users (extends Clerk user)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").default("student"),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Courses
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  instructorId: uuid("instructor_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price"), // cents
  currency: text("currency").default("USD"),
  status: courseStatusEnum("status").default("draft"),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Modules
export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Lessons
export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id").references(() => modules.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  content: text("content"), // markdown
  contentType: contentTypeEnum("content_type").default("lesson"),
  sortOrder: integer("sort_order"),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
})

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  status: enrollmentStatusEnum("status").default("active"),
  progress: jsonb("progress").default({}),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
})

// Lesson Progress
export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  lessonId: uuid("lesson_id").references(() => lessons.id),
  status: lessonProgressStatusEnum("status").default("not_started"),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
})

// Assessments
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  moduleId: uuid("module_id").references(() => modules.id),
  title: text("title").notNull(),
  description: text("description"),
  timeLimit: integer("time_limit"), // minutes
  passingScore: integer("passing_score"),
  questions: jsonb("questions"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Assessment Results
export const assessmentResults = pgTable("assessment_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentId: uuid("assessment_id").references(() => assessments.id),
  userId: uuid("user_id").references(() => users.id),
  answers: jsonb("answers"),
  score: integer("score"),
  passed: boolean("passed"),
  timeTaken: integer("time_taken"),
  aiConfidence: decimal("ai_confidence"),
  humanReviewed: boolean("human_reviewed").default(false),
  completedAt: timestamp("completed_at").defaultNow(),
})

// Submissions
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  lessonId: uuid("lesson_id").references(() => lessons.id),
  type: submissionTypeEnum("type"),
  content: text("content"),
  language: text("language"),
  status: submissionStatusEnum("status").default("submitted"),
  score: integer("score"),
  feedback: text("feedback"),
  aiConfidence: decimal("ai_confidence"),
  humanReviewed: boolean("human_reviewed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// Certificates
export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  issuedAt: timestamp("issued_at").defaultNow(),
  hash: text("hash").unique().notNull(),
  verificationUrl: text("verification_url"),
})

// Conversations
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  courseId: uuid("course_id").references(() => courses.id),
  lessonId: uuid("lesson_id").references(() => lessons.id),
  agentType: conversationAgentEnum("agent_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => conversations.id, {
    onDelete: "cascade",
  }),
  role: messageRoleEnum("role"),
  content: text("content"),
  tokensUsed: integer("tokens_used"),
  model: text("model"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Student Memory
export const studentMemory = pgTable("student_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  category: memoryCategoryEnum("category"),
  key: text("key"),
  value: jsonb("value"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Knowledge Chunks (for RAG)
export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id),
  lessonId: uuid("lesson_id").references(() => lessons.id),
  content: text("content"),
  metadata: jsonb("metadata"),
  embeddingId: text("embedding_id"), // reference to vector DB
  createdAt: timestamp("created_at").defaultNow(),
})

// Prompt Templates
export const promptTemplates = pgTable("prompt_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  version: integer("version").default(1),
  template: text("template").notNull(),
  variables: jsonb("variables"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
})

// Audit Log
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Analytics Events
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  eventType: text("event_type").notNull(),
  properties: jsonb("properties"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan"),
  status: text("status"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
})
