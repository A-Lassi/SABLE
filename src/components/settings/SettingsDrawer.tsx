import { useStore } from '../../store';
import { ProfileSection } from './ProfileSection';
import {
  FilterSection,
  ChipInput,
  MultiChipSelect,
} from './FilterSection';
import { JOB_TYPES, JOB_LEVELS } from '../../utils/constants';
import { Button } from '../common/Button';
import { X } from 'lucide-react';
import type { JobType, JobLevel } from '../../types';

const TYPE_OPTIONS = JOB_TYPES.map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}));

const LEVEL_OPTIONS = JOB_LEVELS.map((l) => ({
  value: l,
  label: l.charAt(0).toUpperCase() + l.slice(1),
}));

export function SettingsDrawer() {
  const {
    isSettingsOpen,
    closeSettings,
    user,
    updatePreferences,
    loadInitialDeck,
    addToast,
  } = useStore();

  if (!isSettingsOpen || !user) return null;

  const prefs = user.preferences;

  const handleApply = () => {
    loadInitialDeck();
    closeSettings();
    addToast('Filters applied', 'success');
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={handleApply} />
      <div className="relative w-full max-w-sm bg-white h-full overflow-y-auto shadow-xl z-10 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
          <button
            onClick={handleApply}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ProfileSection />

          <div className="border-t border-slate-200">
            <div className="px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Filters
              </h3>
            </div>

            <FilterSection title="Roles / Keywords" defaultOpen>
              <ChipInput
                values={prefs.roles}
                onChange={(roles) => updatePreferences({ roles })}
                placeholder="e.g. Frontend Developer"
              />
            </FilterSection>

            <FilterSection title="Locations">
              <ChipInput
                values={prefs.locations}
                onChange={(locations) => updatePreferences({ locations })}
                placeholder="e.g. San Francisco, CA"
              />
            </FilterSection>

            <FilterSection title="Remote Only">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.remoteOnly}
                  onChange={(e) => updatePreferences({ remoteOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Show only remote jobs</span>
              </label>
            </FilterSection>

            <FilterSection title="Job Type">
              <MultiChipSelect
                options={TYPE_OPTIONS}
                selected={prefs.jobTypes}
                onChange={(jobTypes) => updatePreferences({ jobTypes: jobTypes as JobType[] })}
              />
            </FilterSection>

            <FilterSection title="Experience Level">
              <MultiChipSelect
                options={LEVEL_OPTIONS}
                selected={prefs.levels}
                onChange={(levels) => updatePreferences({ levels: levels as JobLevel[] })}
              />
            </FilterSection>

            <FilterSection title="Salary Range">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Min ($)</label>
                  <input
                    type="number"
                    value={prefs.salaryMin ?? ''}
                    onChange={(e) =>
                      updatePreferences({
                        salaryMin: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span className="text-slate-400 mt-4">–</span>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">Max ($)</label>
                  <input
                    type="number"
                    value={prefs.salaryMax ?? ''}
                    onChange={(e) =>
                      updatePreferences({
                        salaryMax: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="500000"
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Excluded Companies">
              <ChipInput
                values={prefs.excludeCompanies}
                onChange={(excludeCompanies) => updatePreferences({ excludeCompanies })}
                placeholder="e.g. BigCorp"
              />
            </FilterSection>
          </div>
        </div>

        <div className="shrink-0 p-4 border-t border-slate-100 bg-white">
          <Button onClick={handleApply} className="w-full" size="lg">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
