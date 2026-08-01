import { FastifyInstance, FastifyRequest } from "fastify"
import { z } from "zod"
import Stripe from "stripe"
import { courses, enrollments } from "../db/schema.js"
import { eq, and } from "drizzle-orm"
import { config } from "../lib/config.js"

const stripe = new Stripe(config.stripeSecretKey)

const checkoutSchema = z.object({
  courseId: z.string().uuid(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
})

export async function paymentRoutes(app: FastifyInstance) {
  // Create checkout session
  app.post("/checkout", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = checkoutSchema.parse(request.body)

    // Get course
    const [course] = await app.db
      .select()
      .from(courses)
      .where(eq(courses.id, body.courseId))
      .limit(1)

    if (!course) {
      return reply
        .status(404)
        .send({ error: true, message: "Course not found" })
    }

    if (!course.price || course.price <= 0) {
      return reply.status(400).send({ error: true, message: "Course is free" })
    }

    // Check if already enrolled
    const [existingEnrollment] = await app.db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, body.courseId),
        ),
      )
      .limit(1)

    if (existingEnrollment) {
      return reply
        .status(409)
        .send({ error: true, message: "Already enrolled in this course" })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: request.headers["x-user-email"] as string,
      line_items: [
        {
          price_data: {
            currency: course.currency || "usd",
            product_data: {
              name: course.title,
              description: course.description || undefined,
            },
            unit_amount: course.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl,
      metadata: {
        userId,
        courseId: body.courseId,
      },
    })

    return reply.send({
      data: {
        sessionId: session.id,
        url: session.url,
      },
    })
  })

  // Stripe webhook
  app.post("/webhook", async (request: FastifyRequest, reply) => {
    const sig = request.headers["stripe-signature"] as string

    if (!sig) {
      return reply
        .status(400)
        .send({ error: true, message: "Missing signature" })
    }

    let event: Stripe.Event

    try {
      const rawBody = (request as any).rawBody as string
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        config.stripeWebhookSecret,
      )
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return reply
        .status(400)
        .send({ error: true, message: "Invalid signature" })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const { userId, courseId } = session.metadata || {}

      if (userId && courseId) {
        // Create enrollment
        const [existingEnrollment] = await app.db
          .select()
          .from(enrollments)
          .where(
            and(
              eq(enrollments.userId, userId),
              eq(enrollments.courseId, courseId),
            ),
          )
          .limit(1)

        if (!existingEnrollment) {
          await app.db.insert(enrollments).values({
            userId,
            courseId,
          })
        }
      }
    }

    return reply.send({ received: true })
  })

  // Get payment status
  app.get("/status/:sessionId", async (request, reply) => {
    const { sessionId } = z
      .object({ sessionId: z.string() })
      .parse(request.params)

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      return reply.send({
        data: {
          status: session.payment_status,
          amount: session.amount_total,
          currency: session.currency,
        },
      })
    } catch {
      return reply
        .status(404)
        .send({ error: true, message: "Session not found" })
    }
  })
}
