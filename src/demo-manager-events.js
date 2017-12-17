import { Event } from "synthetic-event";
import { ErrorEvent } from "./ErrorEvent.js";

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

/**
 * A demo error event.
 *
 * This event is dispatched by {@link DemoManager}.
 *
 * @type {ErrorEvent}
 * @example demoManager.addEventListener("error", myListener);
 */

export const error = new ErrorEvent();
