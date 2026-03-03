import { useStore } from '../../store';
import { ChipInput, MultiChipSelect } from '../settings/FilterSection';
import { JOB_TYPES, JOB_LEVELS } from '../../utils/constants';
import { Button } from '../common/Button';
import type { JobType, JobLevel } from '../../types';

interface PreferenceWizardProps {
  onComplete: () => void;
}

const TYPE_OPTIONS = JOB_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

const LEVEL_OPTIONS = JOB_LEVELS.map((l) => ({
  value: l,
  label: l.charAt(0).toUpperCase() + l.slice(1),
}));

export function PreferenceWizard({ onComplete }: PreferenceWizardProps) {
  const { user, updatePreferences, setApplyMode } = useStore();

  if (!user) return null;
  const prefs = user.preferences;

  return (
    <div className="flex flex-col gap-6 px-6 max-w-sm mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Set Your Preferences</h2>
        <p className="text-sm text-slate-500 mt-1">
          We'll use these to find the best jobs for you.
        </p>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">
          Desired Roles
        </label>
        <ChipInput
          values={prefs.roles}
          onChange={(roles) => updatePreferences({ roles })}
          placeholder="e.g. Frontend Developer"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">
          Preferred Locations
        </label>
        <ChipInput
          values={prefs.locations}
          onChange={(locations) => updatePreferences({ locations })}
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.remoteOnly}
            onChange={(e) => updatePreferences({ remoteOnly: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Remote only</span>
        </label>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Job Type</label>
        <MultiChipSelect
          options={TYPE_OPTIONS}
          selected={prefs.jobTypes}
          onChange={(jobTypes) => updatePreferences({ jobTypes: jobTypes as JobType[] })}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">
          Experience Level
        </label>
        <MultiChipSelect
          options={LEVEL_OPTIONS}
          selected={prefs.levels}
          onChange={(levels) => updatePreferences({ levels: levels as JobLevel[] })}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Apply Mode</label>
        <div className="flex gap-3">
          <button
            onClick={() => setApplyMode('control')}
            className={`flex-1 py-3 px-3 text-sm font-medium rounded-xl border transition-colors ${
              user.applyMode === 'control'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <div className="font-semibold">Control</div>
            <div className="text-xs mt-0.5 opacity-80">Review before submitting</div>
          </button>
          <button
            onClick={() => setApplyMode('automatic')}
            className={`flex-1 py-3 px-3 text-sm font-medium rounded-xl border transition-colors ${
              user.applyMode === 'automatic'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <div className="font-semibold">Automatic</div>
            <div className="text-xs mt-0.5 opacity-80">Submit immediately</div>
          </button>
        </div>
      </div>

      <Button onClick={onComplete} className="w-full" size="lg">
        Start Swiping!
      </Button>
    </div>
  );
}
