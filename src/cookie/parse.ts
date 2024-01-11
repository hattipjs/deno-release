import "../compose/mod.ts";
import { parse, CookieParseOptions } from "https://esm.sh/cookie@0.6.0";

export type { CookieParseOptions };

declare module "../compose/mod.ts" {
	interface RequestContextExtensions {
		/** Incoming cookies parsed into an object */
		readonly cookie: Record<string, string | undefined>;
	}
}

// Only the subset that we actually use for maximum compatibility
export type CookieParserContext = {
	request: Pick<Request, "headers">;
};

/**
 * Create a cookie parser middleware.
 *
 * @param options Cookie parser options
 *
 * @returns A middleware that will parse cookies
 */
export function cookieParser(options?: CookieParseOptions) {
	return function parseCookie(ctx: CookieParserContext) {
		// Lazily parse
		Object.defineProperty(ctx, "cookie", {
			get() {
				const value = parse(ctx.request.headers.get("cookie") || "", options);
				Object.defineProperty(ctx, "cookie", {
					value,
					configurable: true,
					enumerable: true,
				});
				return value;
			},
			configurable: true,
			enumerable: true,
		});
	};
}
