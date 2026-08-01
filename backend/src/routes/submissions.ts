import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { submissions } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const submissionParamSchema = z.object({
  id: z.string().uuid(),
});

const createSubmissionSchema = z.object({
  lessonId: z.string().uuid(),
  type: z.enum(['code', 'assignment', 'project']),
  content: z.string().min(1),
  language: z.string().optional(),
});

export async function submissionRoutes(app: FastifyInstance) {
  // Create submission
  app.post('/', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const body = createSubmissionSchema.parse(request.body);
    
    const [submission] = await app.db.insert(submissions).values({
      userId,
      lessonId: body.lessonId,
      type: body.type,
      content: body.content,
      language: body.language,
    }).returning();
    
    // TODO: Queue for AI review
    // await app.ai.reviewCode({ code: body.content, language: body.language });
    
    return reply.status(201).send({ submission });
  });

  // Get submission by ID
  app.get('/:id', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const { id } = submissionParamSchema.parse(request.params);
    
    const [submission] = await app.db.select().from(submissions)
      .where(and(
        eq(submissions.id, id),
        eq(submissions.userId, userId)
      ))
      .limit(1);
    
    if (!submission) {
      return reply.status(404).send({ error: true, message: 'Submission not found' });
    }
    
    return reply.send({ submission });
  });

  // Get user's submissions
  app.get('/me', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const userSubmissions = await app.db.select().from(submissions)
      .where(eq(submissions.userId, userId));
    
    return reply.send({ submissions: userSubmissions });
  });
}
