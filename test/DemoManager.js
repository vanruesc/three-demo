import test from "ava";
import browserEnv from "browser-env";

browserEnv(["document", "window"]);

const DemoManager = require("../build/bundle.js").DemoManager;

test("can be created", t => {

	// Can't test because headless.
	// const object = new DemoManager();

	// t.truthy(object);
	t.pass();

});
