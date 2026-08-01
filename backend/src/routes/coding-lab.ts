import { FastifyInstance } from "fastify"
import { z } from "zod"

// Code execution schema
const executeSchema = z.object({
  code: z.string().min(1),
  language: z.enum(["html", "css", "javascript", "python", "sql"]),
  context: z
    .object({
      html: z.string().optional(),
      css: z.string().optional(),
    })
    .optional(),
})

// Save snippet schema
const saveSnippetSchema = z.object({
  title: z.string().min(1),
  code: z.string().min(1),
  language: z.enum(["html", "css", "javascript", "python", "sql"]),
  isPublic: z.boolean().default(false),
})

// In-memory snippet store (in production: use database)
const snippets = new Map<string, any>()

type WebContext = {
  html?: string
  css?: string
}

// Execute HTML/CSS/JS
function executeWebCode(code: string, language: string, context?: WebContext) {
  if (language === "html") {
    return {
      output: code,
      type: "html",
    }
  }

  if (language === "css") {
    const html = context?.html || "<div class='styled'>Hello World</div>"
    return {
      output: `<html><head><style>${code}</style></head><body>${html}</body></html>`,
      type: "html",
    }
  }

  if (language === "javascript") {
    // Capture console.log output
    const logs: string[] = []
    const mockConsole = {
      log: (...args: any[]) => logs.push(args.map(String).join(" ")),
      error: (...args: any[]) =>
        logs.push(`ERROR: ${args.map(String).join(" ")}`),
      warn: (...args: any[]) =>
        logs.push(`WARN: ${args.map(String).join(" ")}`),
    }

    try {
      // Create a sandboxed function
      const fn = new Function("console", code)
      fn(mockConsole)
      return {
        output: logs.join("\n") || "Code executed successfully (no output)",
        type: "text",
        logs,
      }
    } catch (error) {
      return {
        output: "",
        error: (error as Error).message,
        type: "error",
        logs,
      }
    }
  }

  return { output: "Unsupported language", type: "error" }
}

export async function codingLabRoutes(app: FastifyInstance) {
  // Execute code
  app.post("/execute", async (request, reply) => {
    const body = executeSchema.parse(request.body)

    try {
      if (body.language === "python") {
        // Python execution requires Pyodide (browser-side)
        // Return instructions for frontend to execute
        return reply.send({
          data: {
            requiresClientExecution: true,
            language: "python",
            code: body.code,
            message: "Python code must be executed client-side using Pyodide",
          },
        })
      }

      if (body.language === "sql") {
        // SQL execution requires a database connection
        // Return instructions for frontend to execute
        return reply.send({
          data: {
            requiresClientExecution: true,
            language: "sql",
            code: body.code,
            message: "SQL code must be executed client-side using sql.js",
          },
        })
      }

      const result = executeWebCode(body.code, body.language, body.context)

      return reply.send({ data: result })
    } catch (error) {
      return reply.status(400).send({
        error: true,
        message: (error as Error).message,
      })
    }
  })

  // Get code execution template
  app.get("/template/:language", async (request, reply) => {
    const { language } = z
      .object({
        language: z.enum(["html", "css", "javascript", "python", "sql"]),
      })
      .parse(request.params)

    const templates: Record<string, string> = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start coding here...</p>
</body>
</html>`,
      css: `/* Style your elements */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}

.styled {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`,
      javascript: `// JavaScript code
console.log("Hello, World!");

// Try adding more console.log statements
// or write a function below
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Student"));`,
      python: `# Python code
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# Try writing a function below
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]
print(f"Squared: {squared}")`,
      sql: `-- SQL query
SELECT * FROM users
WHERE age > 18
ORDER BY name;`,
    }

    return reply.send({ data: { language, template: templates[language] } })
  })

  // Save code snippet
  app.post("/snippets", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = saveSnippetSchema.parse(request.body)

    const snippet = {
      id: `snippet_${Date.now()}`,
      userId,
      ...body,
      createdAt: new Date().toISOString(),
    }

    snippets.set(snippet.id, snippet)

    return reply.status(201).send({ data: snippet })
  })

  // Get user's snippets
  app.get("/snippets", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const userSnippets = Array.from(snippets.values()).filter(
      (s: any) => s.userId === userId,
    )

    return reply.send({ data: userSnippets })
  })

  // Get snippet by ID
  app.get("/snippets/:id", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params)

    const snippet = snippets.get(id)

    if (!snippet) {
      return reply
        .status(404)
        .send({ error: true, message: "Snippet not found" })
    }

    return reply.send({ data: snippet })
  })

  // Delete snippet
  app.delete("/snippets/:id", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = z.object({ id: z.string() }).parse(request.params)

    const snippet = snippets.get(id)

    if (!snippet || snippet.userId !== userId) {
      return reply
        .status(404)
        .send({ error: true, message: "Snippet not found" })
    }

    snippets.delete(id)

    return reply.status(204).send()
  })

  // Get supported languages
  app.get("/languages", async (_request, reply) => {
    const languages = [
      {
        id: "html",
        name: "HTML",
        executionMode: "server",
        description: "HyperText Markup Language",
      },
      {
        id: "css",
        name: "CSS",
        executionMode: "server",
        description: "Cascading Style Sheets",
      },
      {
        id: "javascript",
        name: "JavaScript",
        executionMode: "server",
        description: "JavaScript (ES6+)",
      },
      {
        id: "python",
        name: "Python",
        executionMode: "client",
        description: "Python 3.x (via Pyodide)",
      },
      {
        id: "sql",
        name: "SQL",
        executionMode: "client",
        description: "SQL queries (via sql.js)",
      },
    ]

    return reply.send({ data: languages })
  })
}
