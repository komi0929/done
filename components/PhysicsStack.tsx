"use client";

import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import { useGameStore, CompletedTask } from '@/store/gameStore';

export default function PhysicsStack() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);

    const completedTasks = useGameStore((state) => state.completedTasks);
    const theme = useGameStore((state) => state.theme);
    const spawnedTaskIdsRef = useRef<Set<string>>(new Set());

    // Helper to add block - tracking refs
    const addTaskBlock = useCallback((task: CompletedTask) => {
        if (!engineRef.current || !renderRef.current) return;

        const Bodies = Matter.Bodies;
        const Composite = Matter.Composite;
        const { canvas } = renderRef.current;

        // Updated width/height logic for 3-column layout
        const width = 120;
        const height = Math.max(30, (task.totalDuration / 60) * 10);

        // Styling based on theme (captured at spawn time, but we'll try to make it dynamic if possible, 
        // or just accept that spawned blocks keep their style until reload. 
        // Better: store the body references and update them when theme changes)
        // For now, simpler approach: Spawn with current theme styles.
        const isRetro = theme === 'retro';

        const body = Bodies.rectangle(
            canvas.width / 2 + (Math.random() - 0.5) * 40,
            -height - 50,
            width,
            height,
            {
                restitution: 0.2,
                friction: 0.8,
                angle: (Math.random() - 0.5) * 0.1,
                chamfer: { radius: isRetro ? 0 : 4 }, // Rounded for default
                render: {
                    fillStyle: isRetro ? 'transparent' : '#ffffff',
                    strokeStyle: isRetro ? '#00ff41' : '#000000',
                    lineWidth: 2,
                },
                // @ts-ignore
                plugin: {
                    taskName: task.name
                }
            }
        );

        Composite.add(engineRef.current.world, body);
    }, [theme]); // Re-create when theme changes? No, useCallback dependency

    // Update existing bodies/render when theme changes
    useEffect(() => {
        if (!engineRef.current || !renderRef.current) return;

        const isRetro = theme === 'retro';
        const Bodies = Matter.Composite.allBodies(engineRef.current.world);

        // Update Render config
        // @ts-ignore
        renderRef.current.options.background = 'transparent';
        // @ts-ignore
        renderRef.current.options.wireframes = false;

        Bodies.forEach(body => {
            if (body.label !== 'Rectangle Body') return; // Skip walls if they are labelled differently (walls usually Rectangle Body too)

            // Check if it's a wall (static) or block
            if (body.isStatic) {
                body.render.strokeStyle = isRetro ? '#1A1A1A' : '#e5e5e5';
                return;
            }

            // It's a task block
            body.render.fillStyle = isRetro ? 'transparent' : '#ffffff';
            body.render.strokeStyle = isRetro ? '#00ff41' : '#000000';
            // Matter.js doesn't easily update chamfer after creation, so we skip that for existing blocks
        });

    }, [theme]);

    // ... Initialization useEffect ... (Adding theme dependency to update text color in afterRender)

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current || engineRef.current) return;
        // ... (existing init logic, but we need to ensure the render loop uses current theme for text)
        // Since init runs once, we'll attach the event listener here. 
        // But the event listener needs access to 'theme'. 
        // We might need to store theme in a ref to access it inside the loop without re-binding.

    }, []);

    // Better approach for afterRender: use a ref for theme
    const themeRef = useRef(theme);
    useEffect(() => { themeRef.current = theme; }, [theme]);

    // Initialization
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        // Setup Matter JS
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Events = Matter.Events;

        const engine = Engine.create();
        const world = engine.world;
        engineRef.current = engine;

        const { clientWidth, clientHeight } = containerRef.current;

        const render = Render.create({
            canvas: canvasRef.current,
            engine: engine,
            options: {
                width: clientWidth,
                height: clientHeight,
                background: 'transparent',
                wireframes: false,
                showAngleIndicator: false,
            }
        });
        renderRef.current = render;

        // Create Walls
        const wallOptions = {
            isStatic: true,
            render: {
                fillStyle: 'transparent',
                strokeStyle: themeRef.current === 'retro' ? '#1A1A1A' : '#e5e5e5',
                lineWidth: 1
            }
        };
        const ground = Bodies.rectangle(clientWidth / 2, clientHeight + 30, clientWidth, 60, wallOptions);
        const leftWall = Bodies.rectangle(-30, clientHeight / 2, 60, clientHeight, wallOptions);
        const rightWall = Bodies.rectangle(clientWidth + 30, clientHeight / 2, 60, clientHeight, wallOptions);

        Composite.add(world, [ground, leftWall, rightWall]);

        // Add Mouse Control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        Composite.add(world, mouseConstraint);

        render.mouse = mouse;

        // Custom Rendering for Text and Header Strip
        Events.on(render, 'afterRender', function () {
            const context = render.context;
            const allBodies = Composite.allBodies(world);
            const isRetro = themeRef.current === 'retro';

            context.textAlign = "center";
            context.textBaseline = "middle";

            allBodies.forEach((body) => {
                if (body.label && body.label !== 'Rectangle Body') { // Matter.js default label
                    // Actually walls are Rectangle Body too. We identify tasks by plugin.taskName
                    // Wait, checking creation code: const body = Bodies.rectangle(...)
                    // It has plugin.taskName
                }

                // Better check:
                const taskName = (body as any).plugin?.taskName;
                if (taskName) {
                    context.save();
                    context.translate(body.position.x, body.position.y);
                    context.rotate(body.angle);

                    context.font = isRetro
                        ? "bold 10px 'JetBrains Mono', monospace"
                        : "bold 10px 'Outfit', sans-serif";

                    context.fillStyle = isRetro ? "#00ff41" : "#333333";

                    if (isRetro) {
                        context.shadowColor = "#00ff41";
                        context.shadowBlur = 4;
                    } else {
                        context.shadowColor = "transparent";
                        context.shadowBlur = 0;
                    }

                    context.fillText(taskName, 0, 0);

                    context.restore();
                }
            });
        });

        // Run
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Cleanup
        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Composite.clear(world, false, true);
            Engine.clear(engine);
        };
    }, []);

    // Sync Tasks
    useEffect(() => {
        if (!engineRef.current || !renderRef.current) return;

        completedTasks.forEach(task => {
            if (!spawnedTaskIdsRef.current.has(task.id)) {
                addTaskBlock(task);
                spawnedTaskIdsRef.current.add(task.id);
            }
        });
    }, [completedTasks, addTaskBlock]);

    // Resize Handler (Optional to handle window resize for Matter.js)
    // ...

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden transition-colors">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
