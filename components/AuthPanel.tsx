import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { createUserProfile } from '../services/firestore';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

interface AuthPanelProps {
    onDemoMode: () => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ onDemoMode }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(cred.user, { displayName: name || 'Student' });
                await createUserProfile(cred.user.uid, email, { name: name || 'Student' });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            const code = err?.code || '';
            if (code === 'auth/email-already-in-use') {
                setError('This email is already registered. Try signing in.');
            } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (code === 'auth/weak-password') {
                setError('Password must be at least 6 characters.');
            } else if (code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-zim-green rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
                        S
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zim-black">
                        Shona<span className="text-zim-green">AI</span>
                    </h1>
                    <p className="text-stone-400 text-sm mt-1">Master the language of Zimbabwe</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-zim-green focus:ring-4 focus:ring-green-500/10 text-stone-900 placeholder-stone-400"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-zim-green focus:ring-4 focus:ring-green-500/10 text-stone-900 placeholder-stone-400"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-zim-green focus:ring-4 focus:ring-green-500/10 text-stone-900 placeholder-stone-400"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-zim-green text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isSignUp ? (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Create Account
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-stone-500 mt-6">
                    {isSignUp ? 'Already have an account? ' : "New here? "}
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                        className="text-zim-green font-bold hover:underline"
                    >
                        {isSignUp ? 'Sign In' : 'Create Account'}
                    </button>
                </p>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-stone-400 uppercase tracking-wider">or</span>
                    </div>
                </div>

                <button
                    onClick={onDemoMode}
                    className="w-full py-3 border-2 border-stone-200 text-stone-600 font-semibold rounded-xl hover:border-zim-green hover:text-zim-green transition-all"
                >
                    Try Demo Mode
                </button>
            </div>
        </div>
    );
};
