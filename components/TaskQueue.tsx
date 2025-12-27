"use client";

import { useGameStore } from '@/store/gameStore';

export default function TaskQueue() {
    const { queue, resumeTask } = useGameStore();
    const [sortMode, setSortMode] = useState<'newest' | 'category' | 'longest'>('newest');

    const sortedQueue = [...queue].sort((a, b) => {
        if (sortMode === 'newest') return 0; // Default (newest on top)
        if (sortMode === 'category') return (a.category || '').localeCompare(b.category || '');
        if (sortMode === 'longest') return b.accumulatedTime - a.accumulatedTime;
        return 0;
    });

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`; // Simplified for small cards
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-gray-500 font-mono font-bold text-sm">SUSPENDED_PROCESSES ({queue.length})</h2>
                <div className="flex-1 h-[1px] bg-gray-300"></div>
                <div className="flex gap-2 text-[10px] font-mono text-gray-400">
                    <button onClick={() => setSortMode('newest')} className={`hover:text-black ${sortMode === 'newest' ? 'text-black underline' : ''}`}>NEW</button>
                    <button onClick={() => setSortMode('category')} className={`hover:text-black ${sortMode === 'category' ? 'text-black underline' : ''}`}>CAT</button>
                    <button onClick={() => setSortMode('longest')} className={`hover:text-black ${sortMode === 'longest' ? 'text-black underline' : ''}`}>TIME</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {queue.length === 0 && (
                    <div className="h-40 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs font-mono">
                        QUEUE_EMPTY
                    </div>
                )}

                {sortedQueue.map((task) => (
                    <div
                        key={task.id}
                        className="os-window bg-white border border-gray-300 p-4 hover:border-[var(--accent-magenta)] group transition-all cursor-pointer relative"
                        onClick={() => resumeTask(task.id)}
                    >
                        {/* Resume Overlay */}
                        <div className="absolute inset-0 bg-[var(--accent-magenta)] opacity-0 group-hover:opacity-10 flex items-center justify-center transition-opacity"></div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--accent-magenta)] text-white text-xs px-2 py-1 font-bold">
                            RESUME
                        </div>

                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-1 font-mono uppercase">
                                {task.project}
                            </span>
                            <span className="font-mono text-gray-400 text-xs">
                                {task.accumulatedTime > 0 && formatTime(task.accumulatedTime)}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg leading-tight mb-1">{task.name}</h3>
                        <p className="text-xs text-gray-400 font-mono">{task.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
