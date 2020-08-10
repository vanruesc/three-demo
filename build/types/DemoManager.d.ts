import { EventDispatcher, WebGLRenderer } from "three";
import { Demo } from "./Demo";
interface ConstructorParameters {
    aside?: HTMLElement;
    renderer?: WebGLRenderer;
}
export declare class DemoManager extends EventDispatcher {
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
export {};
