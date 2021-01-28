import { GUI } from "dat.gui";

import {
	EventDispatcher,
	OrthographicCamera,
	PerspectiveCamera,
	WebGLRenderer
} from "three";

import { Demo } from "./Demo";
import * as events from "./demo-manager-events";

/**
 * Converts milliseconds to seconds.
 *
 * @type {Number}
 * @private
 */

const MILLISECONDS_TO_SECONDS = 1.0 / 1e3;

/**
 * The contructor parameter interface.
 *
 * @ignore
 */

export interface ConstructorParameters {

	aside?: HTMLElement,
	renderer?: WebGLRenderer

}

/**
 * A demo manager.
 */

export class DemoManager extends EventDispatcher {

	/**
	 * The main renderer.
	 */

	private renderer: WebGLRenderer;

	/**
	 * A timestamp.
	 */

	private timestamp: number;

	/**
	 * A menu for custom demo options.
	 */

	private menu: GUI;

	/**
	 * A collection of demos.
	 */

	private demos: Map<string, Demo>;

	/**
	 * The id of the current demo.
	 */

	private demo: string;

	/**
	 * The current demo.
	 */

	private currentDemo: Demo;

	/**
	 * Constructs a new demo manager.
	 *
	 * @param viewport - The viewport.
	 * @param options - Additional options.
	 * @param options.aside - A secondary container.
	 * @param options.renderer - A custom renderer.
	 */

	constructor(viewport: HTMLElement, { aside = viewport, renderer }: ConstructorParameters) {

		super();

		this.renderer = renderer;

		if(this.renderer === undefined) {

			const renderer = new WebGLRenderer();
			renderer.setSize(viewport.clientWidth, viewport.clientHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer = renderer;

		}

		this.timestamp = 0.0;
		this.menu = new GUI({ autoPlace: false });
		this.demos = new Map<string, Demo>();
		this.demo = null;
		this.currentDemo = null;

		viewport.appendChild(this.renderer.domElement);
		aside.appendChild(this.menu.domElement);

	}

	/**
	 * Updates the demo options menu.
	 *
	 * @return A new menu.
	 */

	private resetMenu(): GUI {

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
	 * @param demo - A demo.
	 */

	private startDemo(demo: Demo): void {

		// Make sure the given demo is still selected.
		if(demo.id === this.demo) {

			demo.initialize();
			demo.registerOptions(this.resetMenu());
			demo.ready = true;

			events.load.demo = demo;
			this.dispatchEvent(events.load);

		}

	}

	/**
	 * Loads the current demo.
	 */

	private loadDemo(): void {

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

		nextDemo.load()
			.then(() => this.startDemo(nextDemo))
			.catch((e) => console.error(e));

	}

	/**
	 * Adds a demo.
	 *
	 * @param demo - The demo.
	 * @return This manager.
	 */

	addDemo(demo: Demo): DemoManager {

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
	 * @param id - The ID of the demo.
	 * @return This manager.
	 */

	removeDemo(id: string): DemoManager {

		const demos = this.demos;

		if(demos.has(id)) {

			demos.delete(id);

			if(this.demo === id && demos.size > 0) {

				// Load the first of the remaining demos.
				const entries: Array<[string, Demo]> = Array.from(demos.entries());
				const firstEntry = entries[0];
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
	 * @param width - The width.
	 * @param height - The height.
	 * @param updateStyle - Determines whether the style of the canvas should be updated.
	 */

	setSize(width: number, height: number, updateStyle = true): void {

		const demo = this.currentDemo;
		const camera = demo.getCamera();

		this.renderer.setSize(width, height, updateStyle);

		if(demo !== null && camera !== null) {

			if(camera instanceof OrthographicCamera) {

				camera.left = width / -2.0;
				camera.right = width / 2.0;
				camera.top = height / 2.0;
				camera.bottom = height / -2.0;
				camera.updateProjectionMatrix();

			} else if(camera instanceof PerspectiveCamera) {

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

			}

		}

	}

	/**
	 * Renders the current demo.
	 *
	 * @param timestamp - The current time in milliseconds.
	 */

	render(timestamp: number): void {

		const elapsed = (timestamp - this.timestamp) * MILLISECONDS_TO_SECONDS;
		this.timestamp = timestamp;

		const demo = this.currentDemo;

		if(demo !== null && demo.ready) {

			demo.render(elapsed);

		}

	}

}
