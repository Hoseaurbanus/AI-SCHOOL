import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { FastifyInstance } from "fastify"
import { config } from "../lib/config.js"
import { logger } from "../lib/logger.js"
import * as schema from "../db/schema.js"

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle<typeof schema>>
  }
}

export async function dbPlugin(app: FastifyInstance) {
  try {
    const client = postgres(config.databaseUrl, {
      max: 20,
      idle_timeout: 20,
      connect_timeout: 10,
    })

    const db = drizzle(client, { schema })

    app.decorate("db", db)

    logger.info("✅ Database connected")

    app.addHook("onClose", async () => {
      await client.end()
      logger.info("Database connection closed")
    })
  } catch (error) {
    logger.error(error, "❌ Database connection failed")
    throw error
  }
}
