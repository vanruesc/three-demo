import { DemoManagerEvent } from "./DemoManagerEvent.js";

/**
 * A demo manager change event.
 *
 * This event is dispatched by {@link DemoManager} when the user switches to
 * another demo.
 *
 * @ignore
 * @type {DemoManagerEvent}
 * @example demoManager.addEventListener("change", myListener);
 */

export const change = new DemoManagerEvent("change");

/**
 * A demo manager load event.
 *
 * This event is dispatched by {@link DemoManager} when a demo has finished
 * loading and is about to start rendering.
 *
 * @ignore
 * @type {DemoManagerEvent}
 * @example demoManager.addEventListener("load", myListener);
 */

export const load = new DemoManagerEvent("load");
