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

    // Generate AI-style feedback
    const generateFeedback = () => {
        if (completedTasks.length === 0) {
            return "本日はまだタスクが完了していません。最初の一歩を踏み出しましょう！";
        }
        if (totalSeconds > 4 * 3600) { // > 4 hours
            return `素晴らしい集中力です！${hours}時間${mins}分のディープワークは大きな成果につながります。`;
        }
        if (completedTasks.length >= 5) {
            return `${completedTasks.length}個のタスクを完了！小さな勝利の積み重ねが大きな成功を生みます。`;
        }
        return "良いペースです。次のタスクに取り組んで、さらにブロックを積み上げましょう！";
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
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            {/* OS Window Modal */}
            <div className="os-window w-full max-w-5xl shadow-2xl animate-in fade-in zoom-in duration-200 z-10">

                {/* Title Bar */}
                <div className="os-title-bar">
                    <div className="flex gap-2 items-center">
                        <span>📊 DAILY_REPORT.exe</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-2 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        [X]
                    </button>
                </div>

                {/* Content */}
                <div className="os-content bg-[#F5F5FA] max-h-[85vh] overflow-y-auto font-mono text-sm p-6">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-black mb-1">DAILY REPORT</h1>
                            <p className="text-gray-500 text-xs">{today}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400">SESSION_ID</div>
                            <div className="font-bold">{Date.now().toString().slice(-8)}</div>
                        </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-400 uppercase mb-1">総集中時間</div>
                            <div className="text-3xl font-black text-[var(--accent-magenta)]">
                                {hours}h {mins}m
                            </div>
                        </div>
                        <div className="bg-white p-4 border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-400 uppercase mb-1">完了タスク</div>
                            <div className="text-3xl font-black text-[var(--accent-cyan)]">
                                {completedTasks.length}
                            </div>
                        </div>
                        <div className="bg-white p-4 border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-400 uppercase mb-1">平均所要時間</div>
                            <div className="text-3xl font-black">
                                {avgDuration}m
                            </div>
                        </div>
                        <div className="bg-white p-4 border border-gray-200 shadow-sm">
                            <div className="text-xs text-gray-400 uppercase mb-1">待機中</div>
                            <div className="text-3xl font-black text-orange-500">
                                {queue.length}{activeTask ? '+1' : ''}
                            </div>
                        </div>
                    </div>

                    {/* AI Feedback Banner */}
                    <div className="bg-gradient-to-r from-[var(--accent-magenta)] to-[var(--accent-cyan)] text-white p-4 mb-8 shadow-lg">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">🤖</div>
                            <div>
                                <div className="text-xs opacity-75 mb-1">AI_FEEDBACK</div>
                                <p className="font-bold">{generateFeedback()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout: Task List + Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                        {/* Completed Task List */}
                        <div className="bg-white border border-gray-200 p-4 shadow-sm">
                            <h3 className="font-bold text-sm mb-4 border-b border-gray-200 pb-2">
                                完了タスク一覧 ({completedTasks.length})
                            </h3>
                            {completedTasks.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">NO_DATA</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {sortedTasks.map((task, idx) => (
                                        <div key={task.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400">#{idx + 1}</span>
                                                    <span className="font-bold truncate">{task.name}</span>
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {task.project} / {task.category}
                                                </div>
                                            </div>
                                            <div className="text-right font-mono font-bold text-[var(--accent-magenta)]">
                                                {formatDuration(task.totalDuration)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Distribution Chart */}
                        <div className="bg-white border border-gray-200 p-4 shadow-sm">
                            <h3 className="font-bold text-sm mb-4 border-b border-gray-200 pb-2">
                                時間配分
                            </h3>
                            <CategoryPie tasks={completedTasks} />
                        </div>

                    </div>

                    {/* Heatmap */}
                    <div className="bg-white border border-gray-200 p-4 shadow-sm mb-8">
                        <h3 className="font-bold text-sm mb-4 border-b border-gray-200 pb-2">
                            24時間 アクティビティマップ
                        </h3>
                        <Heatmap tasks={completedTasks} />
                    </div>

                    {/* Data Warning Footer */}
                    <div className="bg-gray-900 text-white p-4 flex items-start gap-4 rounded">
                        <div className="text-xl">💾</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-[var(--accent-cyan)] text-sm">DATA_PERSISTENCE</h4>
                            <p className="text-xs text-gray-300 mt-1">
                                データはブラウザのLocalStorageに保存されています。
                                キャッシュクリアでデータが失われる可能性があります。
                            </p>
                        </div>
                        <button className="bg-[var(--accent-magenta)] text-white text-xs font-bold px-4 py-2 hover:brightness-110 transition-all">
                            EXPORT_CSV
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
