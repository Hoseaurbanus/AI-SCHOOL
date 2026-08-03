import "dotenv/config"
import { execSync } from "child_process"
import { createApp } from "./app.js"
import { logger } from "./lib/logger.js"
import { config } from "./lib/config.js"

async function migrate() {
  try {
    logger.info("Running database migration...")
    execSync("npx drizzle-kit push --force", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: config.databaseUrl },
    })
    logger.info("✅ Database migration complete")
  } catch (error) {
    logger.warn("Migration warning (tables may already exist): " + (error as Error).message)
  }
}

async function start() {
  try {
    await migrate()

    const app = await createApp()

    await app.listen({
      port: config.port,
      host: config.host,
    })

    logger.info(
      `🚀 Smugflex AI Academy API running on http://${config.host}:${config.port}`,
    )
    logger.info(`📚 Environment: ${config.nodeEnv}`)
    logger.info(`🔗 Frontend URL: ${config.corsOrigin}`)
  } catch (err) {
    logger.error(err, "Failed to start server")
    process.exit(1)
  }
}

start()
