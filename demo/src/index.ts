import { Event as Event3 } from "three";
import { Demo, DemoManager } from "../../src";
import { ExampleDemo } from "./demos/ExampleDemo";

/**
 * A demo manager.
 */

let manager: DemoManager;

/**
 * Renders the demo.
 *
 * @param timestamp - The current time in milliseconds.
 */

function render(timestamp: number): void {

	requestAnimationFrame(render);
	manager.render(timestamp);

}

/**
 * Starts the program.
 *
 * @param event - An event.
 */

window.addEventListener("load", (event: Event) => {

	// Initialize the demo manager.
	manager = new DemoManager(document.getElementById("viewport"), {
		aside: document.getElementById("aside")
	});

	manager.addEventListener("change", (event: Event3) => {

		document.querySelector(".loading").classList.remove("hidden");

	});

	manager.addEventListener("load", (event: Event3) => {

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

	requestAnimationFrame(render);

});

/**
 * Handles browser resizing.
 *
 * @param event - An event.
 */

window.addEventListener("resize", (event: Event) => {

	const width = window.innerWidth;
	const height = window.innerHeight;
	manager.setSize(width, height);

});

/**
 * Performs initialization tasks when the document is ready.
 *
 * @param event - An event.
 */

document.addEventListener("DOMContentLoaded", (event: Event) => {

	const img = document.querySelector(".info img");
	const div = document.querySelector(".info div");

	if(img !== null && div !== null) {

		img.addEventListener("click", (event: Event) => {

			div.classList.toggle("hidden");

		});

	}

});

/**
 * Toggles the visibility of the interface on H key press.
 *
 * @param event - An event.
 */

document.addEventListener("keyup", (event: KeyboardEvent) => {

	if(event.key === "h") {

		const aside = document.querySelector("aside");
		const footer = document.querySelector("footer");

		event.preventDefault();
		aside.classList.toggle("hidden");
		footer.classList.toggle("hidden");

	}

});
