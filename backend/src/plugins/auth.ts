import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { config } from '../lib/config.js';
import { logger } from '../lib/logger.js';

// Clerk client (using fetch API directly)
const clerkSecretKey = config.clerkSecretKey;

declare module 'fastify' {
  interface FastifyInstance {
    clerk: {
      verifyToken: (token: string) => Promise<{ sub: string; sid?: string }>;
    };
  }
  
  interface FastifyRequest {
    userId?: string;
    sessionId?: string;
  }
}

// Authentication decorator
export async function authPlugin(app: FastifyInstance) {
  // Initialize Clerk client
  app.decorate('clerk', {
    verifyToken: async (token: string): Promise<{ sub: string; sid?: string }> => {
      const response = await fetch('https://api.clerk.com/v1/tokens/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clerkSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      const data = await response.json() as { sub: string; sid?: string };
      return data;
    },
  });
  
  // Pre-handler for authenticated routes
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ 
          error: true, 
          message: 'Missing or invalid authorization header' 
        });
      }
      
      const token = authHeader.substring(7);
      
      // Verify the JWT token with Clerk
      const verified = await app.clerk.verifyToken(token);
      
      request.userId = verified.sub;
      request.sessionId = verified.sid;
      
    } catch (error) {
      logger.error(error, 'Authentication failed');
      return reply.status(401).send({ 
        error: true, 
        message: 'Invalid or expired token' 
      });
    }
  });
  
  // Optional authentication (doesn't fail if no token)
  app.decorate('authenticateOptional', async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const verified = await app.clerk.verifyToken(token);
        request.userId = verified.sub;
        request.sessionId = verified.sid;
      }
    } catch {
      // Optional auth - don't fail
    }
  });
  
  logger.info('✅ Auth plugin registered');
}

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    clerk: {
      verifyToken: (token: string) => Promise<{ sub: string; sid?: string }>;
    };
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authenticateOptional: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
