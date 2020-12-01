import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import esbuild  from "rollup-plugin-esbuild";
import pkg from "./package.json";

const date = (new Date()).toDateString();
const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.peerDependencies);
const globals = Object.assign({}, ...external.map((value) => ({
	[value]: value.replace(/-/g, "").toUpperCase()
})));

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const ext = new Map([
	["dts", ".d.ts"],
	["esm", ".esm.js"],
	["umd", ".js"],
	["iife", ".js"],
	["min", ".min.js"]
]);

function bundle(id, format, minify = false) {

	const lib = (id === "lib");
	const transpile = (format !== "esm" && (minify || production));
	const extKey = minify ? "min" : format;
	const fileName = lib ? pkg.name : "index";
	const outDir = lib ? "build" : "public/demo";

	return {
		input: lib ? "src/index.ts" : "demo/src/index.ts",
		external: lib ? external : null,
		plugins: (format === "dts") ? [dts()] : [
			resolve(),
			esbuild({
				tsconfig: lib ? "src/tsconfig.json" : "tsconfig.json",
				target: "esnext",
				minify
			})
		].concat(transpile ? [
			babel({
				babelHelpers: "bundled",
				extensions: [".js", ".ts"]
			})
		] : []),
		output: {
			file: `${outDir}/${fileName}${ext.get(extKey)}`,
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			banner: lib ? banner : null,
			globals,
			format
		}
	};

}

export default production ? [
	bundle("lib", "dts"),
	bundle("lib", "esm"),
	bundle("lib", "umd"),
	bundle("lib", "umd", true),
	bundle("demo", "iife"),
	bundle("demo", "iife", true)
] : [
	bundle("demo", "iife")
];
