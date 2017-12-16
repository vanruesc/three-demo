"use strict";

const DemoManager = require("../build/three-demo").DemoManager;

module.exports = {

	"DemoManager": {

		"can be instantiated": function(test) {

			const manager = new DemoManager();
			test.ok(manager);
			test.done();

		}

	}

};
