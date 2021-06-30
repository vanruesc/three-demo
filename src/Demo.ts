import { GUI } from "dat.gui";
import { Camera, LoadingManager, Scene, WebGLRenderer } from "three";

/**
 * A demo base class.
 */

export class Demo {

	/**
	 * The ID of this demo.
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
	 * A collection of assets.
	 */

	protected assets: Map<string, unknown>;

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
		this.assets = new Map<string, unknown>();
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
	 * Override this method to perform custom update operations. This method will
	 * be called before {@link render}.
	 *
	 * @param deltaTime - The time since the last frame in seconds.
	 * @param timestamp - The current time in milliseconds.
	 */

	update(deltaTime: number, timestamp?: number): void {}

	/**
	 * Renders this demo.
	 *
	 * Override this method to customize rendering.
	 *
	 * @param deltaTime - The time since the last frame in seconds.
	 * @param timestamp - The current time in milliseconds.
	 */

	render(deltaTime: number, timestamp?: number): void {

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
	 * Override this method to release custom resources and event handlers. This
	 * method will be called before {@link reset}.
	 */

	dispose(): void {}

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

		return this;

	}

}
