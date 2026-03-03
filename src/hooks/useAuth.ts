import { useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useStore } from '../store';

const USE_MOCK = true; // TODO: Set to false when Firebase is connected

export function useAuth() {
  const { user, isAuthenticated, setUser, setIsAuthenticated, loginWithMock } = useStore();

  useEffect(() => {
    if (USE_MOCK) return;

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          createdAt: new Date(),
          masterResumeUrl: null,
          masterResumeText: null,
          preferences: {
            roles: [],
            locations: [],
            remoteOnly: false,
            jobTypes: [],
            levels: [],
            salaryMin: null,
            salaryMax: null,
            excludeCompanies: [],
            keywords: [],
          },
          applyMode: 'control',
          stats: { totalSwiped: 0, totalApplied: 0, totalSaved: 0 },
        });
      } else {
        setUser(null);
      }
    });

    return unsub;
  }, [setUser]);

  const login = async (email: string, password: string) => {
    if (USE_MOCK) {
      loginWithMock();
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    if (USE_MOCK) {
      loginWithMock();
      return;
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    if (USE_MOCK) {
      loginWithMock();
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (USE_MOCK) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    await signOut(auth);
  };

  return {
    user,
    isAuthenticated,
    login,
    signup,
    loginWithGoogle,
    logout,
  };
}
