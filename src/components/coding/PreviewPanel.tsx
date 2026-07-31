import type { CodeLanguage } from '../../types';

interface PreviewPanelProps {
  code: string;
  language: CodeLanguage;
  markdownOutput?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}

export default function PreviewPanel({ code, language, markdownOutput, iframeRef }: PreviewPanelProps) {
  if (language === 'markdown') {
    return (
      <div
        className="h-full overflow-y-auto p-6 prose prose-invert max-w-none"
        style={{ background: '#FFFFFF', color: '#1a1a1a' }}
        dangerouslySetInnerHTML={{ __html: markdownOutput || '' }}
      />
    );
  }

  if (language === 'html') {
    return (
      <iframe
        ref={iframeRef}
        srcDoc={code}
        className="w-full h-full border-0"
        style={{ background: '#FFFFFF' }}
        title="Preview"
      />
    );
  }

  return (
    <div className="h-full flex items-center justify-center" style={{ background: '#060A12' }}>
      <p className="text-sm" style={{ color: '#64748B' }}>
        Run your code to see output in the terminal
      </p>
    </div>
  );
}