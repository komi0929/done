"use client";

import { useGameStore } from "@/store/gameStore";
import Heatmap from "./Analytics/Heatmap";
import CategoryPie from "./Analytics/CategoryPie";

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SummaryModal({ isOpen, onClose }: SummaryModalProps) {
    const { completedTasks, queue, activeTask } = useGameStore();

    if (!isOpen) return null;

    // Calculations
    const totalSeconds = completedTasks.reduce((acc, t) => acc + t.totalDuration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const avgDuration = completedTasks.length > 0
        ? Math.round(totalSeconds / completedTasks.length / 60)
        : 0;

    const today = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    // Sort tasks by duration (longest first) for display
    const sortedTasks = [...completedTasks].sort((a, b) => b.totalDuration - a.totalDuration);

    const generateFeedback = () => {
        if (completedTasks.length === 0) {
            return "NO_DATA_FOUND. INITIATE_FIRST_MISSION.";
        }
        if (totalSeconds > 4 * 3600) {
            return `EXCELLENT_FOCUS: ${hours}H ${mins}M DEEP_WORK DETECTED.`;
        }
        if (completedTasks.length >= 5) {
            return `${completedTasks.length} PROCESSES TERMINATED. EFFICIENCY OPTIMAL.`;
        }
        return "SYSTEM_STABLE. CONTINUE OPERATIONS.";
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Terminal Window Modal */}
            <div className="terminal-box w-full max-w-5xl shadow-[0_0_50px_rgba(0,255,65,0.1)] animate-in fade-in zoom-in duration-200 z-10 bg-black text-[var(--neon-green)] flex flex-col max-h-[90vh]">

                {/* Title Bar */}
                <div className="flex justify-between items-center p-2 border-b border-[var(--terminal-grid)] bg-[var(--terminal-grid)]">
                    <div className="flex gap-2 items-center text-xs font-bold text-white">
                        <span>📊 DAILY_REPORT_LOG</span>
                        <span className="animate-pulse">_</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2 text-[var(--neon-green)] hover:text-[var(--neon-pink)] transition-colors font-bold"
                    >
                        [CLOSE]
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 font-mono text-sm relative">
                    {/* Scanline overlay for modal */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.25)50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b border-[var(--terminal-grid)] pb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1 tracking-widest text-shadow-green">DAILY_REPORT_LOG</h1>
                            <p className="opacity-70 text-xs text-[var(--neon-blue)]">{today}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs opacity-50">SESSION_ID</div>
                            <div className="font-bold text-[var(--neon-pink)]">{Date.now().toString().slice(-8)}</div>
                        </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="border border-[var(--terminal-grid)] p-4 bg-[rgba(0,255,65,0.05)]">
                            <div className="text-[10px] opacity-70 uppercase mb-1">TOTAL_FOCUS_TIME</div>
                            <div className="text-2xl font-bold text-[var(--neon-pink)]">
                                {hours}h {mins}m
                            </div>
                        </div>
                        <div className="border border-[var(--terminal-grid)] p-4 bg-[rgba(0,255,255,0.05)]">
                            <div className="text-[10px] opacity-70 uppercase mb-1">COMPLETED_TASKS</div>
                            <div className="text-2xl font-bold text-[var(--neon-cyan)]">
                                {completedTasks.length}
                            </div>
                        </div>
                        <div className="border border-[var(--terminal-grid)] p-4">
                            <div className="text-[10px] opacity-70 uppercase mb-1">AVG_DURATION</div>
                            <div className="text-2xl font-bold">
                                {avgDuration}m
                            </div>
                        </div>
                        <div className="border border-[var(--terminal-grid)] p-4">
                            <div className="text-[10px] opacity-70 uppercase mb-1">SYSTEM_QUEUE</div>
                            <div className="text-2xl font-bold text-[var(--neon-yellow)]">
                                {queue.length}{activeTask ? '+1' : ''}
                            </div>
                        </div>
                    </div>

                    {/* AI Feedback Banner */}
                    <div className="border border-[var(--neon-blue)] p-4 mb-8 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                        <div className="flex items-start gap-3">
                            <div className="text-xl">🤖</div>
                            <div>
                                <div className="text-[10px] text-[var(--neon-blue)] mb-1">AI_ANALYSIS_RESULT</div>
                                <p className="font-bold text-white">{generateFeedback()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout: Task List + Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                        {/* Completed Task List */}
                        <div className="border border-[var(--terminal-grid)] p-4">
                            <h3 className="font-bold text-xs mb-4 border-b border-[var(--terminal-grid)] pb-2 text-[var(--neon-green)]">
                                TASK_EXECUTION_LOG ({completedTasks.length})
                            </h3>
                            {completedTasks.length === 0 ? (
                                <p className="opacity-50 text-center py-8 text-xs">NO_DATA_AVAILABLE</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--neon-green)] scrollbar-track-transparent">
                                    {sortedTasks.map((task, idx) => (
                                        <div key={task.id} className="flex justify-between items-center py-2 border-b border-[var(--terminal-grid)] last:border-b-0 hover:bg-[rgba(0,255,65,0.1)] px-2 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] opacity-50">#{idx + 1}</span>
                                                    <span className="font-bold truncate text-xs">{task.name}</span>
                                                </div>
                                                <div className="text-[10px] opacity-70">
                                                    {task.project} / {task.category}
                                                </div>
                                            </div>
                                            <div className="text-right font-mono font-bold text-[var(--neon-pink)] text-xs">
                                                {formatDuration(task.totalDuration)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Distribution Chart */}
                        <div className="border border-[var(--terminal-grid)] p-4">
                            <h3 className="font-bold text-xs mb-4 border-b border-[var(--terminal-grid)] pb-2 text-[var(--neon-green)]">
                                TIME_DISTRIBUTION
                            </h3>
                            <div className="opacity-80">
                                <CategoryPie tasks={completedTasks} />
                            </div>
                        </div>

                    </div>

                    {/* Heatmap */}
                    <div className="border border-[var(--terminal-grid)] p-4 mb-8">
                        <h3 className="font-bold text-xs mb-4 border-b border-[var(--terminal-grid)] pb-2 text-[var(--neon-green)]">
                            24H_ACTIVITY_MAP
                        </h3>
                        <div className="opacity-80 grayscale hover:grayscale-0 transition-all">
                            <Heatmap tasks={completedTasks} />
                        </div>
                    </div>

                    {/* Data Warning Footer */}
                    <div className="border border-red-900 bg-red-900/10 p-4 flex items-start gap-4">
                        <div className="text-red-500">⚠</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-red-500 text-xs">DATA_PERSISTENCE_WARNING</h4>
                            <p className="text-[10px] opacity-70 mt-1">
                                LOCAL_STORAGE_DETECTED. CLEARING_CACHE_WILL_RESULT_IN_DATA_LOSS.
                            </p>
                        </div>
                        <button className="border border-red-500 text-red-500 text-[10px] px-4 py-2 hover:bg-red-500 hover:text-black transition-all uppercase">
                            EXPORT_CSV
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
