import Redis from 'ioredis';
import { FastifyInstance } from 'fastify';
import { config } from '../lib/config.js';
import { logger } from '../lib/logger.js';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

export async function redisPlugin(app: FastifyInstance) {
  try {
    const redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
    
    redis.on('error', (error) => {
      logger.error(error, 'Redis error');
    });
    
    redis.on('connect', () => {
      logger.info('✅ Redis connected');
    });
    
    app.decorate('redis', redis);
    
    app.addHook('onClose', async () => {
      await redis.quit();
      logger.info('Redis connection closed');
    });
  } catch (error) {
    logger.error(error, '❌ Redis connection failed');
    throw error;
  }
}
