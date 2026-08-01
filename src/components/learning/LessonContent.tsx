import type { LessonContent as LessonContentType } from "../../types"
import CodeBlock from "../ai/CodeBlock"

interface LessonContentProps {
  content: LessonContentType[]
}

export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="text-xl font-bold font-display"
                style={{ color: "#F1F5F9" }}
              >
                {block.content}
              </h2>
            )
          case "text":
            return (
              <p
                key={index}
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "#94A3B8" }}
              >
                {block.content}
              </p>
            )
          case "code":
            return (
              <div
                key={index}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(59,130,246,0.15)" }}
              >
                <CodeBlock
                  code={block.content}
                  language={block.language || "python"}
                />
              </div>
            )
          case "image":
            return (
              <figure key={index}>
                <img
                  src={block.content}
                  alt={block.caption || ""}
                  className="w-full rounded-xl"
                  style={{ border: "1px solid rgba(59,130,246,0.1)" }}
                />
                {block.caption && (
                  <figcaption
                    className="text-xs mt-2 text-center"
                    style={{ color: "#64748B" }}
                  >
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
