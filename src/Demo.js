import { RenderPass } from "postprocessing";
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
		 * An effect composer.
		 *
		 * @type {EffectComposer}
		 * @protected
		 */

		this.composer = null;

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
		 * A render pass that renders to screen.
		 *
		 * @type {RenderPass}
		 */

		this.renderPass = new RenderPass(new Scene(), null);
		this.renderPass.renderToScreen = true;

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
	 * The scene.
	 *
	 * @type {Scene}
	 */

	get scene() {

		return this.renderPass.scene;

	}

	/**
	 * @type {Scene}
	 */

	set scene(scene) {

		this.renderPass.scene = scene;

	}

	/**
	 * The camera.
	 *
	 * @type {Camera}
	 */

	get camera() {

		return this.renderPass.camera;

	}

	/**
	 * @type {camera}
	 */

	set camera(camera) {

		this.renderPass.camera = camera;

	}

	/**
	 * Sets the effect composer.
	 *
	 * @param {EffectComposer} composer - A composer.
	 * @return {Demo} This demo.
	 */

	setComposer(composer) {

		this.composer = composer;

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
	 * Initialises this demo.
	 *
	 * This method will be called after reset.
	 */

	initialize() {}

	/**
	 * Updates this demo.
	 *
	 * @param {Number} delta - The time since the last frame in seconds.
	 */

	update(delta) {}

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

		const fog = this.scene.fog;
		const renderPass = new RenderPass(new Scene(), null);
		renderPass.enabled = this.renderPass.enabled;
		renderPass.renderToScreen = true;
		this.renderPass = renderPass;
		this.scene.fog = fog;

		if(this.controls !== null) {

			this.controls.dispose();
			this.controls = null;

		}

		this.ready = false;

		return this;

	}

}
