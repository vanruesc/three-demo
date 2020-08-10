import { DemoManagerEvent } from "./DemoManagerEvent";

/**
 * A demo manager change event.
 *
 * This event is dispatched by {@link DemoManager} when the user switches to
 * another demo.
 *
 * @ignore
 */

export const change = new DemoManagerEvent("change");

/**
 * A demo manager load event.
 *
 * This event is dispatched by {@link DemoManager} when a demo has finished
 * loading and is about to start rendering.
 *
 * @ignore
 */

export const load = new DemoManagerEvent("load");
