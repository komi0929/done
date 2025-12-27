"use client";

import { useEffect, useState } from "react";
import TaskController from "@/components/TaskController";
import TaskQueue from "@/components/TaskQueue";
import PhysicsStack from "@/components/PhysicsStack";
import SummaryModal from "@/components/SummaryModal";
import BootSequence from "@/components/BootSequence";
import AuthButton from "@/components/AuthButton";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const { activeTask, theme, toggleTheme } = useGameStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main
            className="w-full h-screen overflow-hidden flex flex-col relative transition-colors duration-300"
            data-theme={theme}
        >

            {/* Retro Effects (Only in Retro Theme) */}
            {theme === 'retro' && (
                <>
                    <BootSequence />
                    <div className="crt-overlay"></div>
                </>
            )}

            {/* 1. Terminal Header */}
            <header className="h-14 border-b border-[var(--grid-color)] flex items-center justify-between px-6 shrink-0 z-10 bg-[var(--window-bg)]">
                <div className="flex items-center gap-4">
                    <h1 className="font-black italic text-2xl tracking-tighter text-[var(--text-color)] glitch-hover cursor-default">
                        DONE!!!
                    </h1>
                    <span className="text-xs font-mono text-[var(--text-color)] opacity-50 uppercase tracking-widest">
                        HIERARCHY TASK LOGGER
                    </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold font-mono">
                    <button className="bg-black text-white px-4 py-2 flex items-center gap-2 hover:opacity-80 transition-opacity uppercase">
                        <span className="text-[#4285F4] font-bold">G</span> SIGN IN
                    </button>
                    <button
                        onClick={() => setShowSummary(true)}
                        className="bg-[var(--accent-primary)] text-white px-4 py-2 hover:opacity-80 transition-opacity uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        DAILY REPORT
                    </button>
                </div>
            </header>

            {/* 2. Main Dashboard Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-[400px_1fr_350px] gap-0 min-h-0 z-10 bg-[var(--bg-color)]/50">

                {/* COL 1: Input & Control (Terminal Console) */}
                <section className="flex flex-col h-full border-r border-[var(--grid-color)] bg-[var(--window-bg)] p-6 transition-colors">
                    <div className="mb-8 flex items-center gap-2 opacity-70">
                        <span className="font-mono font-bold text-sm text-[var(--text-color)] uppercase tracking-widest">1. CONTROL_PANEL</span>
                        <div className="h-[1px] flex-1 bg-[var(--grid-color)]"></div>
                    </div>
                    <TaskController />
                </section>

                {/* COL 2: Task Queue (Data Log) */}
                <section className="flex flex-col h-full border-r border-[var(--grid-color)] p-6 overflow-y-auto bg-[var(--bg-color)]/30 transition-colors">
                    <div className="mb-8 flex items-center gap-2 opacity-70">
                        <span className="font-mono font-bold text-sm text-[var(--text-color)] uppercase tracking-widest">2. TASK_QUEUE</span>
                        <div className="h-[1px] flex-1 bg-[var(--grid-color)]"></div>
                    </div>
                    <TaskQueue />
                </section>

                {/* COL 3: Visualizer (Stack) */}
                <section className="flex flex-col h-full p-6 relative bg-[var(--bg-color)]/20 transition-colors">
                    <div className="h-full border-2 border-dashed border-[var(--grid-color)] rounded-lg p-4 relative">
                        <div className="absolute top-4 left-0 right-0 text-center">
                            <span className="font-mono font-bold text-lg text-[var(--grid-color)] uppercase tracking-widest">ACHIEVEMENT_STACK</span>
                        </div>
                        <PhysicsStack />
                    </div>
                </section>

            </div>

            {/* Footer (Status Line) */}
            <footer className="shrink-0 h-8 border-t border-[var(--grid-color)] bg-[var(--bg-color)] flex items-center justify-between px-4 text-[10px] text-[var(--text-color)] z-10 transition-colors">
                <div className="flex gap-4">
                    <a href="/terms" className="hover:text-[var(--accent-primary)] hover:underline">[TERMS]</a>
                    <a href="/privacy" className="hover:text-[var(--accent-primary)] hover:underline">[PRIVACY]</a>
                    <a href="/company" className="hover:text-[var(--accent-primary)] hover:underline">[CORP]</a>
                </div>
                <div className="tracking-widest">
                    SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
            </footer>

            <SummaryModal isOpen={showSummary} onClose={() => setShowSummary(false)} />
        </main>
    );
}
