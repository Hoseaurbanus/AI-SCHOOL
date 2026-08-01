import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  settings: z.record(z.any()).optional(),
});

export async function userRoutes(app: FastifyInstance) {
  // Get current user profile
  app.get('/me', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const [user] = await app.db.select().from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!user) {
      return reply.status(404).send({ error: true, message: 'User not found' });
    }
    
    return reply.send({ user });
  });

  // Update profile
  app.put('/me', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const body = updateProfileSchema.parse(request.body);
    
    const [user] = await app.db.update(users)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) {
      return reply.status(404).send({ error: true, message: 'User not found' });
    }
    
    return reply.send({ user });
  });

  // Get user progress (aggregated stats)
  app.get('/me/progress', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    // TODO: Implement proper progress aggregation
    const progress = {
      totalCourses: 0,
      completedCourses: 0,
      totalHours: 0,
      currentStreak: 0,
      lessonsCompleted: 0,
      avgScore: 0,
    };
    
    return reply.send({ progress });
  });
}
