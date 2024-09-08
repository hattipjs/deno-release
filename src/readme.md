# ![Hattip](https://raw.githubusercontent.com/hattipjs/hattip/main/graphics/logo.svg?v=2)

> <small>(nothing)</small> Like Express.js.

Follow: [Twitter > @cyco130](https://twitter.com/cyco130) & [Twitter > @brillout](https://twitter.com/brillout)  
Chat: <a href="https://discord.com/invite/vTvXzBMySh">Discord > Cubes<img src="https://raw.githubusercontent.com/hattipjs/hattip/main/graphics/hash.svg" height="17" width="23" valign="text-bottom" alt="hash"/>Hattip</a>

**Why Hattip?**

Instead of writing server code that only works with Express.js, write server code that can be deployed anywhere: AWS, Cloudflare Workers, Fastly, Vercel, VPS, ...

**What is Hattip?**

Hattip is a set of JavaScript packages for building HTTP server applications.

- &#x2728; Modern: Based on current and future web standards (Fetch API & WinterCG).
- &#x1F30D; Universal: Runs anywhere (Node.js, the Edge, Deno, ...).
- &#x1F9E9; Modular: Use as much or as little as you need.
- &#x1FA9B; Minimalist: Everything you need, nothing you don't.

It aims to build an ecosystem of universal middlewares that can be used across the entire JavaScript universe.

```js
// handler.js

// This request handler works anywhere, e.g. Node.js, Cloudflare Workers, and Fastly.

export default (context) => {
  const { pathname } = new URL(context.request.url);
  if (pathname === "/") {
    return new Response("Hello from Hattip.");
  }
  if (pathname === "/about") {
    return new Response(
      "This HTTP handler works in Node.js, Cloudflare Workers, and Fastly.",
    );
  }
  return new Response("Not found.", { status: 404 });
};
```

A Hattip handler is passed a `context` object which represents the request context and contains `context.request` which is a standard [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. It returns a standard [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object (or a promise of one). `Response` and `Request` follow the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) standard. So if you're familiar with service workers, Cloudflare Workers, or Deno, you'll feel right at home. If not, learn today the standard that will tomorrow be ubiquitous.

We believe in a diverse but interoperable future for the JavaScript ecosystem and we're closely following the [WinterCG](https://wintercg.org/) which lays the foundation beyond the Fetch API.

## Adapters

- ✅ Bun
- ✅ Cloudflare Workers
- ✅ Deno (including Deno Deploy)
- ✅ Express.js (use Hattip handlers/middlewares in your Express.js app)
- ✅ Fastly
- ✅ Lagon
- ✅ Netlify Edge Functions
- ✅ Netlify Functions
- ✅ Node.js
- ✅ uWebSockets.js
- ✅ Vercel Edge
- ✅ Vercel Serverless
- 🚧 Service Workers

Adapters let you run Hattip on any platform. Here's how you can use Hattip with Node.js:

```js
// entry-node.js
import { createServer } from "@hattip/adapter-node";
import handler from "./handler.js";

createServer(handler).listen(3000, "localhost", () => {
  console.log("Server listening on http://localhost:3000");
});
```

...and on Cloudflare Workers:

```js
// entry-cfw.js
import cloudflareWorkersAdapter from "@hattip/adapter-cloudflare-workers";
import handler from "./handler.js";

export default {
  fetch: cloudflareWorkersAdapter(handler),
};
```

You can even use your Hattip application as an Express middleware when you have to use that one Express library that doesn't have a replacement anywhere else:

```js
// entry-express.js
import { createMiddleware } from "@hattip/adapter-node";
import handler from "./handler.js";
import express from "express";
import oldAndRustyExpressMiddleware from "old-and-rusty-express-middleware";

const hattip = createMiddleware(handler);
const app = express();

// TODO: Replace with shinyNewHatTipMiddleware once ready
app.use(oldAndRustyExpressMiddleware());
app.use(hattip);

app.listen(3000, "localhost", () => {
  console.log("Server listening on http://localhost:3000");
});
```

## Middleware system

The `compose` function from the [`@hattip/compose`](./compose/readme.md) package can be used to compose multiple handlers into a single one, creating a simple but powerful middleware system. Each handler is called in sequence until one returns a response. A handler can pass control to the next handler either by not returning anything or calling `ctx.next()`. The latter allows the handler to modify the response before returning:

```js
import { compose } from "@hattip/compose";

// Example of making things available in `ctx`
// Middleware to parse the URL into a URL object
const urlParser = (ctx) => {
  ctx.url = new URL(ctx.request.url);
};

// Example of modifying the response
// Middleware to add an X-Powered-By header
const poweredBy = async (ctx) => {
  const response = await ctx.next();
  response.headers.set("X-Powered-By", "Hattip");
  return response;
};

// Hattip does have a router, this is to illustrate the basics
const homeHandler = (ctx) => {
  if (ctx.url.pathname === "/") {
    return new Response("Home");
  }
};

const fooHandler = (ctx) => {
  if (ctx.url.pathname === "/foo") {
    return new Response("Foo");
  }
};

const barHandler = (ctx) => {
  if (ctx.url.pathname === "/bar") {
    return new Response("Bar");
  }
};

export default compose(
  urlParser,
  poweredBy,
  homeHandler,
  fooHandler,
  barHandler,
);
```

A handler can return or throw a `Response` or anything with a `toResponse` method when used with the `compose` function. Handlers can also set `context.handleError` to handle uncaught errors.

**That's it**. This is the entirety of the Hattip API. Everything else is middleware functions similar the above that add various features and development tools to make your life easier.

## Packages

Hattip is extremely modular so you can use as little or as much as you need:

- [`core`](./core/readme.md): A type-only package that defines the interface between your application and platform adapters
- **Adapters:** Enable Hattip to run on any platform:
  - [`adapter-node`](./adapter-node/readme.md): Node.js, either as a standalone server or as a middleware function that can be used with Express and similar frameworks. Also works for Vercel Serverless Functions.
  - [`adapter-cloudflare-workers`](./adapter-cloudflare-workers/readme.md): Cloudflare Workers
  - [`adapter-vercel-edge`](./adapter-vercel-edge/readme.md): Vercel Edge Functions
  - [`adapter-netlify-functions`](./adapter-netlify-functions/readme.md): Netlify Functions
  - [`adapter-netlify-edge`](./adapter-netlify-edge/readme.md): Netlify Edge Functions
  - [`adapter-deno`](./adapter-deno/readme.md): Deno
  - [`adapter-bun`](./adapter-bun/readme.md): Bun
  - [`adapter-fastly`](./adapter-fastly/readme.md): Fastly
  - [`adapter-lagon`](./adapter-lagon/readme.md): Lagon
  - [`adapter-uwebsockets`](./adapter-uwebsockets/readme.md): uWebSockets.js
- **Bundlers:** Worker and serverless platforms usually require your code to be in bundled form. These packages provide bundlers fine-tuned for their respective platforms:
  - [`bundler-cloudflare-workers`](./bundler-cloudflare-workers/readme.md): Cloudflare Workers
  - [`bundler-vercel`](./bundler-vercel/readme.md): Vercel edge and serverless functions
  - [`bundler-netlify`](./bundler-netlify/readme.md): Netlify edge and Netlify functions
  - [`bundler-deno`](./bundler-deno/readme.md): Deno
- Low-level stuff
  - [`polyfills`](./polyfills/readme.md): A collection of polyfills used by adapters for compatibility across platforms
  - [`compose`](./compose/readme.md): A middleware system for combining multiple handlers into a single one
- Utilities and middleware
  - [`router`](./router/readme.md): Express-style imperative router
  - [`response`](./response/readme.md): Utility functions for creating text, JSON, HTML, and server-sent event responses
  - [`headers`](./headers/readme.md): Header value parsing and content negotiation utilities
  - [`multipart`](./multipart/readme.md): Experimental multipart parser (e.g. for form data with file uploads)
  - [`cookie`](./cookie/readme.md): Cookie handling middleware
  - [`cors`](./cors/readme.md): CORS middleware
  - [`graphql`](./graphql/readme.md): GraphQL middleware
  - [`session`](./session/readme.md): Session middleware

A zero-config development environment based on [Vite](https://vitejs.dev) is also in the works.

## Credits

[MIT license](./LICENSE)

- Code and concept by [Fatih Aygün](https://github.com/cyco130), [Romuald Brillout](https://github.com/brillout), and [contributors](https://github.com/hattipjs/hattip/graphs/contributors).
- Logo and branding by [Aydıncan Ataberk](https://www.aydincanataberk.com/).
- The [`cors`](./koajs-cors-license/readme.md.txt). They are not affiliated with Hattip.
- The [`graphql`](./graphql-yoga/readme.md.license.txt). They are not affiliated with Hattip.
