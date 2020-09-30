import { GUI } from "dat.gui";

import {
	CubeTextureLoader,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Texture
} from "three";

// Workaround for missing BufferGeometry type exports in three@r121:
import { SphereBufferGeometry } from "three/src/geometries/SphereBufferGeometry";

import { Demo } from "../../../src";

/**
 * An example demo.
 */

export class ExampleDemo extends Demo {

	/**
	 * The background rotation speed.
	 */

	private speed: number;

	/**
	 * Constructs a new demo.
	 */

	constructor() {

		super("example");

		this.speed = 0.01;

	}

	load(): Promise<void> {

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

					assets.set("envMap", textureCube);

				});

			} else {

				resolve();

			}

		});

	}

	initialize(): void {

		const scene = this.scene;
		const assets = this.assets;

		// Camera.

		const aspect = window.innerWidth / window.innerHeight;
		const camera = new PerspectiveCamera(50, aspect, 0.1, 1);
		camera.position.set(0, Math.max(1.15, 1.5 - camera.aspect * 0.1), 0);
		camera.lookAt(scene.position);
		camera.rotation.z = Math.PI / 2;
		this.camera = camera;

		// Objects.

		const envMap = assets.get("envMap") as Texture;

		const mesh = new Mesh(
			new SphereBufferGeometry(1, 32, 32),
			new MeshBasicMaterial({ envMap })
		);

		scene.add(mesh);

	}

	render(deltaTime: number): void {

		const TWO_PI = Math.PI * 2;
		const rotation = this.camera.rotation;

		rotation.z += deltaTime * this.speed;

		if(Math.abs(rotation.z) >= TWO_PI) {

			rotation.z -= Math.sign(rotation.z) * TWO_PI;

		}

		super.render(deltaTime);

	}

	registerOptions(menu: GUI): void {

		menu.add(this, "speed").min(-0.5).max(0.5).step(0.01);

	}

	reset(): Demo {

		this.speed = 0.01;

		return super.reset();

	}

}
