import { Event } from "synthetic-event";

/**
 * An error event.
 */

export class ErrorEvent extends Event {

	/**
	 * Constructs a new error event.
	 *
	 * @param {Error} [error=null] - The error.
	 */

	constructor(error = null) {

		super("error");

		/**
		 * The error.
		 *
		 * @type {Error}
		 */

		this.error = error;

	}

}
