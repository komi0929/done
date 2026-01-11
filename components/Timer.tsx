"use client";

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function Timer() {
    const activeTask = useGameStore((state) => state.activeTask);
    const finishCurrentTask = useGameStore((state) => state.finishCurrentTask);
    const [elapsed, setElapsed] = useState(0);
    const [showSwitchModal, setShowSwitchModal] = useState(false);
    const [randomStats, setRandomStats] = useState({ cpu: 10, mem: 400 });

    const startTime = activeTask?.startTime;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRandomStats({
            cpu: Math.random() * 10 + 10,
            mem: Math.random() * 200 + 400
        });
    }, []);

    useEffect(() => {
        if (!startTime) return;
        const interval = setInterval(() => {
            setElapsed((Date.now() - startTime) / 1000);
        }, 100);
        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        // Deciseconds for that "tech" feel
        const ds = Math.floor((seconds % 1) * 10);

        const parts = [];
        if (h > 0) parts.push(h.toString().padStart(2, '0'));
        parts.push(m.toString().padStart(2, '0'));
        parts.push(s.toString().padStart(2, '0'));

        return parts.join(':') + `.${ds}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 bg-[var(--background)]">

            {/* Background Decor: Marquee or Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, #000 25%, #000 26%, transparent 27%, transparent 74%, #000 75%, #000 76%, transparent 77%)',
                    backgroundSize: '30px 30px'
                }}>
            </div>

            {/* Main Alert Window */}
            <div className="os-window w-full max-w-4xl shadow-2xl bg-white border-2 border-black z-10 relative">
                <div className="os-title-bar bg-black text-white px-4 py-2 flex justify-between">
                    <span>SYSTEM_MONITOR :: EXECUTING_TASK</span>
                    <span className="animate-pulse">● REC</span>
                </div>

                <div className="p-8 md:p-12 flex flex-col items-center text-center">

                    {/* Switch Button (Top Right Absolute) */}
                    <button
                        onClick={() => setShowSwitchModal(true)}
                        className="absolute top-12 right-6 md:right-12 w-12 h-12 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        title="SWITCH_PROCESS"
                    >
                        +
                    </button>

                    <h2 className="text-xl md:text-2xl font-mono text-gray-500 mb-6 tracking-widest">
                        CURRENT_PROCESS_ID: {startTime?.toString().slice(-6)}
                    </h2>

                    <h1 className="text-4xl md:text-6xl font-black mb-8 border-b-4 border-black pb-4 w-full">
                        {activeTask?.name}
                    </h1>

                    <div className="text-[12vw] md:text-9xl font-mono font-bold tracking-tighter tabular-nums mb-12 text-[var(--foreground)]">
                        {formatTime(elapsed)}
                    </div>

                    <button
                        onClick={finishCurrentTask}
                        className="group relative px-12 py-4 bg-transparent border-2 border-black overflow-hidden"
                    >
                        <div className="absolute inset-0 w-full h-full bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out"></div>
                        <span className="relative text-2xl font-bold group-hover:text-white transition-colors uppercase tracking-widest">
                            COMPLETE_TASK
                        </span>
                    </button>

                    {/* Footer Stats */}
                    <div className="mt-8 flex gap-8 text-xs font-mono text-gray-400">
                        <span>CPU: {randomStats.cpu.toFixed(1)}%</span>
                        <span>MEM: {randomStats.mem.toFixed(0)}MB</span>
                    </div>
                </div>
            </div>

            {/* Switch Modal (System Dialog) */}
            {showSwitchModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="os-window max-w-md w-full shadow-2xl">
                        <div className="os-title-bar bg-[var(--accent-magenta)] text-white">
                            <span>INTERRUPT_REQUEST</span>
                            <button onClick={() => setShowSwitchModal(false)}>X</button>
                        </div>
                        <div className="p-6">
                            <p className="text-lg font-bold mb-6">
                                Abort current process and switch context?
                                <br />
                                <span className="text-sm font-normal text-gray-500">Current progress will be saved.</span>
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowSwitchModal(false)}
                                    className="px-6 py-2 border border-black hover:bg-gray-100"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={finishCurrentTask}
                                    className="px-6 py-2 bg-[var(--accent-magenta)] text-white border border-black hover:opacity-90"
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
