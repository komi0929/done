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

        const body = Bodies.rectangle(
            canvas.width / 2 + (Math.random() - 0.5) * 40,
            -height - 50,
            width,
            height,
            {
                restitution: 0.2,
                friction: 0.8,
                angle: (Math.random() - 0.5) * 0.1,
                chamfer: { radius: 0 },
                render: {
                    fillStyle: 'transparent', // Wireframe style
                    strokeStyle: '#00ff41',
                    lineWidth: 2,
                },
                // @ts-ignore
                plugin: {
                    taskName: task.name
                }
            }
        );

        Composite.add(engineRef.current.world, body);
    }, []);

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
                wireframes: false, // We simulate wireframes with fillStyle: transparent + strokeStyle
                showAngleIndicator: false,
            }
        });
        renderRef.current = render;

        // Create Walls
        const wallOptions = {
            isStatic: true,
            render: {
                fillStyle: 'transparent',
                strokeStyle: '#1A1A1A',
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

            context.textAlign = "center";
            context.textBaseline = "middle";

            allBodies.forEach((body) => {
                if (body.label && body.label !== 'Rectangle Body') {
                    const taskName = (body as any).plugin?.taskName;
                    if (taskName) {
                        context.save();
                        context.translate(body.position.x, body.position.y);
                        context.rotate(body.angle);

                        context.font = "bold 10px 'JetBrains Mono', monospace";
                        context.fillStyle = "#00ff41"; // Neon Green text
                        context.shadowColor = "#00ff41";
                        context.shadowBlur = 4;
                        context.fillText(taskName, 0, 0);

                        context.restore();
                    }
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

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[rgba(0,10,0,0.2)] border border-[var(--terminal-grid)] overflow-hidden">
            {/* Overlay grid pattern via CSS if needed, but simple transparent is fine */}
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
