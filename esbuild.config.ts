import { BuildOptions } from "esbuild";
import * as pkg from "./package.json";

const date = (new Date()).toDateString();
const production = (process.env.NODE_ENV === "production");
const globalName = pkg.name.replace(/-/g, "").toUpperCase();
const external = Object.keys(pkg.peerDependencies);

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const footer = `if(typeof module==="object"&&module.exports)module.exports=${globalName};`;

function config(entryPoint: string, outfile: string, format: string, minify = false): BuildOptions {

	const lib = (entryPoint === "src/index.ts");
	const iife = (format === "iife");

	return {
		entryPoints: [entryPoint],
		outfile,
		globalName: lib ? globalName : "",
		external: lib ? external : [],
		banner: lib ? banner : "",
		footer: (lib && iife) ? footer : "",
		bundle: true,
		minify,
		format
	} as BuildOptions;

}

export default production ? [
	config("src/index.ts", `build/${pkg.name}.esm.js`, "esm"),
	config("src/index.ts", `build/${pkg.name}.js`, "iife"),
	config("src/index.ts", `build/${pkg.name}.min.js`, "iife", true),
	config("demo/src/index.ts", "public/demo/index.js", "iife"),
	config("demo/src/index.ts", "public/demo/index.min.js", "iife", true)
] : [
	config("demo/src/index.ts", "public/demo/index.js", "iife")
];
