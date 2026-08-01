import "dotenv/config"
import { createApp } from "./app.js"
import { logger } from "./lib/logger.js"
import { config } from "./lib/config.js"

async function start() {
  try {
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
