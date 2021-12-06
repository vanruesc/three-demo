import { PerspectiveCamera } from "three";

import {
	calculateVerticalFoV,
	Demo,
	DemoManager,
	DemoManagerEvent
} from "../../src";

import { ExampleDemo } from "./demos/ExampleDemo";

window.addEventListener("load", (event: Event) => {

	const manager = new DemoManager(document.getElementById("viewport"), {
		aside: document.getElementById("aside")
	});

	manager.addEventListener("change", (event: DemoManagerEvent) => {

		console.log("switched demo:", event);
		document.querySelector(".loading").classList.remove("hidden");

	});

	manager.addEventListener("load", (event: DemoManagerEvent) => {

		console.log("loaded demo:", event);
		document.querySelector(".loading").classList.add("hidden");

	});

	// Register demos.
	manager.addDemo(new ExampleDemo());

	// Add the second demo a little later (for testing purposes).
	setTimeout(() => {

		const emptyDemo = new Demo("empty");
		emptyDemo.render = () => {};
		manager.addDemo(emptyDemo);

		console.log("Added the empty demo 1 second after initialization");

	}, 1000);

	window.addEventListener("resize", (event: Event) => {

		const width = window.innerWidth;
		const height = window.innerHeight;
		const demo = manager.getCurrentDemo();

		if(demo !== null) {

			const camera = demo.getCamera() as PerspectiveCamera;

			if(camera !== null) {

				const aspect = Math.max(width / height, 16 / 9);
				const vFoV = calculateVerticalFoV(90, aspect);
				camera.fov = vFoV;

			}

		}

		manager.setSize(width, height);

	});

	requestAnimationFrame(function render(timestamp: number): void {

		requestAnimationFrame(render);
		manager.render(timestamp);

	});

});

document.addEventListener("DOMContentLoaded", (event: Event) => {

	const img = document.querySelector(".info img");
	const div = document.querySelector(".info div");

	if(img !== null && div !== null) {

		img.addEventListener("click", (event: Event) => {

			div.classList.toggle("hidden");

		});

	}

});

document.addEventListener("keyup", (event: KeyboardEvent) => {

	if(event.key === "h") {

		const aside = document.querySelector("aside");
		const footer = document.querySelector("footer");

		event.preventDefault();
		aside.classList.toggle("hidden");
		footer.classList.toggle("hidden");

	}

});
