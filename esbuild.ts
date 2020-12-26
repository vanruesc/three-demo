import { BuildOptions, BuildResult, startService } from "esbuild";
import { watch } from "chokidar";
import * as path from "path";
import * as yargs from "yargs";
import configs from "./esbuild.config";

const { argv } = yargs.options({ watch: { alias: "w", type: "boolean" } });

function handleResult(result: BuildResult, file: string, elapsed: number): void {

	console.log(`Built ${file} in ${elapsed}ms`);
	result.warnings.forEach((w) => console.warn(w.text,
		`${w.location.file} ${w.location.line}:${w.location.column}`));

}

async function build(changedFile: string = null): Promise<void> {

	const service = await startService();
	const f = (changedFile !== null) ? path.normalize(changedFile) : null;
	const t0 = Date.now();

	const promises: Promise<BuildResult>[] = configs.map((c: BuildOptions) => {

		let p: Promise<BuildResult> = null;

		if(path.normalize(c.outfile) !== f) {

			p = service.build(c);
			p.then((r) => handleResult(r, c.outfile, Date.now() - t0));

		}

		return p;

	});

	Promise.all(promises)
		.catch((e) => console.error(e))
		.finally(() => service.stop());

}

if(argv.watch) {

	const entryPoints: string[] = configs.reduce((a: string[], b: BuildOptions) => a.concat(b.entryPoints), []);
	const directories = [...new Set(entryPoints.map((f: string) => path.dirname(f)))];
	console.log(`Watching ${directories.join(", ").replace(/,\s([^,]*)$/, " and $1")} for changes…\n`);

	const watcher = watch(directories);
	watcher.on("change", (f: string) => void build(f));

}

void build(null);
