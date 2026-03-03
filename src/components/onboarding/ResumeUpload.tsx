import { useRef, useState } from 'react';
import { Upload, FileCheck, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { validateResumeFile } from '../../utils/validators';
import { extractResume, uploadResume } from '../../services/resumeService';
import { useStore } from '../../store';
import { cn } from '../../lib/cn';

interface ResumeUploadProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function ResumeUpload({ onComplete, onSkip }: ResumeUploadProps) {
  const { user, setMasterResume, addToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [detectedSections, setDetectedSections] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState(false);

  const handleFile = async (file: File) => {
    const error = validateResumeFile(file);
    if (error) {
      addToast(error, 'error');
      return;
    }

    setIsUploading(true);
    try {
      const [url, result] = await Promise.all([
        uploadResume(user!.uid, file),
        extractResume(file),
      ]);

      if (result.success) {
        setMasterResume(url, result.text);
        setDetectedSections(result.detectedSections);
        setUploaded(true);
        addToast('Resume parsed successfully!', 'success');
      }
    } catch {
      addToast('Failed to parse resume.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Upload Your Resume</h2>
        <p className="text-sm text-slate-500 mt-1">
          We'll use this to tailor your applications to each job.
        </p>
      </div>

      {uploaded ? (
        <div className="w-full max-w-xs flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-medium text-slate-900">Resume parsed!</p>
            <p className="text-sm text-slate-500 mt-1">
              We found sections for: {detectedSections.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
            </p>
          </div>
          <Button onClick={onComplete} className="w-full" size="lg">
            Continue
          </Button>
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'w-full max-w-xs border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors',
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            )}
          >
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-slate-400" />
            )}
            <p className="text-sm text-slate-500 text-center">
              {isUploading ? 'Parsing resume...' : 'Drag & drop or tap to upload'}
            </p>
            <p className="text-xs text-slate-400">.docx, .doc, .rtf, .pdf (max 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.doc,.rtf,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="hidden"
          />
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Skip for now
            </button>
          )}
        </>
      )}
    </div>
  );
}
