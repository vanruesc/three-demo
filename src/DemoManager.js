import { EffectComposer } from "postprocessing";
import { EventTarget } from "synthetic-event";
import { Clock, WebGLRenderer } from "three";
import dat from "dat.gui";
import Stats from "stats.js";

import * as events from "./demo-manager-events.js";

/**
 * The initial URL hash value.
 *
 * @type {String}
 * @private
 */

const initialHash = window.location.hash.slice(1);

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
	 * @param {EffectComposer} [options.composer] - A custom effect composer.
	 */

	constructor(viewport, options = {}) {

		const aside = (options.aside !== undefined) ? options.aside : viewport;

		super();

		/**
		 * A composer.
		 *
		 * @type {EffectComposer}
		 */

		this.composer = (options.composer !== undefined) ? options.composer : (() => {

			const renderer = new WebGLRenderer();
			renderer.setSize(viewport.clientWidth, viewport.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);

			return new EffectComposer(renderer);

		})();

		/**
		 * The main renderer.
		 *
		 * @type {WebGLRenderer}
		 * @private
		 */

		this.renderer = this.composer.renderer;

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
		 * Performance statistics.
		 *
		 * @type {Stats}
		 * @private
		 */

		this.statistics = new Stats();
		this.statistics.dom.id = "statistics";

		aside.appendChild(this.statistics.domElement);

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
	 * @todo Use a menu library that is not as clunky as dat.GUI.
	 * @return {GUI} The cleaned menu.
	 */

	resetMenu() {

		const node = this.menu.domElement.parentNode;
		const menu = new dat.GUI({ autoPlace: false });
		const selection = menu.add(this, "demo", Array.from(this.demos.keys()));
		selection.onChange(() => this.loadDemo());

		node.removeChild(this.menu.domElement);
		node.appendChild(menu.domElement);

		this.menu.destroy();
		this.menu = menu;

		return menu;

	}

	/**
	 * Activates the given demo if it's still selected.
	 *
	 * While the demo was loading, another demo may have been selected already.
	 *
	 * @private
	 * @param {Demo} demo - A demo that just finished loading.
	 */

	startDemo(demo) {

		if(demo.id === this.demo) {

			demo.initialize();
			demo.registerOptions(this.resetMenu());
			demo.ready = true;

			this.dispatchEvent(events.load);

		}

	}

	/**
	 * Loads the currently selected demo.
	 *
	 * @private
	 */

	loadDemo() {

		const id = this.demo;
		const demos = this.demos;
		const demo = demos.get(id);
		const previousDemo = this.currentDemo;

		const composer = this.composer;
		const renderer = this.renderer;

		let size;

		// Update the URL.
		window.location.hash = id;

		if(previousDemo !== null) {

			previousDemo.reset();

			// Update and use the main renderer.
			size = composer.renderer.getSize();
			renderer.setSize(size.width, size.height);
			composer.replaceRenderer(renderer);

		}

		this.menu.domElement.style.display = "none";

		// Clear the screen and remove all passes.
		renderer.clear();
		composer.reset();
		composer.addPass(demo.renderPass);

		this.currentDemo = demo;
		this.dispatchEvent(events.change);

		demo.load().then(() => this.startDemo(demo))
			.catch((e) => console.error(e));

	}

	/**
	 * Adds a demo.
	 *
	 * @param {Demo} demo - The demo.
	 * @return {DemoManager} This manager.
	 */

	addDemo(demo) {

		this.demos.set(demo.id, demo.setComposer(this.composer));

		if(this.demo === null || demo.id === initialHash) {

			this.demo = demo.id;
			this.loadDemo();

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
				this.composer.reset();

			}

		}

		return this;

	}

	/**
	 * Sets the render size.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		const demo = this.currentDemo;

		this.composer.setSize(width, height);

		if(demo !== null && demo.camera !== null) {

			demo.camera.aspect = width / height;
			demo.camera.updateProjectionMatrix();

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

			this.statistics.begin();

			demo.update(delta);
			this.composer.render(delta);

			this.statistics.end();

		}

	}

}
