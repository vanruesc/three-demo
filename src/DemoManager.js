import { EventTarget } from "synthetic-event";
import { Clock, CubeCamera, OrthographicCamera, WebGLRenderer } from "three";
import * as dat from "dat.gui";

import * as events from "./demo-manager-events.js";

/**
 * A demo manager.
 */

export class DemoManager extends EventTarget {

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

		this.menu = new dat.GUI({ autoPlace: false });

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
		const menu = new dat.GUI({ autoPlace: false });

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

			events.load.demo = demo;
			this.dispatchEvent(events.load);

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
		events.change.previousDemo = currentDemo;
		events.change.demo = nextDemo;
		this.currentDemo = nextDemo;
		this.dispatchEvent(events.change);

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
