/**
 * three-demo v3.19.0 build Fri May 01 2020
 * https://github.com/vanruesc/three-demo
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
import { LoadingManager, Scene, WebGLRenderer, Clock, OrthographicCamera, CubeCamera } from 'three';
import { Event, EventTarget } from 'synthetic-event';
import { GUI } from 'dat.gui';

/**
 * A demo base class.
 */

class Demo {

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

/**
 * A demo manager event.
 */

class DemoManagerEvent extends Event {

	/**
	 * Constructs a new demo manager event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * The previous demo, if available.
		 *
		 * @type {Demo}
		 */

		this.previousDemo = null;

		/**
		 * The current demo.
		 *
		 * @type {Demo}
		 */

		this.demo = null;

	}

}

/**
 * A demo manager change event.
 *
 * This event is dispatched by {@link DemoManager} when the user switches to
 * another demo.
 *
 * @ignore
 * @type {DemoManagerEvent}
 * @example demoManager.addEventListener("change", myListener);
 */

const change = new DemoManagerEvent("change");

/**
 * A demo manager load event.
 *
 * This event is dispatched by {@link DemoManager} when a demo has finished
 * loading and is about to start rendering.
 *
 * @ignore
 * @type {DemoManagerEvent}
 * @example demoManager.addEventListener("load", myListener);
 */

const load = new DemoManagerEvent("load");

/**
 * A demo manager.
 */

class DemoManager extends EventTarget {

	/**
	 * Constructs a new demo manager.
	 *
	 * @param {HTMLElement} viewport - The primary DOM container.
	 * @param {Object} [options] - Additional options.
	 * @param {HTMLElement} [options.aside] - A secondary DOM container.
	 * @param {WebGLRenderer} [options.renderer] - A custom renderer.
	 */

	constructor(viewport, { aside = viewport, renderer } = {}) {

		super();

		/**
		 * The main renderer.
		 *
		 * @type {WebGLRenderer}
		 * @private
		 */

		this.renderer = (renderer !== undefined) ? renderer : (() => {

			const renderer = new WebGLRenderer();
			renderer.setSize(viewport.clientWidth, viewport.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);

			return renderer;

		})();

		viewport.appendChild(this.renderer.domElement);

		/**
		 * A clock.
		 *
		 * @type {Clock}
		 * @private
		 */

		this.clock = new Clock();

		/**
		 * A menu for custom demo options.
		 *
		 * @type {GUI}
		 * @private
		 */

		this.menu = new GUI({ autoPlace: false });

		aside.appendChild(this.menu.domElement);

		/**
		 * A collection of demos.
		 *
		 * @type {Map}
		 * @private
		 */

		this.demos = new Map();

		/**
		 * The id of the current demo.
		 *
		 * @type {String}
		 * @private
		 */

		this.demo = null;

		/**
		 * The current demo.
		 *
		 * @type {Demo}
		 * @private
		 */

		this.currentDemo = null;

	}

	/**
	 * Updates the demo options menu.
	 *
	 * @private
	 * @return {GUI} A clean menu.
	 */

	resetMenu() {

		const node = this.menu.domElement.parentNode;
		const menu = new GUI({ autoPlace: false });

		// Don't create a demo selection if there's only one demo.
		if(this.demos.size > 1) {

			const selection = menu.add(this, "demo", Array.from(this.demos.keys()));
			selection.onChange(() => this.loadDemo());

		}

		node.removeChild(this.menu.domElement);
		node.appendChild(menu.domElement);

		this.menu.destroy();
		this.menu = menu;

		return menu;

	}

	/**
	 * Activates the given demo if it's still selected.
	 *
	 * While the demo was loading, another demo may have been selected.
	 *
	 * @private
	 * @param {Demo} demo - A demo.
	 */

	startDemo(demo) {

		if(demo.id === this.demo) {

			demo.initialize();
			demo.registerOptions(this.resetMenu());
			demo.ready = true;

			load.demo = demo;
			this.dispatchEvent(load);

		}

	}

	/**
	 * Loads the currently selected demo.
	 *
	 * @private
	 */

	loadDemo() {

		const nextDemo = this.demos.get(this.demo);
		const currentDemo = this.currentDemo;
		const renderer = this.renderer;

		// Update the URL.
		window.location.hash = nextDemo.id;

		if(currentDemo !== null) {

			currentDemo.reset();

		}

		// Hide the menu.
		this.menu.domElement.style.display = "none";

		// Update and dispatch the event.
		change.previousDemo = currentDemo;
		change.demo = nextDemo;
		this.currentDemo = nextDemo;
		this.dispatchEvent(change);

		// Clear the screen.
		renderer.clear();

		nextDemo.load().then(() => this.startDemo(nextDemo)).catch(console.error);

	}

	/**
	 * Adds a demo.
	 *
	 * @param {Demo} demo - The demo.
	 * @return {DemoManager} This manager.
	 */

	addDemo(demo) {

		const hash = window.location.hash.slice(1);
		const currentDemo = this.currentDemo;

		this.demos.set(demo.id, demo.setRenderer(this.renderer));

		// If there is a hash value, wait for the corresponding demo to be added.
		if((this.demo === null && hash.length === 0) || demo.id === hash) {

			this.demo = demo.id;
			this.loadDemo();

		}

		// Update the demo selection.
		this.resetMenu();

		if(currentDemo !== null && currentDemo.ready) {

			// Add the demo options again.
			currentDemo.registerOptions(this.menu);

		}

		return this;

	}

	/**
	 * Removes a demo.
	 *
	 * @param {String} id - The id of the demo.
	 * @return {DemoManager} This manager.
	 */

	removeDemo(id) {

		const demos = this.demos;

		let firstEntry;

		if(demos.has(id)) {

			demos.delete(id);

			if(this.demo === id && demos.size > 0) {

				// Load the first of the remaining demos.
				firstEntry = demos.entries().next().value;
				this.demo = firstEntry[0];
				this.currentDemo = firstEntry[1];
				this.loadDemo();

			} else {

				this.demo = null;
				this.currentDemo = null;
				this.renderer.clear();

			}

		}

		return this;

	}

	/**
	 * Sets the render size.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 * @param {Boolean} [updateStyle] - Determines whether the style of the canvas should be updated.
	 */

	setSize(width, height, updateStyle) {

		const demo = this.currentDemo;

		this.renderer.setSize(width, height, updateStyle);

		if(demo !== null && demo.camera !== null) {

			const camera = demo.camera;

			if(camera instanceof OrthographicCamera) {

				camera.left = width / -2.0;
				camera.right = width / 2.0;
				camera.top = height / 2.0;
				camera.bottom = height / -2.0;
				camera.updateProjectionMatrix();

			} else if(!(camera instanceof CubeCamera)) {

				// Perspective, Array or Stereo camera.
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

			}

		}

	}

	/**
	 * The main render loop.
	 *
	 * @param {DOMHighResTimeStamp} now - The current time.
	 */

	render(now) {

		const demo = this.currentDemo;
		const delta = this.clock.getDelta();

		if(demo !== null && demo.ready) {

			demo.render(delta);

		}

	}

}

export { Demo, DemoManager, DemoManagerEvent };
