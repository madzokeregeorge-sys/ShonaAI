import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
  onBack: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const handleSelect = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      onComplete({ ...profile, [key]: value });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl shadow-stone-200 border border-stone-100">
        
        {/* Header with Progress */}
        <div className="flex items-center mb-10">
          <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </button>
          <div className="flex-1 ml-4 h-1.5 bg-stone-100 rounded-full overflow-hidden">
             {/* Progress bar using Zim flag colors segments if possible, or just green */}
            <div 
              className="h-full bg-zim-green transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-zim-black mb-2">Knowledge Level</h2>
            <p className="text-stone-500 mb-8">How much Shona do you know?</p>
            <div className="space-y-4">
              <OptionButton label="Complete Beginner" sub="I know nothing yet" onClick={() => handleSelect('level', 'beginner')} />
              <OptionButton label="Intermediate" sub="I know 'Mhoro' and 'Ndeipi'" onClick={() => handleSelect('level', 'intermediate')} />
              <OptionButton label="Advanced" sub="I can hold a conversation" onClick={() => handleSelect('level', 'advanced')} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-zim-black mb-2">Your Goal</h2>
            <p className="text-stone-500 mb-8">Why are you learning ChiShona?</p>
            <div className="space-y-4">
              <OptionButton label="Travel & Tourism" onClick={() => handleSelect('goal', 'travel')} />
              <OptionButton label="Family & Heritage" onClick={() => handleSelect('goal', 'family')} />
              <OptionButton label="Business & Work" onClick={() => handleSelect('goal', 'business')} />
              <OptionButton label="Street Slang" sub="Focus on informal language" onClick={() => handleSelect('goal', 'slang')} highlight />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-zim-black mb-2">Introduction</h2>
            <p className="text-stone-500 mb-8">What should Mufaro call you?</p>
            <input 
              type="text" 
              placeholder="Your Name"
              className="w-full p-4 border-2 border-stone-100 rounded-xl mb-6 focus:ring-0 focus:border-zim-green outline-none text-lg text-zim-black font-medium transition-colors"
              onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
            />
            <Button 
              fullWidth 
              size="lg"
              disabled={!profile.name}
              onClick={() => onComplete(profile)}
            >
              Start Learning
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const OptionButton: React.FC<{ label: string, sub?: string, onClick: () => void, highlight?: boolean }> = ({ label, sub, onClick, highlight }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 group
      ${highlight 
        ? 'border-zim-yellow bg-yellow-50 hover:bg-yellow-100' 
        : 'border-stone-100 hover:border-zim-green hover:bg-green-50'
      }`}
  >
    <div className="font-bold text-zim-black group-hover:text-black">{label}</div>
    {sub && <div className="text-sm text-stone-500 mt-1">{sub}</div>}
  </button>
);