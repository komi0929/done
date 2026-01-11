"use client";

import { useEffect, useState } from "react";
import TaskController from "@/components/TaskController";
import TaskQueue from "@/components/TaskQueue";
import PhysicsStack from "@/components/PhysicsStack";
import SummaryModal from "@/components/SummaryModal";
import AuthButton from "@/components/AuthButton";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const activeTask = useGameStore((state) => state.activeTask);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (!mounted) return null;

  return (
    <main className="w-full h-screen overflow-y-auto flex flex-col bg-[var(--background)]">

      {/* 1. Status Bar / Header */}
      <header className="h-12 bg-white border-b border-gray-300 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <h1 className="font-black italic tracking-tighter text-xl bg-black text-white px-2 transform -rotate-2">
            DONE!!!
          </h1>
          <span className="text-xs font-mono text-gray-400">HIERARCHY TASK LOGGER</span>
        </div>

        <div className="flex items-center gap-4">
          {activeTask && (
            <span className="text-xs font-mono font-bold animate-pulse text-[var(--accent-magenta)]">
              ● RECORDING
            </span>
          )}
          <AuthButton />
          <a
            href="/tasks"
            className="bg-black text-white text-xs font-bold px-4 py-2 rounded-sm hover:scale-105 transition-transform font-mono border border-gray-800"
          >
            STACK_MODE
          </a>
          <button
            onClick={() => setShowSummary(true)}
            className="bg-[var(--accent-magenta)] text-white text-xs font-bold px-4 py-2 rounded-sm hover:brightness-110 transition-all font-mono"
          >
            DAILY REPORT
          </button>
        </div>
      </header>

      {/* 2. Main 3-Column Grid (Expanded Left: 2fr 1fr 1fr) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6 p-6 min-h-0">

        {/* LEFT: Task Controller (Input & Active Timer) */}
        <section className="flex flex-col h-full min-h-0 overflow-y-auto">
          <div className="mb-2">
            <h2 className="text-gray-400 font-mono font-bold text-xs uppercase tracking-widest">
              1. CONTROL_PANEL
            </h2>
          </div>
          <TaskController />
        </section>

        {/* CENTER: Queue */}
        <section className="flex flex-col h-full min-h-0 border-x border-dashed border-gray-200 px-6 overflow-y-auto">
          <div className="mb-2">
            <h2 className="text-gray-400 font-mono font-bold text-xs uppercase tracking-widest">
              2. TASK_QUEUE
            </h2>
          </div>
          <TaskQueue />
        </section>

        {/* RIGHT: Physics Stack */}
        <section className="flex flex-col h-full min-h-0 relative">
          <PhysicsStack />
        </section>

      </div>

      {/* 3. Footer (Legal Links) */}
      <footer className="bg-white border-t border-gray-300 py-4 px-6 shrink-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-black hover:underline">利用規約 (Terms)</a>
            <a href="/privacy" className="hover:text-black hover:underline">プライバシーポリシー (Privacy)</a>
            <a href="/company" className="hover:text-black hover:underline">会社情報 (Company)</a>
          </div>
          <div>© {new Date().getFullYear()} DONE!!! All rights reserved.</div>
        </div>
      </footer>

      {/* Modals */}
      <SummaryModal isOpen={showSummary} onClose={() => setShowSummary(false)} />

    </main>
  );
}
