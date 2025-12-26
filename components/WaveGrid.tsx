"use client";

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function WaveGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const completedTasks = useGameStore((state) => state.completedTasks);
    const [ripples, setRipples] = useState<{ id: string; x: number; y: number }[]>([]);
    const lastTaskCountRef = useRef(completedTasks.length);

    // Watch for new completed tasks and trigger ripple
    useEffect(() => {
        if (completedTasks.length > lastTaskCountRef.current) {
            // New task completed - trigger ripple
            const container = containerRef.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                const newRipple = {
                    id: crypto.randomUUID(),
                    x: rect.width / 2,
                    y: rect.height * 0.7, // Near bottom where grid appears
                };
                setRipples(prev => [...prev, newRipple]);

                // Remove ripple after animation
                setTimeout(() => {
                    setRipples(prev => prev.filter(r => r.id !== newRipple.id));
                }, 1500);
            }
        }
        lastTaskCountRef.current = completedTasks.length;
    }, [completedTasks.length]);

    return (
        <div
            ref={containerRef}
            className="wave-grid-container w-full h-full relative"
        >
            {/* 3D Perspective Grid */}
            <div className={`wave-grid ${ripples.length > 0 ? 'ripple' : ''}`} />

            {/* SVG Grid Lines for extra detail */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ transform: 'perspective(500px) rotateX(60deg)', transformOrigin: 'center bottom' }}
            >
                <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path
                            d="M 30 0 L 0 0 0 30"
                            fill="none"
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Ripple Circles */}
            {ripples.map(ripple => (
                <div
                    key={ripple.id}
                    className="ripple-circle"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                    }}
                />
            ))}

            {/* Title overlay */}
            <div className="absolute top-4 left-4 z-10">
                <h2 className="text-gray-400 font-mono font-bold text-xs tracking-widest">
                    ACHIEVEMENT_ZONE
                </h2>
            </div>
        </div>
    );
}
