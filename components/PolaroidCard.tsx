"use client";

import { useState } from 'react';

interface PolaroidCardProps {
    imageSrc?: string;
    title?: string;
    rotation?: number;
    className?: string;
}

export default function PolaroidCard({
    imageSrc,
    title = "TASK COMPLETE",
    rotation = 0,
    className = ""
}: PolaroidCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Random subtle rotation if not specified
    const cardRotation = rotation || (Math.random() - 0.5) * 16;

    return (
        <div
            className={`polaroid-card cursor-pointer ${className}`}
            style={{
                transform: `rotate(${isHovered ? cardRotation * 0.5 : cardRotation}deg)`,
                width: '180px',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Area */}
            <div
                className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 mb-3 flex items-center justify-center overflow-hidden"
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-4xl opacity-30">✓</div>
                )}
            </div>

            {/* Caption */}
            <p className="text-xs font-mono text-center text-gray-600 truncate px-1">
                {title}
            </p>
        </div>
    );
}

// Preset rotations for stacked effect
export const cardRotations = [-8, 5, 12, -3, 7, -10];

// Stacked Polaroids Component
export function PolaroidStack({
    tasks
}: {
    tasks: { id: string; name: string }[]
}) {
    const displayTasks = tasks.slice(-5); // Show last 5 tasks

    if (displayTasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-300 font-mono text-sm">
                <p>NO MEMORIES YET</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {displayTasks.map((task, index) => (
                <div
                    key={task.id}
                    className="absolute"
                    style={{
                        zIndex: index,
                        transform: `translate(${(index - 2) * 20}px, ${(index - 2) * 10}px)`,
                    }}
                >
                    <PolaroidCard
                        title={task.name}
                        rotation={cardRotations[index % cardRotations.length]}
                    />
                </div>
            ))}

            {/* Dotted connections (optional) */}
            <svg className="absolute inset-0 pointer-events-none opacity-20">
                <line
                    x1="30%" y1="40%"
                    x2="70%" y2="60%"
                    stroke="#000"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />
            </svg>
        </div>
    );
}
