import { useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { ResumeEditor } from './ResumeEditor';
import { Button } from '../common/Button';
import { APPLICATION_STATUS_CONFIG } from '../../utils/constants';
import { formatSalary, formatLocation, formatDate } from '../../utils/formatters';
import { exportAsPDF, exportAsDOCX } from '../../services/exportService';
import { useStore } from '../../store';
import type { ApplicationStatus } from '../../types';
import {
  ArrowLeft,
  FileText,
  FileDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '../../lib/cn';

const ALL_STATUSES: ApplicationStatus[] = [
  'tailoring',
  'pending_review',
  'ready',
  'submitted',
  'interviewing',
  'offered',
  'rejected',
  'withdrawn',
];

export function ApplicationDetail() {
  const {
    selectedApplication: app,
    selectApplication,
    updateStatus,
    updateNotes,
    updateResume,
    approveResume,
  } = useApplications();

  const addToast = useStore((s) => s.addToast);
  const [isEditing, setIsEditing] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [notes, setNotes] = useState(app?.notes ?? '');

  if (!app) return null;

  const statusConfig = APPLICATION_STATUS_CONFIG[app.status];
  const snap = app.jobSnapshot;

  const handleApproveAndSubmit = () => {
    approveResume(app.id);
    updateStatus(app.id, 'submitted');
    addToast('Resume approved & application submitted!', 'success');
    window.open(`https://example.com/apply/${app.jobId}`, '_blank');
  };

  const handleSaveResume = (text: string) => {
    updateResume(app.id, text);
    setIsEditing(false);
    addToast('Resume saved', 'success');
  };

  const handleNotesBlur = () => {
    if (notes !== app.notes) {
      updateNotes(app.id, notes);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-4 py-3 z-10">
        <button
          onClick={() => selectApplication(null)}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-5">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">{snap.title}</h2>
          <p className="text-slate-600">
            {snap.company} — {formatLocation(snap.location.city, snap.location.state, snap.location.isRemote)}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm text-slate-500">Status:</span>
            <select
              value={app.status}
              onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
              className={cn(
                'text-sm font-medium px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
                statusConfig.textColor
              )}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {APPLICATION_STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resume */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Tailored Resume</span>
            </div>
            {app.resumeDraft.version > 0 && (
              <span className="text-xs text-slate-400">v{app.resumeDraft.version}</span>
            )}
          </div>

          {isEditing ? (
            <ResumeEditor
              initialText={app.resumeDraft.text}
              onSave={handleSaveResume}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="p-4">
              {app.resumeDraft.text ? (
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {app.resumeDraft.text}
                </pre>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  {app.status === 'tailoring'
                    ? 'Resume is being tailored...'
                    : 'No resume draft available.'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {app.status === 'pending_review' && !isEditing && (
          <div className="flex gap-3">
            <Button onClick={handleApproveAndSubmit} className="flex-1">
              Approve & Submit
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        )}

        {app.status === 'ready' && (
          <Button
            onClick={() => {
              updateStatus(app.id, 'submitted');
              addToast('Application submitted!', 'success');
              window.open(`https://example.com/apply/${app.jobId}`, '_blank');
            }}
            className="w-full"
          >
            Submit Application
          </Button>
        )}

        {/* Export */}
        {app.resumeDraft.text && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Export</h4>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportAsPDF(app.resumeDraft.text, `resume-${snap.company}`)}
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => exportAsDOCX(app.resumeDraft.text, `resume-${snap.company}`)}
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                DOCX
              </Button>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add private notes..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Details collapsible */}
        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={() => setShowJobDetails(!showJobDetails)}
            className="flex items-center justify-between w-full text-sm font-semibold text-slate-700"
          >
            Job Details
            {showJobDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showJobDetails && (
            <div className="mt-3 text-sm text-slate-600">
              <p>
                <strong>Salary:</strong>{' '}
                {formatSalary(snap.salary.min, snap.salary.max, snap.salary.currency, snap.salary.period)}
              </p>
              <p>
                <strong>Type:</strong> {snap.type}
              </p>
              <p>
                <strong>Level:</strong> {snap.level}
              </p>
              <p className="mt-2">
                <strong>Applied:</strong> {formatDate(app.createdAt)}
              </p>
              {app.submittedAt && (
                <p>
                  <strong>Submitted:</strong> {formatDate(app.submittedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
