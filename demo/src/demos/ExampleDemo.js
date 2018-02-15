import {
	AmbientLight,
	CubeTextureLoader,
	FogExp2,
	Mesh,
	MeshPhongMaterial,
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
		 * A sphere mesh.
		 *
		 * @type {Mesh}
		 */

		this.mesh = null;

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
	 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
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
				loadingManager.onProgress = (item, loaded, total) => {

					if(loaded === total) {

						resolve();

					}

				};

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
		const renderer = this.renderer;

		// Camera.

		const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1);
		camera.position.set(0, Math.max(1.15, 1.5 - camera.aspect * 0.1), 0);
		camera.lookAt(scene.position);
		camera.rotation.z = Math.PI / 2;
		this.camera = camera;

		// Fog.

		scene.fog = new FogExp2(0x000000, 0.2);
		renderer.setClearColor(scene.fog.color);

		// Lights.

		const ambientLight = new AmbientLight(0xffffff);
		scene.add(ambientLight);

		// Objects.

		const geometry = new SphereBufferGeometry(1, 64, 64);
		const material = new MeshPhongMaterial({
			envMap: assets.get("sky"),
			color: 0xffffff,
			dithering: true
		});

		const mesh = new Mesh(geometry, material);
		this.mesh = mesh;
		scene.add(mesh);

		// Reset speed.

		this.speed = 0.01;

	}

	/**
	 * Renders this demo.
	 *
	 * @param {Number} delta - The time since the last frame in seconds.
	 */

	render(delta) {

		const TWO_PI = Math.PI * 2;
		const rotation = this.camera.rotation;

		rotation.z += delta * this.speed;

		if(Math.abs(rotation.z) >= TWO_PI) {

			rotation.z -= Math.sign(rotation.z) * TWO_PI;

		}

		super.render(delta);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} menu - A menu.
	 */

	registerOptions(menu) {

		menu.add(this, "speed").min(-0.5).max(0.5).step(0.01);

	}

}
