"use client";

import { CompletedTask } from "@/store/gameStore";

export default function CategoryPie({ tasks }: { tasks: CompletedTask[] }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const aggregation = tasks.reduce((acc, task) => {
        acc[task.name] = (acc[task.name] || 0) + task.totalDuration;
        return acc;
    }, {} as Record<string, number>);

    const sorted = Object.entries(aggregation)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Top 5

    const total = sorted.reduce((acc, [, val]) => acc + val, 0);

    if (total === 0) return <div className="p-4 text-center font-bold">NO DATA YET</div>;

    // Calculate slices
    let cumulativePercent = 0;
    const slices = sorted.map(([name, value], i) => {
        const percent = value / total;
        const startObj = getCoordinatesForPercent(cumulativePercent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cumulativePercent += percent;
        const endObj = getCoordinatesForPercent(cumulativePercent);

        // Large arc flag
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        // SVG Path
        const pathData = [
            `M 100 100`, // Center
            `L ${startObj.x} ${startObj.y}`,
            `A 100 100 0 ${largeArcFlag} 1 ${endObj.x} ${endObj.y}`,
            `Z`
        ].join(' ');

        return { name, value, pathData, percent };
    });

    return (
        <div className="w-full flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-36 h-36 shrink-0">
                <svg viewBox="-2 -2 204 204" className="w-full h-full">
                    {slices.map((slice, i) => (
                        <path
                            key={i}
                            d={slice.pathData}
                            fill={i % 2 === 0 ? '#CCFF00' : '#FF00CC'}
                            stroke="#000"
                            strokeWidth="4"
                        />
                    ))}
                </svg>
            </div>

            <div className="flex-1 w-full">
                <ul className="space-y-2">
                    {slices.map((slice, i) => (
                        <li key={i} className="flex items-center justify-between text-sm font-bold border-b-2 border-black pb-1">
                            <span className="truncate mr-4">
                                <span className={`inline-block w-3 h-3 mr-2 border-2 border-black ${i % 2 === 0 ? 'bg-[var(--neon-yellow)]' : 'bg-[var(--neon-pink)]'}`} />
                                {slice.name}
                            </span>
                            <span>{Math.round(slice.percent * 100)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function getCoordinatesForPercent(percent: number) {
    const x = 100 + 100 * Math.cos(2 * Math.PI * percent);
    const y = 100 + 100 * Math.sin(2 * Math.PI * percent);
    return { x, y };
}
