import type { HattipHandler } from "../core/mod.ts";

export default function lagonAdapter(hattipHandler: HattipHandler) {
	return function handler(request: Request) {
		return hattipHandler({
			request,
			ip: request.headers.get("X-Forwarded-For") || "",
			waitUntil() {
				// No op
			},
			passThrough() {
				// No op
			},
			platform: { name: "lagon" },
			env(variable) {
				return process.env[variable];
			},
		});
	};
}

declare global {
	interface Process {
		env: Record<string, string | undefined>;
	}

	// eslint-disable-next-line no-var
	var process: Process;
}
