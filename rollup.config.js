import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import resolve from "rollup-plugin-node-resolve";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const lib = {

	input: pkg.module,
	output: {
		file: "build/" + pkg.name + ".js",
		format: "umd",
		name: pkg.name.replace(/-/g, "").toUpperCase(),
		banner: banner,
		globals: { three: "THREE" }
	},

	external: ["three"],
	plugins: [resolve()].concat(process.env.NODE_ENV === "production" ? [babel()] : [])

};

const demo = {

	input: "demo/src/index.js",
	output: {
		file: "public/demo/index.js",
		format: "iife",
		globals: { three: "THREE" }
	},

	external: ["three"],
	plugins: [resolve()].concat(process.env.NODE_ENV === "production" ? [babel()] : [])

};

export default [lib, demo].concat((process.env.NODE_ENV === "production") ? [

	Object.assign({}, lib, {

		output: Object.assign({}, lib.output, {
			file: "build/" + pkg.name + ".min.js"
		}),

		plugins: [resolve(), babel(), minify({
			bannerNewLine: true,
			sourceMap: false,
			comments: false
		})]

	}),

	Object.assign({}, demo, {

		output: Object.assign({}, demo.output, {
			file: "public/demo/index.min.js"
		}),

		plugins: [resolve(), babel(), minify({
			bannerNewLine: true,
			sourceMap: false,
			comments: false
		})]

	})

] : []);
