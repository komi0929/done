"use client";

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function TaskController() {
    const { activeTask, startNewTask, finishCurrentTask, projectHistory, categoryHistory, removeFromHistory } = useGameStore();

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
        <div className="h-full flex flex-col gap-4">

            {/* 1. New Task Input (Card) */}
            <div className="os-window bg-white shadow-xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--accent-magenta)] text-xl font-bold">+</span>
                    <h2 className="font-bold text-lg">NEW_ENTRY.exe</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Project Input with Dropdown */}
                    <div className="flex flex-col gap-1 relative">
                        <label className="text-xs text-gray-500 font-mono">PROJECT (L)</label>
                        <input
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            onFocus={() => setShowProjectDropdown(true)}
                            onBlur={() => setTimeout(() => setShowProjectDropdown(false), 150)}
                            className="os-input font-bold"
                            placeholder="DONE_OS"
                            autoComplete="off"
                        />
                        {showProjectDropdown && projectHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black z-30 shadow-lg max-h-40 overflow-y-auto">
                                {projectHistory.map((p, idx) => (
                                    <div key={idx} className="flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-100 group">
                                        <button
                                            type="button"
                                            onMouseDown={() => { setProject(p); setShowProjectDropdown(false); }}
                                            className="flex-1 text-left px-3 py-2 text-sm font-mono"
                                        >
                                            {p}
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => { e.stopPropagation(); removeFromHistory('project', p); }}
                                            className="px-3 py-2 text-xs text-gray-400 hover:text-red-500 font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Input with Dropdown */}
                    <div className="flex flex-col gap-1 relative">
                        <label className="text-xs text-gray-500 font-mono">SECTION (M)</label>
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            onFocus={() => setShowCategoryDropdown(true)}
                            onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
                            className="os-input"
                            placeholder="DEV"
                            autoComplete="off"
                        />
                        {showCategoryDropdown && categoryHistory.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black z-30 shadow-lg max-h-40 overflow-y-auto">
                                {categoryHistory.map((c, idx) => (
                                    <div key={idx} className="flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-100 group">
                                        <button
                                            type="button"
                                            onMouseDown={() => { setCategory(c); setShowCategoryDropdown(false); }}
                                            className="flex-1 text-left px-3 py-2 text-sm font-mono"
                                        >
                                            {c}
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => { e.stopPropagation(); removeFromHistory('category', c); }}
                                            className="px-3 py-2 text-xs text-gray-400 hover:text-red-500 font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-mono">TASK (S)</label>
                    <input
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="os-input text-lg"
                        placeholder="Fix UI Layout..."
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    />
                </div>

                <button
                    onClick={handleStart}
                    className={`w-full font-bold py-3 mt-2 hover:opacity-90 transition-opacity border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${activeTask
                        ? 'bg-gray-200 text-black'
                        : 'bg-[var(--accent-magenta)] text-white'
                        }`}
                >
                    {activeTask ? 'ADD_TO_QUEUE' : 'START_LOGGING'}
                </button>
            </div>

            {/* 2. Active Task Status (If running) */}
            {activeTask && (
                <div className="os-window bg-[#E0E0E5] border-2 border-[var(--accent-cyan)] flex-1 flex flex-col justify-between p-6 animate-in slide-in-from-left duration-300">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-black text-[var(--accent-cyan)] text-xs px-2 py-1 font-mono">ACTIVE_PROCESS_ID: {activeTask.id.slice(0, 4)}</span>
                            <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>

                        <h3 className="text-gray-500 text-sm font-bold uppercase mb-1">{activeTask.project} / {activeTask.category}</h3>
                        <h1 className="text-3xl font-black leading-tight mb-6">{activeTask.name}</h1>
                    </div>

                    <div>
                        <div className="text-6xl font-mono font-bold tracking-tighter mb-6 tabular-nums">
                            {formatTime(elapsed)}
                        </div>

                        <button
                            onClick={finishCurrentTask}
                            className="w-full bg-[var(--neon-yellow)] text-black border-2 border-black font-black text-xl py-4 hover:brightness-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                        >
                            DONE!!!
                        </button>
                    </div>
                </div>
            )}

            {/* Placeholder if no active task */}
            {!activeTask && (
                <div className="os-window bg-gray-100 flex-1 flex items-center justify-center p-6 border-dashed border-2 border-gray-300">
                    <p className="text-gray-400 font-mono text-sm text-center">
                        NO_ACTIVE_PROCESS<br />
                        AWAITING_INPUT...
                    </p>
                </div>
            )}

        </div>
    );
}
