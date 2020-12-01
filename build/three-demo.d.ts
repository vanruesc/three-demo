/**
 * three-demo v4.0.5 build Tue Dec 01 2020
 * https://github.com/vanruesc/three-demo
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
import { GUI } from 'dat.gui';
import { WebGLRenderer, LoadingManager, Scene, Camera, EventDispatcher, Event } from 'three';

declare class Demo {
    id: string;
    protected renderer: WebGLRenderer;
    protected loadingManager: LoadingManager;
    protected assets: Map<string, any>;
    protected scene: Scene;
    protected camera: Camera;
    ready: boolean;
    constructor(id?: string);
    setRenderer(renderer: WebGLRenderer): Demo;
    getCamera(): Camera;
    load(): Promise<void>;
    initialize(): void;
    render(deltaTime: number): void;
    registerOptions(menu: GUI): void;
    reset(): Demo;
}

interface ConstructorParameters {
    aside?: HTMLElement;
    renderer?: WebGLRenderer;
}
declare class DemoManager extends EventDispatcher {
    private renderer;
    private timestamp;
    private menu;
    private demos;
    private demo;
    private currentDemo;
    constructor(viewport: HTMLElement, { aside, renderer }: ConstructorParameters);
    private resetMenu;
    private startDemo;
    private loadDemo;
    addDemo(demo: Demo): DemoManager;
    removeDemo(id: string): DemoManager;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(timestamp: number): void;
}

declare class DemoManagerEvent implements Event {
    type: string;
    previousDemo: Demo;
    demo: Demo;
    constructor(type: string);
}

export { Demo, DemoManager, DemoManagerEvent };
