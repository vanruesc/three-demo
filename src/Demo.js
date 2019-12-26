import { LoadingManager, Scene } from "three";

/**
 * A demo base class.
 */

export class Demo {

	/**
	 * Constructs a new demo.
	 *
	 * @param {String} [id="demo"] - A unique identifier.
	 */

	constructor(id = "demo") {

		/**
		 * The id of this demo.
		 *
		 * @type {String}
		 */

		this.id = id;

		/**
		 * A renderer.
		 *
		 * @type {WebGLRenderer}
		 * @protected
		 */

		this.renderer = null;

		/**
		 * A loading manager.
		 *
		 * @type {LoadingManager}
		 * @protected
		 */

		this.loadingManager = new LoadingManager();

		/**
		 * A collection of loaded assets.
		 *
		 * @type {Map}
		 * @protected
		 */

		this.assets = new Map();

		/**
		 * The scene.
		 *
		 * @type {Scene}
		 * @protected
		 */

		this.scene = new Scene();

		/**
		 * The camera.
		 *
		 * @type {Camera}
		 * @protected
		 */

		this.camera = null;

		/**
		 * Camera controls.
		 *
		 * @type {Disposable}
		 * @protected
		 */

		this.controls = null;

		/**
		 * Indicates whether this demo is ready for rendering.
		 *
		 * The {@link DemoManager} updates this flag automatically.
		 *
		 * @type {Boolean}
		 */

		this.ready = false;

	}

	/**
	 * Sets the renderer.
	 *
	 * @param {WebGLRenderer} renderer - A renderer.
	 * @return {Demo} This demo.
	 */

	setRenderer(renderer) {

		this.renderer = renderer;

		return this;

	}

	/**
	 * Loads this demo.
	 *
	 * Override this method to load assets.
	 *
	 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
	 */

	load() {

		return Promise.resolve();

	}

	/**
	 * Initializes this demo.
	 *
	 * This method will be called after reset.
	 */

	initialize() {}

	/**
	 * Renders this demo.
	 *
	 * Override this method to update and render the demo manually.
	 *
	 * @param {Number} delta - The time since the last frame in seconds.
	 */

	render(delta) {

		this.renderer.render(this.scene, this.camera);

	}

	/**
	 * Registers configuration options.
	 *
	 * This method will be called once after initialize and then every time a new
	 * demo is added.
	 *
	 * @param {GUI} menu - A menu.
	 */

	registerOptions(menu) {}

	/**
	 * Resets this demo.
	 *
	 * @return {Demo} This demo.
	 */

	reset() {

		this.scene = new Scene();
		this.camera = null;

		if(this.controls !== null) {

			this.controls.dispose();
			this.controls = null;

		}

		this.ready = false;

		return this;

	}

}
