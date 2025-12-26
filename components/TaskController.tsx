"use client";

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function TaskController() {
    const { activeTask, startNewTask, finishCurrentTask, projectHistory, categoryHistory } = useGameStore();

    // Input States
    const [project, setProject] = useState('');
    const [category, setCategory] = useState('');
    const [taskName, setTaskName] = useState('');

    // Dropdown visibility
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Timer State for Active Task
    const [elapsed, setElapsed] = useState(0);

    // Sync Timer
    useEffect(() => {
        if (!activeTask) {
            setElapsed(0);
            return;
        }

        const update = () => {
            const now = Date.now();
            const currentSession = (now - activeTask.startTime) / 1000;
            setElapsed(activeTask.accumulatedTime + currentSession);
        };

        update();
        const interval = setInterval(update, 100);
        return () => clearInterval(interval);
    }, [activeTask]);

    const handleStart = () => {
        if (!taskName.trim()) return;
        startNewTask(taskName, project || 'GENERAL', category || 'MISC');
        setTaskName('');
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-full flex flex-col gap-4 font-mono text-[var(--text-color)]">

            {/* 1. New Task Input (Terminal Form) */}
            <div className="terminal-box p-6 flex flex-col gap-6 relative bg-[var(--window-bg)]">
                <div className="flex items-center gap-2 mb-2 border-b border-[var(--grid-color)] pb-2 opacity-50">
                    <span className="text-[var(--accent-primary)] font-bold text-lg">+</span>
                    <h2 className="font-bold tracking-widest text-xs">NEW_ENTRY_PROTOCOL</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Project Input with Dropdown */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-[10px] opacity-70">TARGET_PROJECT</label>
                        <input
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            onFocus={() => setShowProjectDropdown(true)}
                            onBlur={() => setTimeout(() => setShowProjectDropdown(false), 150)}
                            className="bg-transparent border-b border-[var(--text-color)] text-[var(--text-color)] outline-none py-1 focus:border-[var(--accent-primary)] transition-colors placeholder:opacity-30"
                            placeholder="DONE_OS"
                            autoComplete="off"
                        />
                        {showProjectDropdown && projectHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-color)] border border-[var(--text-color)] z-30 shadow-lg max-h-40 overflow-y-auto">
                                {projectHistory.map((p, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onMouseDown={() => { setProject(p); setShowProjectDropdown(false); }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] border-b border-[var(--grid-color)] last:border-b-0 transition-colors"
                                    >
                                        {'>'} {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Input with Dropdown */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-[10px] opacity-70">SUB_SECTION</label>
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            onFocus={() => setShowCategoryDropdown(true)}
                            onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
                            className="bg-transparent border-b border-[var(--text-color)] text-[var(--text-color)] outline-none py-1 focus:border-[var(--accent-primary)] transition-colors placeholder:opacity-30"
                            placeholder="DEV"
                            autoComplete="off"
                        />
                        {showCategoryDropdown && categoryHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-color)] border border-[var(--text-color)] z-30 shadow-lg max-h-40 overflow-y-auto">
                                {categoryHistory.map((c, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onMouseDown={() => { setCategory(c); setShowCategoryDropdown(false); }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] border-b border-[var(--grid-color)] last:border-b-0 transition-colors"
                                    >
                                        {'>'} {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] opacity-70">MISSION_OBJECTIVE</label>
                    <div className="flex items-center">
                        <span className="text-[var(--accent-primary)] mr-2">{'>'}</span>
                        <input
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="bg-transparent w-full text-lg outline-none text-[var(--text-color)] blinking-cursor placeholder:opacity-30"
                            placeholder="Enter command..."
                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        />
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className={`w-full font-bold py-3 mt-4 border border-[var(--text-color)] transition-all uppercase tracking-widest text-xs relative overflow-hidden group ${activeTask
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]'
                        }`}
                >
                    <span className="relative z-10">{activeTask ? 'SYSTEM_BUSY' : 'INITIALIZE_SEQUENCE'}</span>
                </button>
            </div>

            {/* 2. Active Task Status (If running) */}
            {activeTask && (
                <div className="flex-1 flex flex-col justify-between p-6 border border-[var(--accent-primary)] bg-[var(--window-bg)] shadow-[var(--box-shadow-glow)] animate-in slide-in-from-left duration-500">
                    <div>
                        <div className="flex justify-between items-start mb-4 border-b border-[var(--accent-primary)] pb-2">
                            <span className="bg-[var(--accent-primary)] text-[var(--bg-color)] text-[10px] px-2 py-1 font-bold">PID: {activeTask.id.slice(0, 4)}</span>
                            <div className="animate-pulse w-2 h-2 bg-[var(--accent-primary)]"></div>
                        </div>

                        <h3 className="text-[var(--accent-primary)] opacity-80 text-xs font-bold uppercase mb-2">
                            {activeTask.project} // {activeTask.category}
                        </h3>
                        <h1 className="text-2xl font-bold leading-tight mb-6 text-[var(--text-color)]">
                            {activeTask.name}
                        </h1>
                    </div>

                    <div>
                        <div className="text-5xl font-mono font-bold tracking-tighter mb-6 tabular-nums text-[var(--accent-primary)] glitch-hover">
                            {formatTime(elapsed)}
                        </div>

                        <button
                            onClick={finishCurrentTask}
                            className="w-full bg-transparent text-[var(--accent-primary)] border border-[var(--accent-primary)] font-bold text-sm py-4 hover:bg-[var(--accent-primary)] hover:text-[var(--bg-color)] transition-all shadow-[var(--box-shadow-glow)] uppercase tracking-[0.2em]"
                        >
                            TERMINATE_PROCESS
                        </button>
                    </div>
                </div>
            )}

            {/* Placeholder if no active task */}
            {!activeTask && (
                <div className="flex-1 flex items-center justify-center p-6 border border-dashed border-[var(--grid-color)] opacity-30">
                    <p className="font-mono text-sm text-center">
                        [IDLE_STATE]<br />
                        AWAITING_INPUT...
                    </p>
                </div>
            )}

        </div>
    );
}
