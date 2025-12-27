import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

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
    theme: 'default' | 'retro';

    // Actions
    startNewTask: (name: string, project: string, category: string) => void;
    resumeTask: (taskId: string) => void;
    finishCurrentTask: () => Promise<void>;
    toggleTheme: () => void;
    pauseCurrentTask: () => void; // Helper to move active to queue
    removeFromHistory: (type: 'project' | 'category', value: string) => void;

    // Supabase Sync
    fetchUserTasks: (userId: string) => Promise<void>;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            activeTask: null,
            queue: [],
            completedTasks: [],
            projectHistory: [],
            categoryHistory: [],
            theme: 'retro', // Default to retro initially

            startNewTask: (name: string, project: string, category: string) => {
                const { activeTask, pauseCurrentTask, projectHistory, categoryHistory } = get();

                // If there's an active task, pause it (move to queue)
                if (activeTask) {
                    pauseCurrentTask();
                }

                // Start new active task
                const newTask: ActiveTask = {
                    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
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

            finishCurrentTask: async () => {
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

                // Optimistic update
                set({
                    completedTasks: [...completedTasks, completed],
                    activeTask: null,
                });

                // Sync to Supabase if user is logged in
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('completed_tasks').insert({
                        user_id: user.id,
                        title: completed.name,
                        duration: Math.round(completed.totalDuration),
                        completed_at: new Date(completed.completedAt).toISOString(),
                        block_type: 'default' // later custom skins
                    });

                    // Also update profile total_tasks
                    await supabase.rpc('increment_total_tasks', { user_id: user.id }).catch(() => {
                        // fallback if rpc not exists or fails (we haven't created it yet, maybe just ignore or do count)
                        // Actually let's just insert for now.
                    });
                }
            },

            fetchUserTasks: async (userId: string) => {
                const { data, error } = await supabase
                    .from('completed_tasks')
                    .select('*')
                    .eq('user_id', userId)
                    .order('completed_at', { ascending: true }); // oldest first to stack up? or newest? Stack usually builds up. 

                if (!error && data) {
                    const tasks: CompletedTask[] = data.map((t: any) => ({
                        id: t.id,
                        name: t.title,
                        project: 'Archived', // Schema didn't have project/category yet, maybe add later or default
                        category: 'Archived',
                        accumulatedTime: t.duration,
                        totalDuration: t.duration,
                        completedAt: new Date(t.completed_at).getTime(),
                    }));
                    set({ completedTasks: tasks });
                }
            },

            removeFromHistory: (type, value) => {
                const { projectHistory, categoryHistory } = get();
                if (type === 'project') {
                    set({ projectHistory: projectHistory.filter(h => h !== value) });
                } else {
                    set({ categoryHistory: categoryHistory.filter(h => h !== value) });
                }
            },

            toggleTheme: () => set((state) => ({ theme: state.theme === 'retro' ? 'default' : 'retro' })),
        }),
        {
            name: 'done-os-storage-v2', // Versioned up storage
            storage: createJSONStorage(() => localStorage),
        }
    )
);
