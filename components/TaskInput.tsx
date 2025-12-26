"use client";

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function TaskInput() {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const startNewTask = useGameStore((state) => state.startNewTask);
    const completedTasks = useGameStore((state) => state.completedTasks);

    // Unique history
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
        <div className="w-full max-w-2xl mx-auto p-4 z-10 relative">

            {/* Window Container */}
            <div className="os-window w-full bg-white shadow-xl">
                {/* Title Bar */}
                <div className="os-title-bar">
                    <span>TASK_ENTRY.exe</span>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 bg-white/20 rounded-full"></span>
                        <span className="w-3 h-3 bg-white/20 rounded-full"></span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 relative">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label htmlFor="task-input" className="sr-only">
                            Input new task
                        </label>
                        <div className="relative flex items-center border-b-2 border-black/10 focus-within:border-black transition-colors">
                            <span className="text-xl text-gray-400 font-mono mr-4">{'>'}</span>
                            <input
                                id="task-input"
                                type="text"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="TYPE_MISSION_HERE..."
                                className="w-full h-16 text-xl md:text-3xl font-mono bg-transparent outline-none placeholder:text-gray-300"
                                autoFocus
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="ml-4 bg-black text-white text-sm px-4 py-2 hover:bg-[var(--accent-magenta)] transition-colors"
                            >
                                EXECUTE
                            </button>
                        </div>
                    </form>

                    {/* Autocomplete Dropdown (Overlay) */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black z-20 shadow-lg">
                            {filteredSuggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelect(suggestion)}
                                    className="w-full text-left px-4 py-2 text-sm font-mono hover:bg-black hover:text-white border-b border-black/10 last:border-b-0"
                                >
                                    {'>'} {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Decoration: Barcode */}
            <div className="barcode-strip w-32 mt-4 ml-auto opacity-50"></div>
        </div>
    );
}
