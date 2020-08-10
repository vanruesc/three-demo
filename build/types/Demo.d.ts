import { GUI } from "dat.gui";
import { Camera, LoadingManager, Scene, WebGLRenderer } from "three";
export declare class Demo {
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
