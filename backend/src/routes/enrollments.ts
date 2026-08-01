import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { enrollments, courses } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const enrollSchema = z.object({
  courseId: z.string().uuid(),
});

const enrollmentParamSchema = z.object({
  id: z.string().uuid(),
});

export async function enrollmentRoutes(app: FastifyInstance) {
  // Get user's enrollments
  app.get('/me', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const userEnrollments = await app.db.select({
      id: enrollments.id,
      status: enrollments.status,
      progress: enrollments.progress,
      enrolledAt: enrollments.enrolledAt,
      completedAt: enrollments.completedAt,
      course: {
        id: courses.id,
        title: courses.title,
        description: courses.description,
      },
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId));
    
    return reply.send({ enrollments: userEnrollments });
  });

  // Enroll in a course
  app.post('/', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const body = enrollSchema.parse(request.body);
    
    // Check if course exists
    const [course] = await app.db.select().from(courses)
      .where(eq(courses.id, body.courseId))
      .limit(1);
    
    if (!course) {
      return reply.status(404).send({ error: true, message: 'Course not found' });
    }
    
    // Check if already enrolled
    const [existingEnrollment] = await app.db.select().from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, body.courseId)
      ))
      .limit(1);
    
    if (existingEnrollment) {
      return reply.status(409).send({ error: true, message: 'Already enrolled in this course' });
    }
    
    // Create enrollment
    const [enrollment] = await app.db.insert(enrollments).values({
      userId,
      courseId: body.courseId,
    }).returning();
    
    return reply.status(201).send({ enrollment });
  });

  // Update progress
  app.put('/:id/progress', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const { id } = enrollmentParamSchema.parse(request.params);
    const body = z.object({
      progress: z.record(z.any()),
    }).parse(request.body);
    
    const [enrollment] = await app.db.update(enrollments)
      .set({ progress: body.progress })
      .where(and(
        eq(enrollments.id, id),
        eq(enrollments.userId, userId)
      ))
      .returning();
    
    if (!enrollment) {
      return reply.status(404).send({ error: true, message: 'Enrollment not found' });
    }
    
    return reply.send({ enrollment });
  });
}
