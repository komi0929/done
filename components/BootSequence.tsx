"use client";

import { useEffect, useState } from 'react';

export default function BootSequence() {
    const [visible, setVisible] = useState(true);
    const [lines, setLines] = useState<string[]>([]);

    const bootText = [
        "BIOS DATE 01/01/99 15:22:00 VER 1.02",
        "CPU: NEC V60, SPEED: 16 MHz",
        "640K RAM SYSTEM ... OK",
        "INITIALIZING VIDEO ADAPTER ... OK",
        "LOADING SYSTEM ...",
        "MOUNTING VOLUMES ...",
        "SYSTEM READY."
    ];

    useEffect(() => {
        let delay = 0;
        bootText.forEach((text, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                setLines(prev => [...prev, text]);
                if (index === bootText.length - 1) {
                    setTimeout(() => setVisible(false), 800);
                }
            }, delay);
        });
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black text-[var(--neon-green)] font-mono text-sm p-8 cursor-none flex flex-col justify-end pb-20">
            {lines.map((line, i) => (
                <div key={i}>{line}</div>
            ))}
            <div className="animate-pulse">_</div>
        </div>
    );
}
