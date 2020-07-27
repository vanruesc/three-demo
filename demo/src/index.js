import { Demo, DemoManager } from "../../src";
import { ExampleDemo } from "./demos/ExampleDemo.js";

/**
 * A demo manager.
 *
 * @type {DemoManager}
 * @private
 */

let manager;

/**
 * The main render loop.
 *
 * @private
 * @param {DOMHighResTimeStamp} now - The current time.
 */

function render(now) {

	requestAnimationFrame(render);
	manager.render(now);

}

/**
 * Handles demo change events.
 *
 * @private
 * @param {Event} event - An event.
 */

function onChange(event) {

	document.getElementById("viewport").children[0].style.display = "initial";

}

/**
 * Handles demo load events.
 *
 * @private
 * @param {Event} event - An event.
 */

function onLoad(event) {

	document.getElementById("viewport").children[0].style.display = "none";

}

/**
 * Starts the program.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", (event) => {

	// Initialize the demo manager.
	manager = new DemoManager(document.getElementById("viewport"), {
		aside: document.getElementById("aside")
	});

	// Setup demo loading event handlers.
	manager.addEventListener("change", onChange);
	manager.addEventListener("load", onLoad);

	// Register demos.
	manager.addDemo(new ExampleDemo());

	// Add the second demo a little later (for testing purposes).
	setTimeout(() => {

		const emptyDemo = new Demo("empty");
		emptyDemo.render = () => {};
		manager.addDemo(emptyDemo);

		console.log("Added the empty demo 1 second after initialization");

	}, 1000);

	// Start rendering.
	requestAnimationFrame(render);

});

/**
 * Handles browser resizing.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("resize", (function() {

	let timeoutId = 0;

	function handleResize(event) {

		const width = event.target.innerWidth;
		const height = event.target.innerHeight;

		manager.setSize(width, height);

		timeoutId = 0;

	}

	return function onResize(event) {

		if(timeoutId === 0) {

			timeoutId = setTimeout(handleResize, 66, event);

		}

	};

}()));

/**
 * Performs initialization tasks when the document is ready.
 *
 * @private
 * @param {Event} event - An event.
 */

document.addEventListener("DOMContentLoaded", (event) => {

	const infoImg = document.querySelector(".info img");
	const infoDiv = document.querySelector(".info div");

	if(infoImg !== null && infoDiv !== null) {

		infoImg.addEventListener("click", (event) => {

			infoDiv.style.display = (infoDiv.style.display === "block") ? "none" : "block";

		});

	}

});

/**
 * Toggles the visibility of the interface on H key press.
 *
 * @private
 * @param {Event} event - An event.
 */

document.addEventListener("keydown", (event) => {

	const aside = document.getElementById("aside");

	if(aside !== null && event.key === "h") {

		event.preventDefault();
		aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

	}

});
