import test from "ava";
import browserEnv from "browser-env";

browserEnv(["document", "window"]);

const Demo = require("../build/three-demo.js").Demo;

test("can be created", t => {

	const object = new Demo();

	t.truthy(object);

});
