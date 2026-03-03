import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { SwipeDeck } from '../components/feed/SwipeDeck';
import { ApplicationList } from '../components/applications/ApplicationList';
import { ApplicationDetail } from '../components/applications/ApplicationDetail';
import { SettingsDrawer } from '../components/settings/SettingsDrawer';
import { ToastContainer } from '../components/common/Toast';
import { ResumeUpload } from '../components/onboarding/ResumeUpload';
import { PreferenceWizard } from '../components/onboarding/PreferenceWizard';
import { TAB_ROUTES } from './routes';
import { Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/cn';
import { APP_NAME } from '../utils/constants';

type Tab = '/' | '/applications';
type OnboardingStep = 'welcome' | 'auth' | 'resume' | 'preferences' | 'done';

export default function App() {
  const {
    isAuthenticated,
    isOnboarded,
    setIsOnboarded,
    loginWithMock,
    setUser,
    setIsAuthenticated,
    openSettings,
    selectedApplicationId,
    getPendingReviewCount,
    loadMockApplications,
  } = useStore();

  const [activeTab, setActiveTab] = useState<Tab>('/');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');

  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      loadMockApplications();
    }
  }, [isAuthenticated, isOnboarded, loadMockApplications]);

  const pendingCount = getPendingReviewCount();

  // Onboarding flow
  if (!isAuthenticated || !isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <ToastContainer />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {onboardingStep === 'welcome' && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{APP_NAME}</h1>
                <p className="text-slate-500 mt-1">Swipe And Browse Listings Effortlessly</p>
              </div>
              <button
                onClick={() => {
                  loginWithMock();
                  setOnboardingStep('resume');
                }}
                className="w-full max-w-xs bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
              <p className="text-xs text-slate-400">Demo mode — no account required</p>
            </div>
          )}

          {onboardingStep === 'resume' && (
            <ResumeUpload
              onComplete={() => setOnboardingStep('preferences')}
              onSkip={() => setOnboardingStep('preferences')}
            />
          )}

          {onboardingStep === 'preferences' && (
            <PreferenceWizard
              onComplete={() => {
                setIsOnboarded(true);
                setOnboardingStep('done');
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto relative">
      <ToastContainer />
      <SettingsDrawer />

      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-slate-900">{APP_NAME}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={openSettings}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => {
              setUser(null);
              setIsAuthenticated(false);
              setIsOnboarded(false);
              setOnboardingStep('welcome');
            }}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === '/' && <SwipeDeck />}
        {activeTab === '/applications' && (
          selectedApplicationId ? <ApplicationDetail /> : <ApplicationList />
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="bg-white border-t border-slate-100 flex shrink-0">
        {TAB_ROUTES.map((route) => {
          const Icon = route.icon;
          const isActive = activeTab === route.path;
          const showBadge = route.path === '/applications' && pendingCount > 0;

          return (
            <button
              key={route.path}
              onClick={() => {
                setActiveTab(route.path as Tab);
                if (route.path === '/applications') {
                  useStore.getState().setSelectedApplication(null);
                }
              }}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative',
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-yellow-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{route.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
