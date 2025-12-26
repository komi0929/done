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
  const activeTask = useGameStore((state) => state.activeTask);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="w-full h-screen overflow-hidden flex flex-col relative text-[var(--neon-green)]">

      {/* Boot Sequence Overlay */}
      <BootSequence />

      {/* CRT Overlay Effects */}
      <div className="crt-overlay"></div>

      {/* 1. Terminal Header */}
      <header className="h-14 border-b border-[var(--terminal-grid)] flex items-center justify-between px-6 shrink-0 z-10 bg-[var(--terminal-bg)]">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-xl tracking-widest text-[var(--neon-green)] glitch-hover cursor-default">
            [DONE_TERMINAL_V4]
          </h1>
          <span className="text-xs font-mono text-[var(--neon-green)] opacity-50 blinking-cursor">
            SYSTEM_ONLINE
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          {activeTask && (
            <div className="flex items-center gap-2 text-[var(--neon-pink)] animate-pulse border border-[var(--neon-pink)] px-2 py-1">
              <span>● REC:</span>
              <span className="uppercase">{activeTask.name}</span>
            </div>
          )}
          <AuthButton />
          <button
            onClick={() => setShowSummary(true)}
            className="border border-[var(--neon-green)] text-[var(--neon-green)] px-4 py-2 hover:bg-[var(--neon-green)] hover:text-black transition-colors uppercase"
          >
            Report.log
          </button>
        </div>
      </header>

      {/* 2. Main Dashboard Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[400px_1fr_350px] gap-0 min-h-0 z-10">

        {/* COL 1: Input & Control (Terminal Console) */}
        <section className="flex flex-col h-full border-r border-[var(--terminal-grid)] bg-[rgba(0,5,0,0.5)] p-6">
          <div className="mb-4 flex items-center gap-2 opacity-70">
            <span className="text-xs">Console/Input</span>
            <div className="h-[1px] flex-1 bg-[var(--neon-green)]"></div>
          </div>
          <TaskController />
        </section>

        {/* COL 2: Task Queue (Data Log) */}
        <section className="flex flex-col h-full border-r border-[var(--terminal-grid)] p-6 overflow-y-auto bg-[rgba(0,0,0,0.3)]">
          <div className="mb-4 flex items-center gap-2 opacity-70">
            <span className="text-xs">Process_Queue</span>
            <div className="h-[1px] flex-1 bg-[var(--neon-green)]"></div>
          </div>
          <TaskQueue />
        </section>

        {/* COL 3: Visualizer (Stack) */}
        <section className="flex flex-col h-full p-6 relative bg-[rgba(0,10,0,0.2)]">
          <div className="mb-4 flex items-center gap-2 opacity-70">
            <span className="text-xs">Memory_Dump</span>
            <div className="h-[1px] flex-1 bg-[var(--neon-green)]"></div>
          </div>
          <PhysicsStack />

          {/* Decorative Footer in Col 3 */}
          <div className="mt-auto pt-4 text-[10px] text-[var(--neon-green)] opacity-50 flex flex-col gap-1">
            <div>Mem: 64TB OK</div>
            <div>Net: CONNECTED</div>
            <div>Sec: ENCRYPTED</div>
          </div>
        </section>

      </div>

      {/* Footer (Status Line) */}
      <footer className="shrink-0 h-8 border-t border-[var(--terminal-grid)] bg-[var(--terminal-bg)] flex items-center justify-between px-4 text-[10px] text-[var(--neon-green)] z-10">
        <div className="flex gap-4">
          <a href="/terms" className="hover:text-white hover:underline">[TERMS]</a>
          <a href="/privacy" className="hover:text-white hover:underline">[PRIVACY]</a>
          <a href="/company" className="hover:text-white hover:underline">[CORP]</a>
        </div>
        <div className="tracking-widest">
          SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </footer>

      <SummaryModal isOpen={showSummary} onClose={() => setShowSummary(false)} />
    </main>
  );
}
