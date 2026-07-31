interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto text-sm">
      <code>{code}</code>
    </pre>
  );
}
