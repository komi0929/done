"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";

export default function TaskQueue() {
    const { queue, resumeTask } = useGameStore();
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<'newest' | 'category' | 'longest'>('newest');

    const sortedQueue = [...queue].sort((a, b) => {
        if (sortMode === 'newest') return 0; // Default order (assuming new on top or bottom, usually new on top if unshift used) 
        // Actually store uses unshift for pauseCurrentTask (puts at top), so queue[0] is newest paused. 
        // If we want "Newest" (meaning most recently paused), that's default.
        // If "Oldest", we'd reverse. Let's assume 'Newest' = default order.

        if (sortMode === 'category') return (a.category || '').localeCompare(b.category || '');
        if (sortMode === 'longest') return b.accumulatedTime - a.accumulatedTime;
        return 0;
    });

    return (
        <div className="flex flex-col gap-4 font-mono text-[var(--text-color)]">
            <div className="flex justify-between items-center border-b border-[var(--text-color)] pb-2 mb-2">
                <span className="font-bold text-xs tracking-wider opacity-70">SUSPENDED_PROCESSES ({queue.length})</span>
                <div className="flex gap-2 text-[10px] font-bold">
                    <button
                        onClick={() => setSortMode('newest')}
                        className={`opacity-50 hover:opacity-100 ${sortMode === 'newest' ? 'opacity-100 underline' : ''}`}
                    >
                        NEW
                    </button>
                    <button
                        onClick={() => setSortMode('category')}
                        className={`opacity-50 hover:opacity-100 ${sortMode === 'category' ? 'opacity-100 underline' : ''}`}
                    >
                        CAT
                    </button>
                    <button
                        onClick={() => setSortMode('longest')}
                        className={`opacity-50 hover:opacity-100 ${sortMode === 'longest' ? 'opacity-100 underline' : ''}`}
                    >
                        TIME
                    </button>
                </div>
            </div>

            {queue.length === 0 ? (
                <div className="text-center py-10 opacity-30 select-none">
                    <p className="text-xs">BUFFER_EMPTY</p>
                    <p className="text-[10px]">NO_PENDING_OPERATIONS</p>
                </div>
            ) : (
                sortedQueue.map((task, index) => (
                    <div
                        key={task.id}
                        className="group relative bg-white border-2 border-[var(--text-color)] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-y-[2px] transition-all cursor-pointer"
                        onMouseEnter={() => setHoverId(task.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onClick={() => resumeTask(task.id)}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-2 text-[10px] opacity-70">
                            <span className="uppercase">{task.project}</span>
                            {task.accumulatedTime > 0 && (
                                <span>{Math.floor(task.accumulatedTime / 3600)}H {Math.floor((task.accumulatedTime % 3600) / 60)}M</span>
                            )}
                        </div>

                        {/* Task Name */}
                        <div className="text-lg font-bold mb-1 leading-tight text-[var(--text-color)]">
                            {task.name}
                        </div>

                        {/* Metadata */}
                        <div className="flex justify-between items-center text-[10px] opacity-50">
                            <span>{task.category}</span>
                        </div>

                        {/* Resume Prompt */}
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <span className="text-[var(--accent-primary)] font-bold text-sm tracking-widest">[RESUME]</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
