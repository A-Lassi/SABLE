import { useState } from 'react';
import { Button } from '../common/Button';

interface ResumeEditorProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export function ResumeEditor({ initialText, onSave, onCancel }: ResumeEditorProps) {
  const [text, setText] = useState(initialText);

  return (
    <div className="p-4 flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none h-64 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSave(text)}>
          Save
        </Button>
      </div>
    </div>
  );
}
