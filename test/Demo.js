"use strict";

const Demo = require("../build/three-demo").Demo;

module.exports = {

	"Demo": {

		"can be instantiated": function(test) {

			const demo = new Demo();
			test.ok(demo);
			test.done();

		}

	}

};
