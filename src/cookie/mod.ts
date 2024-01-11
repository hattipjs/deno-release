import { CookieParseOptions, CookieSerializeOptions } from "https://esm.sh/cookie@0.6.0";
import { cookieParser, CookieParserContext } from "./parse.ts";
import { cookieSerializer, CookieSerializerContext } from "./serialize.ts";

export interface CookieOptions {
	parserOptions?: CookieParseOptions;
	serializerOptions?: CookieSerializeOptions;
}

// Only the subset that we actually use for maximum compatibility
export type CookieContext = CookieParserContext & CookieSerializerContext;

/**
 * Create a cookie middleware.
 *
 * @param options Cookie parsing/serialization options
 */
export function cookie(options: CookieOptions = {}) {
	return function cookie(ctx: CookieContext) {
		cookieParser(options.parserOptions)(ctx);
		return cookieSerializer(options.serializerOptions)(ctx);
	};
}

export { cookieParser, cookieSerializer };
export type { CookieParseOptions, CookieSerializeOptions };
