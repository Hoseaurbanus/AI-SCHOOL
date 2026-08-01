import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { courses, modules, lessons } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Query schema
const courseQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});

const courseIdParamSchema = z.object({
  id: z.string().uuid(),
});

export async function courseRoutes(app: FastifyInstance) {
  // List courses
  app.get('/', async (request, reply) => {
    const query = courseQuerySchema.parse(request.query);
    
    const result = await app.db.select().from(courses)
      .where(query.status ? eq(courses.status, query.status) : undefined)
      .orderBy(desc(courses.createdAt))
      .limit(query.limit)
      .offset(query.offset);
    
    return reply.send({ courses: result });
  });

  // Get course by ID
  app.get('/:id', async (request, reply) => {
    const { id } = courseIdParamSchema.parse(request.params);
    
    const [course] = await app.db.select().from(courses)
      .where(eq(courses.id, id))
      .limit(1);
    
    if (!course) {
      return reply.status(404).send({ error: true, message: 'Course not found' });
    }
    
    // Get modules
    const courseModules = await app.db.select().from(modules)
      .where(eq(modules.courseId, id))
      .orderBy(modules.sortOrder);
    
    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      courseModules.map(async (module) => {
        const moduleLessons = await app.db.select().from(lessons)
          .where(eq(lessons.moduleId, module.id))
          .orderBy(lessons.sortOrder);
        
        return {
          ...module,
          lessons: moduleLessons,
        };
      })
    );
    
    return reply.send({ 
      course: {
        ...course,
        modules: modulesWithLessons,
      }
    });
  });

  // Create course
  app.post('/', async (request, reply) => {
    const body = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      price: z.number().min(0).optional(),
      currency: z.string().default('USD'),
    }).parse(request.body);
    
    const [course] = await app.db.insert(courses).values({
      title: body.title,
      description: body.description,
      price: body.price,
      currency: body.currency,
      instructorId: request.userId,
    }).returning();
    
    return reply.status(201).send({ course });
  });

  // Update course
  app.put('/:id', async (request, reply) => {
    const { id } = courseIdParamSchema.parse(request.params);
    const body = z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.number().min(0).optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
    }).parse(request.body);
    
    const [course] = await app.db.update(courses)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    
    if (!course) {
      return reply.status(404).send({ error: true, message: 'Course not found' });
    }
    
    return reply.send({ course });
  });

  // Delete course
  app.delete('/:id', async (request, reply) => {
    const { id } = courseIdParamSchema.parse(request.params);
    
    const [course] = await app.db.delete(courses)
      .where(eq(courses.id, id))
      .returning();
    
    if (!course) {
      return reply.status(404).send({ error: true, message: 'Course not found' });
    }
    
    return reply.status(204).send();
  });
}
