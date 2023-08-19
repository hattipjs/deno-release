/// <reference types="npm:@cloudflare/workers-types@4.20230807.0"/>

import type { AdapterRequestContext, HattipHandler } from "../core/mod.ts";
import type { CloudflareWorkersPlatformInfo } from "./mod.ts";

export type { CloudflareWorkersPlatformInfo };

export default function cloudflareWorkersAdapter(
	handler: HattipHandler<CloudflareWorkersPlatformInfo>,
): ExportedHandlerFetchHandler {
	return async function fetchHandler(request, env, ctx) {
		const context: AdapterRequestContext<CloudflareWorkersPlatformInfo> = {
			request,
			ip: request.headers.get("CF-Connecting-IP") || "127.0.0.1",
			waitUntil: ctx.waitUntil.bind(ctx),
			passThrough() {
				// Do nothing
			},
			platform: {
				name: "cloudflare-workers",
				env,
				context: ctx,
			},
			env(variable) {
				const value = (env as any)[variable];
				return typeof value === "string" ? value : undefined;
			},
		};

		return handler(context);
	};
}
