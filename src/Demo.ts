import { GUI } from "dat.gui";
import { Camera, LoadingManager, Scene, WebGLRenderer } from "three";

/**
 * A demo base class.
 */

export class Demo {

	/**
	 * The id of this demo.
	 */

	id: string;

	/**
	 * A renderer.
	 */

	protected renderer: WebGLRenderer;

	/**
	 * A loading manager.
	 */

	protected loadingManager: LoadingManager;

	/**
	 * A collection of loaded assets.
	 */

	protected assets: Map<string, any>;

	/**
	 * The scene.
	 */

	protected scene = new Scene();

	/**
	 * The camera.
	 */

	protected camera: Camera;

	/**
	 * Constructs a new demo.
	 *
	 * @param id - A unique identifier.
	 */

	constructor(id = "demo") {

		this.id = id;
		this.renderer = null;
		this.loadingManager = new LoadingManager();
		this.assets = new Map<string, any>();
		this.scene = new Scene();
		this.camera = null;

	}

	/**
	 * Sets the renderer.
	 *
	 * @param renderer - A renderer.
	 * @return This demo.
	 */

	setRenderer(renderer: WebGLRenderer): Demo {

		this.renderer = renderer;
		return this;

	}

	/**
	 * Returns the camera of this demo.
	 *
	 * @return The camera.
	 */

	getCamera(): Camera {

		return this.camera;

	}

	/**
	 * Loads this demo.
	 *
	 * Override this method to load assets.
	 *
	 * @return A promise that resolves when all assets have been loaded.
	 */

	load(): Promise<void> {

		return Promise.resolve();

	}

	/**
	 * Initializes this demo.
	 */

	initialize(): void {}

	/**
	 * Updates this demo.
	 *
	 * Override this method to perform custom update operations.
	 *
	 * @param deltaTime - The time since the last frame in seconds.
	 */

	update(deltaTime: number): void {}

	/**
	 * Renders this demo.
	 *
	 * Override this method to customize rendering.
	 *
	 * @param deltaTime - The time since the last frame in seconds.
	 */

	render(deltaTime: number): void {

		this.renderer.render(this.scene, this.camera);

	}

	/**
	 * Registers configuration options.
	 *
	 * This method will be called once after the demo has been initialized and
	 * every time a new demo is added to the manager.
	 *
	 * @param menu - A menu.
	 */

	registerOptions(menu: GUI): void {}

	/**
	 * Disposes this demo.
	 *
	 * Override this method to release custom resources and event handlers.
	 */

	dispose() {}

	/**
	 * Resets this demo.
	 *
	 * This method will be called when the manager switches to a different demo.
	 *
	 * @return This demo.
	 */

	reset(): Demo {

		this.scene = new Scene();
		this.camera = null;
		this.ready = false;

		return this;

	}

}
