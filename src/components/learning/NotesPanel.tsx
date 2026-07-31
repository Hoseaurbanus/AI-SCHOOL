import { useState, useEffect, useCallback } from 'react';

const NOTES_STORAGE_KEY = 'smugflex_notes';

interface NotesPanelProps {
  lessonId: string;
  userId: string;
}

function getStoredNotes(): Record<string, string> {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, string>) {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export default function NotesPanel({ lessonId, userId }: NotesPanelProps) {
  const noteKey = `${userId}_${lessonId}`;
  const [content, setContent] = useState(() => {
    const notes = getStoredNotes();
    return notes[noteKey] || '';
  });
  const [saved, setSaved] = useState(false);

  const saveNote = useCallback(() => {
    const notes = getStoredNotes();
    notes[noteKey] = content;
    saveNotes(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [noteKey, content]);

  useEffect(() => {
    const timer = setTimeout(saveNote, 500);
    return () => clearTimeout(timer);
  }, [content, saveNote]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: '#475569' }}>MY NOTES</p>
        {saved && (
          <p className="text-xs" style={{ color: '#10B981' }}>Saved</p>
        )}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes about this lesson..."
        className="w-full h-64 px-4 py-3 rounded-xl text-sm outline-none resize-none"
        style={{
          background: '#060A12',
          color: '#F1F5F9',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      />
      <p className="text-xs" style={{ color: '#475569' }}>
        {content.length} characters · Notes are auto-saved
      </p>
    </div>
  );
}