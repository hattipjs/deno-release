/// <reference types="npm:@cloudflare/workers-types@4.20230821.0"/>
/* eslint-disable import/no-unresolved */

import type { AdapterRequestContext, HattipHandler } from "../core/mod.ts";
import { getAssetFromKV, NotFoundError } from "npm:@cloudflare/kv-asset-handler@0.3.0";
import manifestText from "__STATIC_CONTENT_MANIFEST";

const manifest = JSON.parse(manifestText);

export interface CloudflareWorkersPlatformInfo {
	/** Platform name */
	name: "cloudflare-workers";
	/**
	 * Bindings for secrets, environment variables, and other resources like
	 * KV namespaces etc.
	 * @see https://developers.cloudflare.com/workers/platform/environment-variables
	 * @see https://developers.cloudflare.com/workers/configuration/bindings
	 */
	env: unknown;
	/**
	 * Execution context
	 * @see https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#parameters
	 */
	context: ExecutionContext;
}

export default function cloudflareWorkersAdapter(
	handler: HattipHandler<CloudflareWorkersPlatformInfo>,
): ExportedHandlerFetchHandler {
	return async function fetchHandler(request, env, ctx) {
		if (request.method === "GET" || request.method === "HEAD") {
			try {
				return await getAssetFromKV(
					{
						request,
						waitUntil: (promise) => ctx.waitUntil(promise),
					},
					{
						ASSET_NAMESPACE: (env as any).__STATIC_CONTENT,
						ASSET_MANIFEST: manifest,
					},
				);
			} catch (error) {
				if (!(error instanceof NotFoundError)) {
					console.error(error);
					return new Response("Internal Server Error", { status: 500 });
				}
			}
		}

		const context: AdapterRequestContext<CloudflareWorkersPlatformInfo> = {
			request,
			ip: request.headers.get("CF-Connecting-IP") || "127.0.0.1", // wrangler no longer sets this header
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
