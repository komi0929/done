"use client";

import { useAuth } from "@/components/AuthProvider";

export default function AuthButton() {
    const { user, isLoading, signInWithGoogle, signOut } = useAuth();

    if (isLoading) {
        return (
            <div className="text-xs font-mono text-gray-400 animate-pulse">
                LOADING...
            </div>
        );
    }

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-600">
                    {user.email?.split("@")[0]}
                </span>
                <button
                    onClick={() => signOut()}
                    className="bg-gray-200 text-black text-xs font-bold px-3 py-1 rounded-sm hover:bg-gray-300 transition-colors font-mono"
                >
                    LOGOUT
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signInWithGoogle()}
            className="border border-[var(--text-color)] text-[var(--accent-primary)] px-4 py-2 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-color)] transition-colors uppercase font-bold text-xs"
        >
            SIGN IN
        </button>
    );
}
