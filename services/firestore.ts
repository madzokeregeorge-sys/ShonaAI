/**
 * Firestore operations for ShonaAI
 * Handles user profiles and chat history persistence
 */

import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db, isConfigured } from './firebase';
import { UserProfile, ChatMessage } from '../types';

// ─── User Profiles ───────────────────────────────────────────

export const createUserProfile = async (
    uid: string,
    email: string,
    profile: Partial<UserProfile>
): Promise<void> => {
    if (!isConfigured) return;
    try {
        await setDoc(doc(db, 'users', uid), {
            email,
            name: profile.name || 'Student',
            level: profile.level || 'beginner',
            goal: profile.goal || 'travel',
            isPremium: false,
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
        });
    } catch (error) {
        console.warn('Failed to create user profile:', error);
    }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!isConfigured) return null;
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
            return snap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.warn('Failed to get user profile:', error);
        return null;
    }
};

export const updateUserProfile = async (
    uid: string,
    updates: Partial<UserProfile>
): Promise<void> => {
    if (!isConfigured) return;
    try {
        await updateDoc(doc(db, 'users', uid), {
            ...updates,
            lastActive: serverTimestamp(),
        });
    } catch (error) {
        console.warn('Failed to update user profile:', error);
    }
};

// ─── Chat History ────────────────────────────────────────────

export const saveChatSession = async (
    uid: string,
    messages: ChatMessage[]
): Promise<string | null> => {
    if (!isConfigured || messages.length < 2) return null;
    try {
        const docRef = await addDoc(collection(db, 'users', uid, 'chatSessions'), {
            messages: messages.map(m => ({
                role: m.role,
                text: m.text,
                timestamp: m.timestamp instanceof Date ? Timestamp.fromDate(m.timestamp) : m.timestamp,
            })),
            messageCount: messages.length,
            savedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.warn('Failed to save chat session:', error);
        return null;
    }
};

export const getRecentSessions = async (
    uid: string,
    count: number = 5
): Promise<{ id: string; messageCount: number; savedAt: Date }[]> => {
    if (!isConfigured) return [];
    try {
        const q = query(
            collection(db, 'users', uid, 'chatSessions'),
            orderBy('savedAt', 'desc'),
            limit(count)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({
            id: d.id,
            messageCount: d.data().messageCount,
            savedAt: d.data().savedAt?.toDate() || new Date(),
        }));
    } catch (error) {
        console.warn('Failed to load chat sessions:', error);
        return [];
    }
};
