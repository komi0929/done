"use client";

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function TaskInput() {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const startNewTask = useGameStore((state) => state.startNewTask);
    const completedTasks = useGameStore((state) => state.completedTasks);

    const history = Array.from(new Set(completedTasks.map(t => t.name)));

    const filteredSuggestions = input
        ? history.filter(h => h.toLowerCase().includes(input.toLowerCase()) && h !== input).slice(0, 5)
        : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        startNewTask(input, '', '');
        setInput('');
        setShowSuggestions(false);
    };

    const handleSelect = (val: string) => {
        startNewTask(val, '', '');
        setInput('');
        setShowSuggestions(false);
    };

    return (
        <div className="w-full relative z-20">
            {/* Terminal Box Container */}
            <div className="terminal-box p-4 bg-black/80">
                <div className="flex flex-col gap-2">

                    {/* Status Line */}
                    <div className="flex justify-between text-[10px] text-[var(--neon-green)] opacity-60 font-mono mb-2 border-b border-[var(--neon-green)] pb-1">
                        <span>MODE: INPUT_COMMAND</span>
                        <span>STATUS: READY</span>
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="flex items-center">
                            <span className="text-[var(--neon-pink)] mr-3 font-bold">{'>'}</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="ENTER_TASK..."
                                className="terminal-input w-full text-lg blinking-cursor"
                                autoFocus
                                autoComplete="off"
                            />
                        </div>
                    </form>

                    {/* Suggestions (Data Drop) */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-black border border-[var(--neon-green)] shadow-[0_0_10px_rgba(0,255,65,0.3)] z-30">
                            <div className="text-[10px] bg-[var(--neon-green)] text-black px-2 py-1 font-bold">
                                SUGGESTED_DATA
                            </div>
                            {filteredSuggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelect(suggestion)}
                                    className="w-full text-left px-4 py-2 text-sm font-mono text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black transition-colors block border-b border-[var(--neon-green)] last:border-0"
                                >
                                    {'>'} {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Helper Text */}
            <div className="mt-2 text-[10px] text-[var(--neon-green)] opacity-40">
                // PRESS ENTER TO EXECUTE
            </div>
        </div>
    );
}
