const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");

module.exports = function(grunt) {

	return {

		options: {
			globals: {
				"dat.gui": "dat",
				"stats.js": "Stats",
				"three": "THREE"
			},
			external: [
				"dat.gui",
				"stats.js",
				"three"
			],
			plugins() {

				return [
					resolve()
				].concat(
					grunt.option("production") ? [babel()] : []
				);

			}
		},

		lib: {
			options: {
				format: "umd",
				moduleName: "<%= package.name.replace(/-/g, \"\").toUpperCase() %>",
				banner: "<%= banner %>"
			},
			src: "<%= package.module %>",
			dest: "build/<%= package.name %>.js"
		},

		demo: {
			options: {
				format: "iife"
			},
			src: "demo/src/index.js",
			dest: "public/demo/index.js"
		}

	};

};
