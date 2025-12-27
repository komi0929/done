"use client";

import { useGameStore } from "@/store/gameStore";
import Heatmap from "./Analytics/Heatmap";
import CategoryPie from "./Analytics/CategoryPie";
import { useAuth } from "@/components/AuthProvider";

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SummaryModal({ isOpen, onClose }: SummaryModalProps) {
    const { completedTasks, queue, activeTask } = useGameStore();
    const { user } = useAuth();

    if (!isOpen) return null;

    // Filter Tasks (Today vs All)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const todaysTasks = completedTasks.filter(t => t.completedAt >= startOfDay);

    // Daily Stats
    const dailySeconds = todaysTasks.reduce((acc, t) => acc + t.totalDuration, 0);
    const dailyHours = Math.floor(dailySeconds / 3600);
    const dailyMins = Math.floor((dailySeconds % 3600) / 60);

    // Lifetime Stats
    const totalSeconds = completedTasks.reduce((acc, t) => acc + t.totalDuration, 0);
    const totalHours = Math.floor(totalSeconds / 3600);

    const avgDuration = todaysTasks.length > 0
        ? Math.round(dailySeconds / todaysTasks.length / 60)
        : 0;

    const todayStr = now.toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    // Sort tasks by duration (longest first) for display
    const sortedTasks = [...todaysTasks].sort((a, b) => b.totalDuration - a.totalDuration);

    const generateFeedback = () => {
        if (todaysTasks.length === 0) {
            return "NO_DATA_FOUND_TODAY. INITIATE_MISSION.";
        }
        if (dailySeconds > 4 * 3600) {
            return `EXCELLENT_FOCUS: ${dailyHours}H ${dailyMins}M DEEP_WORK DETECTED.`;
        }
        if (todaysTasks.length >= 5) {
            return `${todaysTasks.length} PROCESSES TERMINATED. EFFICIENCY OPTIMAL.`;
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
            <div className="terminal-box w-full max-w-5xl animate-in fade-in zoom-in duration-200 z-10 flex flex-col max-h-[90vh]">

                {/* Title Bar */}
                <div className="flex justify-between items-center p-2 border-b border-[var(--grid-color)] bg-[var(--bg-color)]/50">
                    <div className="flex gap-2 items-center text-xs font-bold text-[var(--text-color)]">
                        <span>📊 {user ? `COMMANDER_${user.email?.split('@')[0].toUpperCase()}_LOG` : 'DAILY_REPORT_LOG'}</span>
                        <span className="animate-pulse">_</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2 text-[var(--text-color)] hover:text-[var(--accent-primary)] transition-colors font-bold"
                    >
                        [CLOSE]
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 font-mono text-sm relative text-[var(--text-color)]">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b border-[var(--grid-color)] pb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1 tracking-widest">{user ? 'MISSION_STATUS' : 'DAILY_REPORT_LOG'}</h1>
                            <p className="opacity-70 text-xs text-[var(--accent-secondary)]">{todayStr}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs opacity-50">SESSION_ID</div>
                            <div className="font-bold text-[var(--accent-primary)]">
                                {user ? user.id.slice(0, 8).toUpperCase() : Date.now().toString().slice(-8)}
                            </div>
                        </div>
                    </div>

                    {/* Key Stats Grid (Daily) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="border border-[var(--grid-color)] p-4 bg-[var(--bg-color)]/20">
                            <div className="text-[10px] opacity-70 uppercase mb-1">TODAY_FOCUS</div>
                            <div className="text-2xl font-bold text-[var(--accent-primary)]">
                                {dailyHours}h {dailyMins}m
                            </div>
                        </div>
                        <div className="border border-[var(--grid-color)] p-4 bg-[var(--bg-color)]/20">
                            <div className="text-[10px] opacity-70 uppercase mb-1">TODAY_TASKS</div>
                            <div className="text-2xl font-bold text-[var(--accent-secondary)]">
                                {todaysTasks.length}
                            </div>
                        </div>
                        <div className="border border-[var(--grid-color)] p-4 bg-[var(--bg-color)]/20">
                            <div className="text-[10px] opacity-70 uppercase mb-1">AVG_DURATION</div>
                            <div className="text-2xl font-bold">
                                {avgDuration}m
                            </div>
                        </div>
                        <div className="border border-[var(--grid-color)] p-4 bg-[var(--bg-color)]/20">
                            <div className="text-[10px] opacity-70 uppercase mb-1">SYSTEM_QUEUE</div>
                            <div className="text-2xl font-bold text-[var(--accent-primary)]">
                                {queue.length}{activeTask ? '+1' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Lifetime Stats Row (If User) */}
                    {user && (
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="border border-[var(--accent-primary)]/30 p-2 bg-[var(--accent-primary)]/5 flex justify-between items-center px-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">LIFETIME_TASKS</span>
                                <span className="text-xl font-black">{completedTasks.length}</span>
                            </div>
                            <div className="border border-[var(--accent-primary)]/30 p-2 bg-[var(--accent-primary)]/5 flex justify-between items-center px-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">TOTAL_HOURS</span>
                                <span className="text-xl font-black">{totalHours}H</span>
                            </div>
                        </div>
                    )}


                    {/* AI Feedback Banner */}
                    <div className="border border-[var(--accent-secondary)] p-4 mb-8 shadow-[var(--box-shadow-glow)]">
                        <div className="flex items-start gap-3">
                            <div className="text-xl">🤖</div>
                            <div>
                                <div className="text-[10px] text-[var(--accent-secondary)] mb-1">AI_ANALYSIS_RESULT</div>
                                <p className="font-bold">{generateFeedback()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout: Task List + Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                        {/* Completed Task List */}
                        <div className="border border-[var(--grid-color)] p-4">
                            <h3 className="font-bold text-xs mb-4 border-b border-[var(--grid-color)] pb-2 text-[var(--text-color)]">
                                TODAY'S_LOG ({todaysTasks.length})
                            </h3>
                            {todaysTasks.length === 0 ? (
                                <p className="opacity-50 text-center py-8 text-xs">NO_DATA_AVAILABLE</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--text-color)] scrollbar-track-[var(--grid-color)]">
                                    {sortedTasks.map((task, idx) => (
                                        <div key={task.id} className="flex justify-between items-center py-2 border-b border-[var(--grid-color)] last:border-b-0 hover:bg-[var(--bg-color)]/10 px-2 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] opacity-50">#{idx + 1}</span>
                                                    <span className="font-bold truncate text-xs">{task.name}</span>
                                                </div>
                                                <div className="text-[10px] opacity-70">
                                                    {task.project} / {task.category}
                                                </div>
                                            </div>
                                            <div className="text-right font-mono font-bold text-[var(--accent-primary)] text-xs">
                                                {formatDuration(task.totalDuration)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Distribution Chart */}
                        <div className="border border-[var(--grid-color)] p-4">
                            <h3 className="font-bold text-xs mb-4 border-b border-[var(--grid-color)] pb-2 text-[var(--text-color)]">
                                TIME_DISTRIBUTION
                            </h3>
                            <div className="opacity-80">
                                <CategoryPie tasks={todaysTasks} />
                            </div>
                        </div>

                    </div>

                    {/* Heatmap */}
                    <div className="border border-[var(--grid-color)] p-4 mb-8">
                        <h3 className="font-bold text-xs mb-4 border-b border-[var(--grid-color)] pb-2 text-[var(--text-color)]">
                            24H_ACTIVITY_MAP (TODAY)
                        </h3>
                        <div className="opacity-80 hover:grayscale-0 transition-all">
                            <Heatmap tasks={todaysTasks} />
                        </div>
                    </div>

                    {/* Data Warning Footer (Only if NOT logged in) */}
                    {!user && (
                        <div className="border border-red-900 bg-red-900/10 p-4 flex items-start gap-4">
                            <div className="text-red-500">⚠</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-red-500 text-xs">DATA_VOLATILITY_WARNING</h4>
                                <p className="text-[10px] opacity-70 mt-1">
                                    GUEST_MODE_DETECTED. LOCAL_STORAGE_IS_TEMPORARY. SIGN_IN_TO_ARCHIVE_DATA.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

