"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="text-xs font-mono text-gray-400 animate-pulse">
                AUTHENTICATING...
            </div>
        );
    }

    if (session) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-600">
                    {session.user?.email?.split("@")[0]}
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
            onClick={() => signIn("google")}
            className="border border-[var(--text-color)] text-[var(--accent-primary)] px-4 py-2 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-color)] transition-colors uppercase font-bold text-xs"
        >
            SIGN IN
        </button>
    );
}
