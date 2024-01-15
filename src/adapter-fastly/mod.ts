/* eslint-disable @typescript-eslint/ban-ts-comment */
/// <reference types="npm:@fastly/js-compute@3.8.0"/>

import type { AdapterRequestContext, HattipHandler } from "../core/mod.ts";
import { env } from "fastly:env";

export interface FastlyPlatformInfo {
	/** Platform name */
	name: "fastly-compute";
	/** Event object */
	event: FetchEvent;
}

export default function fastlyComputeAdapter(
	handler: HattipHandler<FastlyPlatformInfo>,
) {
	// @ts-ignore
	addEventListener("fetch", (event) => {
		const context: AdapterRequestContext<FastlyPlatformInfo> = {
			request: event.request,
			ip: event.client.address,
			waitUntil: event.waitUntil.bind(event),
			platform: {
				name: "fastly-compute",
				event,
			},
			passThrough() {
				// empty
			},
			env,
		};

		event.respondWith(handler(context));
	});
}
