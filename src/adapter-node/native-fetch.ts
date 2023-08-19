// eslint-disable-next-line import/no-unresolved
import * as webStream from "node:stream/web";
import installGetSetCookie from "../polyfills/get-set-cookie.ts";
import installCrypto from "../polyfills/crypto.ts";
import installHalfDuplexRequest from "../polyfills/half-duplex-request.ts";

installGetSetCookie();
installCrypto();
installHalfDuplexRequest();

for (const key of Object.keys(webStream)) {
	if (!(key in globalThis)) {
		(globalThis as any)[key] = (webStream as any)[key];
	}
}

export type {
	DecoratedRequest,
	NodeMiddleware,
	NodeAdapterOptions,
	NodePlatformInfo,
} from "./common.ts";

export { createMiddleware, createServer } from "./common.ts";
