import {
	CubeTextureLoader,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	SphereBufferGeometry
} from "three";

import { Demo } from "../../../src";

/**
 * An example demo.
 */

export class ExampleDemo extends Demo {

	/**
	 * Constructs a new demo.
	 */

	constructor() {

		super("example");

		/**
		 * The rotation speed.
		 *
		 * @type {Number}
		 */

		this.speed = 0.01;

	}

	/**
	 * Loads scene assets.
	 *
	 * @return {Promise} A promise that resolves when all assets have been loaded.
	 */

	load() {

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

	/**
	 * Creates the scene.
	 */

	initialize() {

		const scene = this.scene;
		const assets = this.assets;

		// Camera.

		const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1);
		camera.position.set(0, Math.max(1.15, 1.5 - camera.aspect * 0.1), 0);
		camera.lookAt(scene.position);
		camera.rotation.z = Math.PI / 2;
		this.camera = camera;

		// Objects.

		const mesh = new Mesh(
			new SphereBufferGeometry(1, 32, 32),
			new MeshBasicMaterial({
				envMap: assets.get("sky")
			})
		);

		scene.add(mesh);

	}

	/**
	 * Renders this demo.
	 *
	 * @param {Number} deltaTime - The time since the last frame in seconds.
	 */

	render(deltaTime) {

		const TWO_PI = Math.PI * 2;
		const rotation = this.camera.rotation;

		rotation.z += deltaTime * this.speed;

		if(Math.abs(rotation.z) >= TWO_PI) {

			rotation.z -= Math.sign(rotation.z) * TWO_PI;

		}

		super.render(deltaTime);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} menu - A menu.
	 */

	registerOptions(menu) {

		menu.add(this, "speed").min(-0.5).max(0.5).step(0.01);

	}

	/**
	 * Resets this demo.
	 *
	 * @return {Demo} This demo.
	 */

	reset() {

		super.reset();

		this.speed = 0.01;

	}

}
