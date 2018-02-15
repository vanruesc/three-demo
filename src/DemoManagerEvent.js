import { Event } from "synthetic-event";

/**
 * A demo manager event.
 */

export class DemoManagerEvent extends Event {

	/**
	 * Constructs a new demo manager event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * The previous demo, if available.
		 *
		 * @type {Demo}
		 */

		this.previousDemo = null;

		/**
		 * The current demo.
		 *
		 * @type {Demo}
		 */

		this.demo = null;

	}

}
