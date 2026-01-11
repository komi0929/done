"use client";

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function SimpleTaskStack() {
    const {
        activeTask,
        queue,
        startNewTask,
        resumeTask,
        finishCurrentTask
    } = useGameStore();

    const [input, setInput] = useState("");

    // Combine active and queue for display
    // Visual Order: Active (Bottom-most? User said "vertical box". Stacking usually means piling up.)
    // But lists usually go Top -> Bottom.
    // Let's interpret "Vertical Box" as a container where blocks drop in. 
    // New items usually at the top or bottom?
    // Let's put INPUT at the Top. Blocks appear below. 
    // Stack: Active, then Queue.

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Start new task (pushes current active to queue)
        startNewTask(input, "General", "Task");
        setInput("");
    };

    const handleDoubleClick = async (taskId: string, isActive: boolean) => {
        if (isActive) {
            await finishCurrentTask();
        } else {
            // It's in queue. Make it active then finish it.
            resumeTask(taskId);
            // Small delay to ensure state update if needed, though zustand is usually sync
            // But finishCurrentTask checks get().activeTask
            await finishCurrentTask();
        }
    };

    // Prepare display list
    // If we want a "Stack", maybe Active is at the BOTTOM? 
    // Or Active is at the TOP (Focus). I'll put Active at the TOP.

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto p-4 gap-4">

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="タスクを入力..."
                    className="w-full border-2 border-black p-4 font-mono text-xl font-bold placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors"
                    autoFocus
                />
            </form>

            {/* Vertical Box Container */}
            <div className="flex-1 border-2 border-black p-4 overflow-y-auto flex flex-col gap-2 relative bg-white">
                {/* Background Pattern or Label */}
                {(!activeTask && queue.length === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <span className="font-black text-6xl text-gray-300 rotate-45 transform">空</span>
                    </div>
                )}

                {/* Active Task (The Focus) */}
                {activeTask && (
                    <div
                        onDoubleClick={() => handleDoubleClick(activeTask.id, true)}
                        className="border-2 border-black bg-black text-white p-6 cursor-pointer hover:scale-[1.02] transition-transform select-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                        <div className="text-[10px] font-mono mb-1 text-gray-400">実行中 /// ダブルクリックで完了</div>
                        <div className="font-bold text-2xl leading-none break-words">{activeTask.name}</div>
                    </div>
                )}

                {/* Queue (The Stack) */}
                {queue.map((task) => (
                    <div
                        key={task.id}
                        onDoubleClick={() => handleDoubleClick(task.id, false)}
                        className="border-2 border-black bg-white p-4 cursor-pointer hover:bg-gray-50 hover:translate-x-1 transition-all select-none opacity-60 hover:opacity-100"
                    >
                        <div className="font-bold text-lg leading-none break-words">{task.name}</div>
                    </div>
                ))}
            </div>

            <div className="text-center text-[10px] font-mono text-gray-400">
                ブロックをダブルクリックして完了
            </div>
        </div>
    );
}
