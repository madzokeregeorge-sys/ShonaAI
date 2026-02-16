import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, isConfigured } from './services/firebase';
import { getUserProfile, updateUserProfile } from './services/firestore';
import { AuthPanel } from './components/AuthPanel';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { Paywall } from './components/Paywall';
import { ChatInterface } from './components/ChatInterface';
import { AppScreen, UserProfile } from './types';
import { Loader2 } from 'lucide-react';

function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Firebase Auth listener
  useEffect(() => {
    if (!isConfigured) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Load profile from Firestore (non-blocking)
        getUserProfile(fbUser.uid)
          .then(profile => {
            if (profile) {
              setUser(profile);
              setScreen(AppScreen.CHAT);
            } else {
              // User exists in Auth but no profile yet — go to onboarding
              setScreen(AppScreen.ONBOARDING);
            }
          })
          .catch(err => {
            console.warn('Profile load failed:', err);
            // Fall through to onboarding
            setScreen(AppScreen.ONBOARDING);
          });
      } else {
        setUser(null);
        setScreen(AppScreen.LANDING);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (isConfigured) {
      setScreen(AppScreen.AUTH);
    } else {
      setScreen(AppScreen.ONBOARDING);
    }
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);
    setScreen(AppScreen.ONBOARDING);
  };

  const handleOnboardingComplete = (profileData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      name: profileData.name || 'Student',
      level: profileData.level || 'beginner',
      goal: profileData.goal || 'travel',
      isPremium: false,
    };
    setUser(newUser);

    // Save to Firestore if logged in
    if (firebaseUser && isConfigured) {
      updateUserProfile(firebaseUser.uid, newUser).catch(() => { });
    }

    setScreen(AppScreen.PAYWALL);
  };

  const handleSubscribe = () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
    setScreen(AppScreen.CHAT);
  };

  const handleSignOut = async () => {
    try {
      if (isConfigured) await signOut(auth);
    } catch { }
    setUser(null);
    setFirebaseUser(null);
    setIsDemoMode(false);
    setScreen(AppScreen.LANDING);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-zim-green animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-sm">Loading ShonaAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased font-sans">
      {screen === AppScreen.LANDING && (
        <LandingPage onStart={handleStart} />
      )}

      {screen === AppScreen.AUTH && (
        <AuthPanel onDemoMode={handleDemoMode} />
      )}

      {screen === AppScreen.ONBOARDING && (
        <Onboarding
          onBack={() => setScreen(isDemoMode || !isConfigured ? AppScreen.LANDING : AppScreen.AUTH)}
          onComplete={handleOnboardingComplete}
        />
      )}

      {screen === AppScreen.PAYWALL && (
        <Paywall onSubscribe={handleSubscribe} />
      )}

      {screen === AppScreen.CHAT && user && (
        <ChatInterface
          user={user}
          uid={firebaseUser?.uid || null}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}

export default App;