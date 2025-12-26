"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";

export default function TaskQueue() {
    const { queue, resumeTask } = useGameStore();
    const [hoverId, setHoverId] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-3 font-mono text-[var(--text-color)]">
            {queue.length === 0 ? (
                <div className="text-center py-10 opacity-30 select-none">
                    <p className="text-xs">BUFFER_EMPTY</p>
                    <p className="text-[10px]">NO_PENDING_OPERATIONS</p>
                </div>
            ) : (
                queue.map((task, index) => (
                    <div
                        key={task.id}
                        className="group relative border-l-2 border-[var(--grid-color)] pl-4 py-2 hover:bg-[var(--bg-color)]/10 transition-colors cursor-pointer"
                        onMouseEnter={() => setHoverId(task.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onClick={() => resumeTask(task.id)}
                    >
                        {/* Index Marker */}
                        <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] transition-colors group-hover:bg-[var(--accent-primary)]"></div>

                        {/* Header */}
                        <div className="flex justify-between items-center mb-1 text-[10px] opacity-70">
                            <span>#{String(index + 1).padStart(3, '0')}</span>
                            <span className="uppercase">{task.project}</span>
                        </div>

                        {/* Task Name */}
                        <div className={`text-sm font-bold ${hoverId === task.id ? 'glitch-hover text-[var(--accent-primary)]' : ''}`}>
                            {task.name}
                        </div>

                        {/* Metadata */}
                        <div className="mt-1 flex justify-between items-center text-[10px] opacity-50">
                            <span>{task.category}</span>
                            <span>{Math.floor(task.accumulatedTime / 60)}m PREV_EXEC</span>
                        </div>

                        {/* Resume Prompt */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[var(--accent-primary)] font-bold text-xs">[RESUME]</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
