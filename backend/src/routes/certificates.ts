import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { certificates, courses } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { createHash } from 'crypto';

const certificateParamSchema = z.object({
  id: z.string().uuid(),
});

export async function certificateRoutes(app: FastifyInstance) {
  // Get user's certificates
  app.get('/me', async (request, reply) => {
    const userId = request.userId;
    
    if (!userId) {
      return reply.status(401).send({ error: true, message: 'Unauthorized' });
    }
    
    const userCertificates = await app.db.select({
      id: certificates.id,
      issuedAt: certificates.issuedAt,
      hash: certificates.hash,
      verificationUrl: certificates.verificationUrl,
      course: {
        id: courses.id,
        title: courses.title,
      },
    })
    .from(certificates)
    .innerJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.userId, userId));
    
    return reply.send({ certificates: userCertificates });
  });

  // Verify certificate
  app.get('/:id/verify', async (request, reply) => {
    const { id } = certificateParamSchema.parse(request.params);
    
    const [certificate] = await app.db.select({
      id: certificates.id,
      issuedAt: certificates.issuedAt,
      hash: certificates.hash,
      course: {
        id: courses.id,
        title: courses.title,
      },
    })
    .from(certificates)
    .innerJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.id, id))
    .limit(1);
    
    if (!certificate) {
      return reply.status(404).send({ 
        valid: false, 
        message: 'Certificate not found' 
      });
    }
    
    // Verify hash
    const expectedHash = createHash('sha256')
      .update(`${certificate.id}-${certificate.issuedAt}`)
      .digest('hex');
    
    const isValid = certificate.hash === expectedHash;
    
    return reply.send({ 
      valid: isValid,
      certificate: isValid ? certificate : null,
    });
  });
}
