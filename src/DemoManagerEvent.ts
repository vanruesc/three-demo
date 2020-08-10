import { Event } from "three";
import { Demo } from "./Demo";

/**
 * A demo manager event.
 */

export class DemoManagerEvent implements Event {

	/**
	 * The type of this event.
	 */

	type: string;

	/**
	 * The previous demo, if available.
	 */

	previousDemo: Demo;

	/**
	 * The current demo.
	 */

	demo: Demo;

	/**
	 * Constructs a new demo manager event.
	 *
	 * @param type - The name of the event.
	 */

	constructor(type: string) {

		this.type = type;
		this.previousDemo = null;
		this.demo = null;

	}

}
