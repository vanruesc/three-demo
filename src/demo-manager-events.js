import { Event } from "synthetic-event";

/**
 * A demo change event.
 *
 * This event is dispatched by {@link DemoManager}.
 *
 * @type {Event}
 * @example demoManager.addEventListener("change", myListener);
 */

export const change = new Event("change");

/**
 * A demo load event.
 *
 * This event is dispatched by {@link DemoManager}.
 *
 * @type {Event}
 * @example demoManager.addEventListener("load", myListener);
 */

export const load = new Event("load");
