import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth, initializeFirebaseClient } from '../config/firebase.client';
import { ErpError, toErpError } from '../domain/errors';
import type { ErpIdentity } from '../domain/identity';
import type { ProjectContext } from '../domain/project';
import { getIdentity } from '../data/repositories/identityRepository';
import { getProjectContext } from '../data/repositories/projectRepository';
import { shouldRevalidate } from './sessionPolicy';

export type AuthStatus = 'initializing' | 'signed-out' | 'authorized' | 'denied';

interface AuthContextValue {
  status: AuthStatus;
  firebaseUser?: User;
  identity?: ErpIdentity;
  project?: ProjectContext;
  denial?: ErpError;
  signIn(email: string, password: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
  revalidate(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('initializing');
  const [firebaseUser, setFirebaseUser] = useState<User>();
  const [identity, setIdentity] = useState<ErpIdentity>();
  const [project, setProject] = useState<ProjectContext>();
  const [denial, setDenial] = useState<ErpError>();
  const lastValidatedAt = useRef(0);

  const clearProtectedState = useCallback(() => {
    setFirebaseUser(undefined);
    setIdentity(undefined);
    setProject(undefined);
  }, []);

  const authorize = useCallback(async (user: User) => {
    try {
      const approvedIdentity = await getIdentity(user.uid);
      const approvedProject = await getProjectContext();
      setFirebaseUser(user);
      setIdentity(approvedIdentity);
      setProject(approvedProject);
      setDenial(undefined);
      setStatus('authorized');
      lastValidatedAt.current = Date.now();
    } catch (error) {
      clearProtectedState();
      setDenial(toErpError(error));
      setStatus('denied');
    }
  }, [clearProtectedState]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: () => void = () => undefined;
    void initializeFirebaseClient().then(() => {
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          clearProtectedState();
          setDenial(undefined);
          setStatus('signed-out');
          return;
        }
        setStatus('initializing');
        void authorize(user);
      });
    }).catch((error: unknown) => {
      if (!cancelled) {
        setDenial(toErpError(error));
        setStatus('denied');
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [authorize, clearProtectedState]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setStatus('initializing');
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } catch {
      setStatus('signed-out');
      throw new ErpError('AUTH_REQUIRED');
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    } catch {
      // Deliberately return the same result to avoid account enumeration.
    }
  }, []);

  const signOut = useCallback(async () => {
    clearProtectedState();
    setDenial(undefined);
    setStatus('signed-out');
    await firebaseSignOut(auth);
    sessionStorage.clear();
  }, [clearProtectedState]);

  const revalidate = useCallback(async () => {
    if (auth.currentUser) await authorize(auth.currentUser);
  }, [authorize]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && status === 'authorized' && shouldRevalidate(lastValidatedAt.current)) {
        void revalidate();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [revalidate, status]);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    ...(firebaseUser ? { firebaseUser } : {}),
    ...(identity ? { identity } : {}),
    ...(project ? { project } : {}),
    ...(denial ? { denial } : {}),
    signIn,
    resetPassword,
    signOut,
    revalidate,
  }), [denial, firebaseUser, identity, project, resetPassword, revalidate, signIn, signOut, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The hook intentionally shares this module with its provider to keep the
// authorization contract private to one boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider.');
  return value;
}
