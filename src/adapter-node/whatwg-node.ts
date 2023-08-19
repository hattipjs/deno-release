// TODO: Remove or update this rule!
import { ServerResponse } from "node:http";
import { DecoratedRequest, NodeAdapterOptions } from "./common.ts";
import installWhatwgNodeFetch from "../polyfills/whatwg-node.ts";
import installGetSetCookie from "../polyfills/get-set-cookie.ts";
import installCrypto from "../polyfills/crypto.ts";

installWhatwgNodeFetch();
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
