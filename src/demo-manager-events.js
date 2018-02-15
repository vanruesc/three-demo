import { DemoManagerEvent } from "./DemoManagerEvent.js";

/**
 * A demo manager change event.
 *
 * This event is dispatched by {@link DemoManager}.
 *
 * @type {DemoManagerEvent}
 * @example demoManager.addEventListener("change", myListener);
 */

export const change = new DemoManagerEvent("change");

/**
 * A demo manager load event.
 *
 * This event is dispatched by {@link DemoManager}.
 *
 * @type {DemoManagerEvent}
 * @example demoManager.addEventListener("load", myListener);
 */

export const load = new DemoManagerEvent("load");
