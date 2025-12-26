"use client";

import { CompletedTask } from "@/store/gameStore";

export default function Heatmap({ tasks }: { tasks: CompletedTask[] }) {
    // Simple 24h heatmap for "Today"
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getIntensity = (hour: number) => {
        // Filter tasks that overlap with this hour today
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // Total seconds spent in this hour
        let totalSeconds = 0;

        tasks.forEach(t => {
            // Simplification: just check if completedAt falls in this hour
            // A better physics-accurate way would be checking the range [completedAt - duration, completedAt]
            // Let's do the range check for accuracy.

            const taskEnd = t.completedAt;
            const taskStart = t.completedAt - (t.totalDuration * 1000);

            // Hour range
            const hourStart = startOfDay + (hour * 3600 * 1000);
            const hourEnd = hourStart + (3600 * 1000);

            // Intersection
            const overlapStart = Math.max(taskStart, hourStart);
            const overlapEnd = Math.min(taskEnd, hourEnd);

            if (overlapEnd > overlapStart) {
                totalSeconds += (overlapEnd - overlapStart) / 1000;
            }
        });

        // Intensity 0-4
        if (totalSeconds === 0) return 0;
        if (totalSeconds < 60) return 1; // < 1 min
        if (totalSeconds < 600) return 2; // < 10 mins
        if (totalSeconds < 1800) return 3; // < 30 mins
        return 4; // > 30 mins
    };

    const getColors = (intensity: number) => {
        switch (intensity) {
            case 0: return 'bg-gray-100';
            case 1: return 'bg-[#e6ffcc]'; // Very light neon yellow
            case 2: return 'bg-[#ccff99]';
            case 3: return 'bg-[#b3ff66]';
            case 4: return 'bg-[#CCFF00]'; // Core Neon
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-12 gap-2">
                {hours.map(h => (
                    <div key={h} className="flex flex-col items-center gap-1">
                        <div
                            className={`w-full aspect-square ${getColors(getIntensity(h))} border-2 border-black`}
                            title={`${h}:00`}
                        />
                        <span className="text-[10px] font-bold text-gray-400">{h}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
