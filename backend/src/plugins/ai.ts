import { FastifyInstance } from 'fastify';
import { AIOrchestrator } from '../ai/orchestrator.js';
import { config } from '../lib/config.js';
import { logger } from '../lib/logger.js';

declare module 'fastify' {
  interface FastifyInstance {
    ai: AIOrchestrator;
  }
}

export async function aiPlugin(app: FastifyInstance) {
  try {
    const ai = new AIOrchestrator({
      openaiApiKey: config.openaiApiKey,
      anthropicApiKey: config.anthropicApiKey,
      googleApiKey: config.googleAiApiKey,
      defaultModel: config.aiDefaultModel,
      complexModel: config.aiComplexModel,
      embeddingModel: config.aiEmbeddingModel,
      maxTokens: config.aiMaxTokens,
      temperature: config.aiTemperature,
    });
    
    app.decorate('ai', ai);
    
    logger.info('✅ AI orchestrator initialized');
    logger.info(`   Default model: ${config.aiDefaultModel}`);
    logger.info(`   Complex model: ${config.aiComplexModel}`);
  } catch (error) {
    logger.error(error, '❌ AI orchestrator initialization failed');
    throw error;
  }
}
