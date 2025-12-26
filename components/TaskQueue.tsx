"use client";

import { useGameStore } from "@/store/gameStore";

export default function TaskQueue() {
    const queue = useGameStore((state) => state.queue);

    if (queue.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-[var(--neon-green)] opacity-30 font-mono text-sm border border-dashed border-[var(--terminal-grid)]">
                <span>[EMPTY_BUFFER]</span>
                <span>WAITING_FOR_DATA...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 font-mono">
            {queue.map((task, index) => (
                <div
                    key={task.id}
                    className="group relative border-l-2 border-[var(--terminal-grid)] pl-4 py-2 hover:border-[var(--neon-pink)] transition-colors"
                >
                    {/* Index Marker */}
                    <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--terminal-bg)] border border-[var(--terminal-grid)] group-hover:bg-[var(--neon-pink)] transition-colors"></div>

                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 mb-1 group-hover:text-[var(--neon-pink)]">
                                ID: {task.id.slice(0, 8)}
                            </span>
                            <span className="text-sm text-[var(--neon-green)] glitch-hover">
                                {task.name}
                            </span>
                        </div>

                        {/* Time Estimate if available */}
                        {task.accumulatedTime > 0 && (
                            <span className="text-[10px] border border-[var(--neon-green)] px-1 text-[var(--neon-green)]">
                                {Math.floor(task.accumulatedTime / 60000)}m
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
