import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface BaseTask {
    id: string;
    name: string;
    project?: string;
    category?: string;
    accumulatedTime: number; // Time spent before current session
}

export interface ActiveTask extends BaseTask {
    startTime: number; // When the current session started
}

export interface QueuedTask extends BaseTask {
    lastPausedAt: number;
}

export interface CompletedTask extends BaseTask {
    completedAt: number;
    totalDuration: number;
}

interface GameState {
    activeTask: ActiveTask | null;
    queue: QueuedTask[];
    completedTasks: CompletedTask[];

    // Autocomplete History
    projectHistory: string[];
    categoryHistory: string[];

    // Actions
    startNewTask: (name: string, project: string, category: string) => void;
    resumeTask: (taskId: string) => void;
    finishCurrentTask: () => void;
    pauseCurrentTask: () => void; // Helper to move active to queue
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            activeTask: null,
            queue: [],
            completedTasks: [],
            projectHistory: [],
            categoryHistory: [],

            startNewTask: (name: string, project: string, category: string) => {
                const { activeTask, pauseCurrentTask, projectHistory, categoryHistory } = get();

                // If there's an active task, pause it (move to queue)
                if (activeTask) {
                    pauseCurrentTask();
                }

                // Start new active task
                const newTask: ActiveTask = {
                    id: crypto.randomUUID(),
                    name,
                    project,
                    category,
                    accumulatedTime: 0,
                    startTime: Date.now(),
                };

                // Update history (unique entries)
                const newProjectHistory = projectHistory.includes(project)
                    ? projectHistory
                    : [project, ...projectHistory].slice(0, 20); // Keep max 20
                const newCategoryHistory = categoryHistory.includes(category)
                    ? categoryHistory
                    : [category, ...categoryHistory].slice(0, 20);

                set({
                    activeTask: newTask,
                    projectHistory: newProjectHistory,
                    categoryHistory: newCategoryHistory,
                });
            },

            resumeTask: (taskId: string) => {
                const { activeTask, queue, pauseCurrentTask } = get();

                // Find task to resume
                const taskToResume = queue.find(t => t.id === taskId);
                if (!taskToResume) return;

                // Pause active if exists
                if (activeTask) {
                    pauseCurrentTask();
                }

                // Remove from queue
                const newQueue = get().queue.filter(t => t.id !== taskId);

                // Set as active
                const resumed: ActiveTask = {
                    ...taskToResume,
                    startTime: Date.now(),
                };

                set({
                    activeTask: resumed,
                    queue: newQueue
                });
            },

            pauseCurrentTask: () => {
                const { activeTask, queue } = get();
                if (!activeTask) return;

                const now = Date.now();
                const sessionDuration = (now - activeTask.startTime) / 1000;

                const queued: QueuedTask = {
                    id: activeTask.id,
                    name: activeTask.name,
                    project: activeTask.project,
                    category: activeTask.category,
                    accumulatedTime: activeTask.accumulatedTime + sessionDuration,
                    lastPausedAt: now,
                };

                set({
                    activeTask: null,
                    queue: [queued, ...queue] // Add to top of queue
                });
            },

            finishCurrentTask: () => {
                const { activeTask, completedTasks } = get();
                if (!activeTask) return;

                const now = Date.now();
                const sessionDuration = (now - activeTask.startTime) / 1000;
                const totalDuration = activeTask.accumulatedTime + sessionDuration;

                const completed: CompletedTask = {
                    id: activeTask.id,
                    name: activeTask.name,
                    project: activeTask.project,
                    category: activeTask.category,
                    accumulatedTime: activeTask.accumulatedTime,
                    completedAt: now,
                    totalDuration,
                };

                set({
                    completedTasks: [...completedTasks, completed],
                    activeTask: null,
                });
            }
        }),
        {
            name: 'done-os-storage-v2', // Versioned up storage
            storage: createJSONStorage(() => localStorage),
        }
    )
);
