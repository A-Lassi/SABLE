import { useRef } from 'react';
import { useStore } from '../../store';
import { validateResumeFile } from '../../utils/validators';
import { extractResume, uploadResume } from '../../services/resumeService';
import { Upload, FileCheck, User } from 'lucide-react';
import { Button } from '../common/Button';

export function ProfileSection() {
  const { user, setMasterResume, setApplyMode, addToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateResumeFile(file);
    if (error) {
      addToast(error, 'error');
      return;
    }

    addToast('Parsing resume...', 'info');

    try {
      const [url, result] = await Promise.all([
        uploadResume(user.uid, file),
        extractResume(file),
      ]);

      if (result.success) {
        setMasterResume(url, result.text);
        addToast(
          `Resume parsed! Found: ${result.detectedSections.join(', ')}`,
          'success'
        );
      }
    } catch {
      addToast('Failed to parse resume. Please try again.', 'error');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{user.displayName}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Master Resume</h4>
        {user.masterResumeText ? (
          <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
            <FileCheck className="w-4 h-4" />
            <span>Resume uploaded</span>
          </div>
        ) : (
          <p className="text-sm text-slate-500 mb-2">No resume uploaded yet.</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.doc,.rtf,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-1.5" />
          {user.masterResumeText ? 'Re-upload Resume' : 'Upload Resume'}
        </Button>
      </div>

      <div className="border border-slate-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-1">Apply Mode</h4>
        <p className="text-xs text-slate-500 mb-3">
          {user.applyMode === 'automatic'
            ? 'Right-swipe tailors your resume and submits immediately.'
            : 'Right-swipe tailors your resume; you review and approve before submitting.'}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setApplyMode('automatic')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
              user.applyMode === 'automatic'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Automatic
          </button>
          <button
            onClick={() => setApplyMode('control')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
              user.applyMode === 'control'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            Control
          </button>
        </div>
      </div>
    </div>
  );
}
