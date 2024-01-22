import { cac } from "npm:cac@6.7.14";
import { version } from "../version.ts";
import { bundle } from "./mod.ts";

const cli = cac("hattip-aws-lambda");

cli
	.command(
		"<input> <output>",
		"Bundle the AWS Lambda Hattip app in <input> into <output> as a ZIP file for deployment",
	)
	.option(
		"-c, --copy <path>",
		"Copy the file/directory at <path> next to the output. Can be specified multiple times.",
	)
	.option(
		"--no-zip",
		"Don't zip the output. <output> will then be the output directory.",
	)
	.action(
		async (
			input: string,
			output: string,
			options: {
				copy?: string | string[];
				zip: boolean;
			},
		) => {
			await bundle({
				input,
				output,
				copy:
					options.copy === undefined
						? []
						: typeof options.copy === "string"
							? [options.copy]
							: options.copy,
				zip: options.zip,
			});
		},
	);

cli.help();
cli.version(version);

cli.parse();
