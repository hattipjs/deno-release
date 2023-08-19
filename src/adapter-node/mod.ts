// TODO: Remove or update this rule!
import { ServerResponse } from "node:http";
import { DecoratedRequest, NodeAdapterOptions } from "./common.ts";
import installNodeFetch from "../polyfills/node-fetch.ts";
import installGetSetCookie from "../polyfills/get-set-cookie.ts";
import installCrypto from "../polyfills/crypto.ts";

installNodeFetch();
installGetSetCookie();
installCrypto();

export type { DecoratedRequest, NodeAdapterOptions };

/** Connect/Express style request listener/middleware */
export type NodeMiddleware = (
	req: DecoratedRequest,
	res: ServerResponse,
	next?: () => void,
) => void;

export interface NodePlatformInfo {
	request: DecoratedRequest;
	response: ServerResponse;
}

export { createMiddleware, createServer } from "./common.ts";
