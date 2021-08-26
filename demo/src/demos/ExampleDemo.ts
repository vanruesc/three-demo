import { GUI } from "dat.gui";

import {
	CubeTextureLoader,
	Matrix4,
	PerspectiveCamera,
	Spherical,
	Texture,
	Vector3
} from "three";

import { calculateVerticalFoV, Demo } from "../../../src";

const TWO_PI = 2 * Math.PI;
const up = new Vector3(0, 1, 0);
const v = new Vector3();
const m = new Matrix4();

/**
 * An example demo.
 */

export class ExampleDemo extends Demo implements EventListenerObject {

	/**
	 * The background rotation speed.
	 */

	private speed: number;

	/**
	 * Spherical coordinates.
	 */

	private spherical: Spherical;

	/**
	 * Constructs a new demo.
	 */

	constructor() {

		super("example");

		this.speed = 0.0;
		this.spherical = new Spherical(1.0, Math.PI * 0.3, 0.0);

	}

	/**
	 * Handles keyboard events.
	 *
	 * @param event - The event.
	 */

	private handleKeyboardEvent(event: KeyboardEvent): void {

		switch(event.key) {

			case "i":
				console.log(this.renderer.info);
				break;

		}

	}

	handleEvent(event: Event): void {

		switch(event.type) {

			case "keyup":
				this.handleKeyboardEvent(event as KeyboardEvent);
				break;

		}

	}

	override load(): Promise<void> {

		const assets = this.assets;
		const loadingManager = this.loadingManager;
		const cubeTextureLoader = new CubeTextureLoader(loadingManager);

		const path = "textures/skies/grimm-night/";
		const format = ".jpg";
		const urls = [
			path + "px" + format, path + "nx" + format,
			path + "py" + format, path + "ny" + format,
			path + "pz" + format, path + "nz" + format
		];

		return new Promise((resolve, reject) => {

			if(assets.size === 0) {

				loadingManager.onError = reject;
				loadingManager.onLoad = resolve;

				cubeTextureLoader.load(urls, (textureCube) => {

					assets.set("sky", textureCube);

				});

			} else {

				resolve();

			}

		});

	}

	override initialize(): void {

		const scene = this.scene;
		const assets = this.assets;

		// Scene

		const cubeMap = assets.get("sky") as Texture;
		scene.background = cubeMap;

		// Camera

		const aspect = window.innerWidth / window.innerHeight;
		const vFoV = calculateVerticalFoV(90, Math.max(aspect, 16 / 9));
		const camera = new PerspectiveCamera(vFoV, aspect, 0.1, 1);
		this.camera = camera;

		this.speed = 0.02;
		this.update(0.0);

		// Custom Events

		document.addEventListener("keyup", this);

	}

	override update(deltaTime: number): void {

		const camera = this.camera;
		const spherical = this.spherical;
		spherical.theta += deltaTime * this.speed;

		if(Math.abs(spherical.theta) >= TWO_PI) {

			spherical.theta -= Math.sign(spherical.theta) * TWO_PI;

		}

		spherical.makeSafe();
		m.lookAt(camera.position, v.setFromSpherical(spherical), up);
		camera.quaternion.setFromRotationMatrix(m);

	}

	override registerOptions(menu: GUI): void {

		menu.add(this, "speed").min(-0.5).max(0.5).step(0.01);

	}

	override dispose(): void {

		document.removeEventListener("keyup", this);

	}

}
