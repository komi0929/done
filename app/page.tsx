"use client";

import { useEffect, useState } from "react";
import TaskController from "@/components/TaskController";
import TaskQueue from "@/components/TaskQueue";
import WaveGrid from "@/components/WaveGrid";
import { PolaroidStack } from "@/components/PolaroidCard";
import SummaryModal from "@/components/SummaryModal";
import AuthButton from "@/components/AuthButton";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const activeTask = useGameStore((state) => state.activeTask);
  const completedTasks = useGameStore((state) => state.completedTasks);

  useEffect(() => {
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
    <main className="w-full h-screen overflow-hidden flex flex-col bg-[var(--background)] page-fade-in">

      {/* Header with Pill Style */}
      <header className="h-16 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0 bg-[var(--background)]">
        {/* Left: Logo in Pill */}
        <div className="pill-header">
          <h1 className="font-black italic tracking-tighter text-lg">
            DONE!!!
          </h1>
          <span className="text-xs font-mono text-gray-400 hidden md:inline">
            HIERARCHY TASK LOGGER
          </span>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-4">
          {activeTask && (
            <span className="text-xs font-mono font-bold animate-pulse text-[var(--accent-magenta)]">
              ● RECORDING
            </span>
          )}
          <AuthButton />
          <button
            onClick={() => setShowSummary(true)}
            className="pill-header bg-black text-white text-xs font-bold hover:bg-[var(--accent-magenta)] transition-colors"
          >
            DAILY REPORT
          </button>
        </div>
      </header>

      {/* Main 2-Column Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 min-h-0">

        {/* LEFT: Text & Controls */}
        <section className="flex flex-col h-full min-h-0 overflow-y-auto p-6 bg-white/50">
          {/* Control Panel */}
          <div className="mb-6">
            <h2 className="text-gray-400 font-mono font-bold text-xs uppercase tracking-widest mb-4">
              1. CONTROL_PANEL
            </h2>
            <TaskController />
          </div>

          {/* Task Queue */}
          <div className="flex-1 min-h-0">
            <h2 className="text-gray-400 font-mono font-bold text-xs uppercase tracking-widest mb-4">
              2. TASK_QUEUE
            </h2>
            <div className="h-full overflow-y-auto">
              <TaskQueue />
            </div>
          </div>
        </section>

        {/* RIGHT: Visual Elements */}
        <section className="relative h-full min-h-0 overflow-hidden">
          {/* 3D Wave Grid Background */}
          <WaveGrid />

          {/* Polaroid Cards Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <div className="pointer-events-auto">
              <PolaroidStack tasks={completedTasks} />
            </div>
          </div>

          {/* Completed Count Badge */}
          <div className="absolute bottom-6 right-6 z-10">
            <div className="pill-header bg-white/90 backdrop-blur-sm">
              <span className="text-2xl font-black">{completedTasks.length}</span>
              <span className="text-xs font-mono text-gray-500">DONE</span>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 px-6 shrink-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-black hover:underline transition-colors">利用規約</a>
            <a href="/privacy" className="hover:text-black hover:underline transition-colors">プライバシー</a>
            <a href="/company" className="hover:text-black hover:underline transition-colors">会社情報</a>
          </div>
          <div>© {new Date().getFullYear()} DONE!!! All rights reserved.</div>
        </div>
      </footer>

      {/* Modals */}
      <SummaryModal isOpen={showSummary} onClose={() => setShowSummary(false)} />

    </main>
  );
}
