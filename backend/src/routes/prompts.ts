import { FastifyInstance } from "fastify"
import { z } from "zod"
import { promptTemplates } from "../db/schema.js"
import { eq, and } from "drizzle-orm"

const templateSchema = z.object({
  name: z.string().min(1),
  template: z.string().min(1),
  variables: z.array(z.string()).optional(),
})

const updateTemplateSchema = z.object({
  template: z.string().min(1).optional(),
  variables: z.array(z.string()).optional(),
  active: z.boolean().optional(),
})

// Template engine
class TemplateEngine {
  private app: FastifyInstance

  constructor(app: FastifyInstance) {
    this.app = app
  }

  // Render template with variables
  async render(
    name: string,
    variables: Record<string, string>,
    version?: number,
  ) {
    const conditions = [eq(promptTemplates.name, name)]

    if (version) {
      conditions.push(eq(promptTemplates.version, version))
    } else {
      conditions.push(eq(promptTemplates.active, true))
    }

    const [template] = await this.app.db
      .select()
      .from(promptTemplates)
      .where(and(...conditions))
      .limit(1)

    if (!template) {
      throw new Error(`Template '${name}' not found`)
    }

    let rendered = template.template

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value)
    }

    return {
      rendered,
      templateId: template.id,
      version: template.version,
    }
  }

  // List templates
  async list(activeOnly: boolean = false) {
    const conditions = activeOnly
      ? [eq(promptTemplates.active, true)]
      : undefined

    return this.app.db
      .select()
      .from(promptTemplates)
      .where(conditions ? and(...conditions) : undefined)
  }

  // Create or update template
  async upsert(name: string, template: string, variables?: string[]) {
    // Check if exists
    const [existing] = await this.app.db
      .select()
      .from(promptTemplates)
      .where(eq(promptTemplates.name, name))
      .limit(1)

    if (existing) {
      // Update
      const [updated] = await this.app.db
        .update(promptTemplates)
        .set({
          template,
          variables: variables || existing.variables,
          version: (existing.version || 1) + 1,
        })
        .where(eq(promptTemplates.id, existing.id))
        .returning()
      return updated
    } else {
      // Create
      const [created] = await this.app.db
        .insert(promptTemplates)
        .values({
          name,
          template,
          variables,
          version: 1,
          active: true,
        })
        .returning()
      return created
    }
  }

  // Deactivate template
  async deactivate(name: string) {
    await this.app.db
      .update(promptTemplates)
      .set({ active: false })
      .where(eq(promptTemplates.name, name))
  }
}

export async function promptRoutes(app: FastifyInstance) {
  const engine = new TemplateEngine(app)

  // List templates (authenticated only)
  app.get("/", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { activeOnly } = z
      .object({ activeOnly: z.coerce.boolean().default(false) })
      .parse(request.query)

    const templates = await engine.list(activeOnly)

    return reply.send({ data: templates })
  })

  // Get template by name
  app.get("/:name", async (request, reply) => {
    const { name } = z.object({ name: z.string() }).parse(request.params)

    const templates = await engine.list()
    const template = templates.find((t) => t.name === name)

    if (!template) {
      return reply
        .status(404)
        .send({ error: true, message: "Template not found" })
    }

    return reply.send({ data: template })
  })

  // Create or update template (admin only)
  app.post("/", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = templateSchema.parse(request.body)

    const template = await engine.upsert(
      body.name,
      body.template,
      body.variables,
    )

    return reply.status(201).send({ data: template })
  })

  // Render template
  app.post("/:name/render", async (request, reply) => {
    const { name } = z.object({ name: z.string() }).parse(request.params)
    const body = z
      .object({
        variables: z.record(z.string()),
        version: z.number().optional(),
      })
      .parse(request.body)

    try {
      const result = await engine.render(name, body.variables, body.version)
      return reply.send({ data: result })
    } catch (error) {
      return reply
        .status(404)
        .send({ error: true, message: (error as Error).message })
    }
  })

  // Deactivate template (admin only)
  app.delete("/:name", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { name } = z.object({ name: z.string() }).parse(request.params)

    await engine.deactivate(name)

    return reply.status(204).send()
  })

  // Seed default templates
  app.post("/seed", async (_request, reply) => {
    const defaults = [
      {
        name: "system-tutor",
        template: `You are an AI tutor for Smugflex AI Academy.
You help students learn programming concepts, debug code, and understand lessons.
Be helpful, encouraging, and educational.
If you provide code examples, format them clearly.
Keep responses concise but thorough.

Student Context:
{{studentContext}}

Course Context:
{{courseContext}}`,
        variables: ["studentContext", "courseContext"],
      },
      {
        name: "system-coder",
        template: `You are an expert coding assistant for Smugflex AI Academy.
Help students write, debug, and understand code.
Provide clear explanations with code examples.
Focus on best practices and learning opportunities.

Student Skill Level:
{{skillLevel}}

Programming Language:
{{language}}`,
        variables: ["skillLevel", "language"],
      },
      {
        name: "system-assessor",
        template: `You are an assessment evaluator for Smugflex AI Academy.
Evaluate student submissions fairly and provide constructive feedback.
Be encouraging while pointing out areas for improvement.
Provide specific suggestions for how to improve.

Assessment Criteria:
{{criteria}}`,
        variables: ["criteria"],
      },
      {
        name: "code-review",
        template: `Review the following code for:
- Correctness and bugs
- Code quality and best practices
- Performance issues
- Security concerns
- Readability and maintainability

Code Language: {{language}}
Context: {{context}}

Code:
\`\`\`{{language}}
{{code}}
\`\`\``,
        variables: ["language", "context", "code"],
      },
      {
        name: "hint-generator",
        template: `Generate a hint for a student struggling with an exercise.
Don't give away the solution directly.
Guide them toward the answer without spoiling it.

Exercise: {{exercise}}
Student Attempt: {{attempt}}
Student Code:
\`\`\`
{{studentCode}}
\`\`\``,
        variables: ["exercise", "attempt", "studentCode"],
      },
    ]

    for (const template of defaults) {
      await engine.upsert(template.name, template.template, template.variables)
    }

    return reply.send({
      data: { message: "Default templates seeded", count: defaults.length },
    })
  })
}
