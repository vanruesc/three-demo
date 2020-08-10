import { Event } from "three";
import { Demo } from "./Demo";
export declare class DemoManagerEvent implements Event {
    type: string;
    previousDemo: Demo;
    demo: Demo;
    constructor(type: string);
}
