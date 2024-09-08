var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../node_modules/.pnpm/@whatwg-node+events@0.1.1/node_modules/@whatwg-node/events/dist/node-ponyfill.js
var require_node_ponyfill = __commonJS({
  "../../../node_modules/.pnpm/@whatwg-node+events@0.1.1/node_modules/@whatwg-node/events/dist/node-ponyfill.js"(exports, module) {
    "use strict";
    module.exports.CustomEvent = globalThis.CustomEvent;
    if (!module.exports.CustomEvent) {
      module.exports.CustomEvent = class CustomEvent extends Event {
        constructor(type, options) {
          super(type, options);
          this.detail = options?.detail ?? null;
        }
      };
    }
  }
});

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/error.js
import { GraphQLError } from "https://esm.sh/graphql@16.8.2";
import { createGraphQLError } from "https://esm.sh/@graphql-tools/utils@10.5.4";
function isAggregateError(obj) {
  return obj != null && typeof obj === "object" && "errors" in obj;
}
function hasToString(obj) {
  return obj != null && typeof obj.toString === "function";
}
function isGraphQLError(val) {
  return val instanceof GraphQLError;
}
function isOriginalGraphQLError(val) {
  if (val instanceof GraphQLError) {
    if (val.originalError != null) {
      return isOriginalGraphQLError(val.originalError);
    }
    return true;
  }
  return false;
}
function isAbortError(error) {
  return typeof error === "object" && error?.constructor?.name === "DOMException" && error.name === "AbortError";
}
function handleError(error, maskedErrorsOpts, logger) {
  const errors = /* @__PURE__ */ new Set();
  if (isAggregateError(error)) {
    for (const singleError of error.errors) {
      const handledErrors = handleError(singleError, maskedErrorsOpts, logger);
      for (const handledError of handledErrors) {
        errors.add(handledError);
      }
    }
  } else if (isAbortError(error)) {
    logger.debug("Request aborted");
  } else if (maskedErrorsOpts) {
    const maskedError = maskedErrorsOpts.maskError(error, maskedErrorsOpts.errorMessage, maskedErrorsOpts.isDev);
    if (maskedError !== error) {
      logger.error(error);
    }
    errors.add(isGraphQLError(maskedError) ? maskedError : createGraphQLError(maskedError.message, {
      originalError: maskedError
    }));
  } else if (isGraphQLError(error)) {
    errors.add(error);
  } else if (error instanceof Error) {
    errors.add(createGraphQLError(error.message, {
      originalError: error
    }));
  } else if (typeof error === "string") {
    errors.add(createGraphQLError(error, {
      extensions: {
        unexpected: true
      }
    }));
  } else if (hasToString(error)) {
    errors.add(createGraphQLError(error.toString(), {
      extensions: {
        unexpected: true
      }
    }));
  } else {
    logger.error(error);
    errors.add(createGraphQLError("Unexpected error.", {
      extensions: {
        http: {
          unexpected: true
        }
      }
    }));
  }
  return Array.from(errors);
}
function getResponseInitByRespectingErrors(result, headers = {}, isApplicationJson = false) {
  let status;
  let unexpectedErrorExists = false;
  if ("extensions" in result && result.extensions?.http) {
    if (result.extensions.http.headers) {
      Object.assign(headers, result.extensions.http.headers);
    }
    if (result.extensions.http.status) {
      status = result.extensions.http.status;
    }
  }
  if ("errors" in result && result.errors?.length) {
    for (const error of result.errors) {
      if (error.extensions?.http) {
        if (error.extensions.http.headers) {
          Object.assign(headers, error.extensions.http.headers);
        }
        if (isApplicationJson && error.extensions.http.spec) {
          continue;
        }
        if (error.extensions.http.status && (!status || error.extensions.http.status > status)) {
          status = error.extensions.http.status;
        }
      } else if (!isOriginalGraphQLError(error) || error.extensions?.unexpected) {
        unexpectedErrorExists = true;
      }
    }
  } else {
    status ||= 200;
  }
  if (!status) {
    if (unexpectedErrorExists && !("data" in result)) {
      status = 500;
    } else {
      status = 200;
    }
  }
  return {
    status,
    headers
  };
}
function areGraphQLErrors(obj) {
  return Array.isArray(obj) && obj.length > 0 && // if one item in the array is a GraphQLError, we're good
  obj.some(isGraphQLError);
}

// ../../../node_modules/.pnpm/@graphql-yoga+logger@2.0.0/node_modules/@graphql-yoga/logger/esm/index.js
var ansiCodes = {
  red: "\x1B[31m",
  yellow: "\x1B[33m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  reset: "\x1B[0m"
};
var warnPrefix = ansiCodes.yellow + "WARN" + ansiCodes.reset;
var infoPrefix = ansiCodes.cyan + "INFO" + ansiCodes.reset;
var errorPrefix = ansiCodes.red + "ERR" + ansiCodes.reset;
var debugPrefix = ansiCodes.magenta + "DEBUG" + ansiCodes.reset;
var logLevelScores = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};
var noop = () => {
};
var consoleLog = (prefix) => (...args) => console.log(prefix, ...args);
var debugLog = console.debug ? (...args) => console.debug(debugPrefix, ...args) : consoleLog(debugPrefix);
var infoLog = console.info ? (...args) => console.info(infoPrefix, ...args) : consoleLog(infoPrefix);
var warnLog = console.warn ? (...args) => console.warn(warnPrefix, ...args) : consoleLog(warnPrefix);
var errorLog = console.error ? (...args) => console.error(errorPrefix, ...args) : consoleLog(errorPrefix);
var createLogger = (logLevel = globalThis.process?.env["DEBUG"] === "1" ? "debug" : "info") => {
  const score = logLevelScores[logLevel];
  return {
    debug: score > logLevelScores.debug ? noop : debugLog,
    info: score > logLevelScores.info ? noop : infoLog,
    warn: score > logLevelScores.warn ? noop : warnLog,
    error: score > logLevelScores.error ? noop : errorLog
  };
};

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/graphiql-html.js
var graphiql_html_default = '<!doctype html><html lang=en><head><meta charset=utf-8><title>__TITLE__</title><link rel=icon href=https://raw.githubusercontent.com/dotansimha/graphql-yoga/main/website/public/favicon.ico><link rel=stylesheet href=https://unpkg.com/@graphql-yoga/graphiql@4.3.1/dist/style.css></head><body id=body class=no-focus-outline><noscript>You need to enable JavaScript to run this app.</noscript><div id=root></div><script type=module>import{renderYogaGraphiQL}from"https://unpkg.com/@graphql-yoga/graphiql@4.3.1/dist/yoga-graphiql.es.js";renderYogaGraphiQL(root,__OPTS__)</script></body></html>';

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-graphiql.js
function shouldRenderGraphiQL({ headers, method }) {
  return method === "GET" && !!headers?.get("accept")?.includes("text/html");
}
var renderGraphiQL = (opts) => graphiql_html_default.replace("__TITLE__", opts?.title || "Yoga GraphiQL").replace("__OPTS__", JSON.stringify(opts ?? {}));
function useGraphiQL(config) {
  const logger = config.logger ?? console;
  let graphiqlOptionsFactory;
  if (typeof config?.options === "function") {
    graphiqlOptionsFactory = config?.options;
  } else if (typeof config?.options === "object") {
    graphiqlOptionsFactory = () => config?.options;
  } else if (config?.options === false) {
    graphiqlOptionsFactory = () => false;
  } else {
    graphiqlOptionsFactory = () => ({});
  }
  const renderer = config?.render ?? renderGraphiQL;
  let urlPattern;
  const getUrlPattern = ({ URLPattern: URLPattern2 }) => {
    urlPattern ||= new URLPattern2({
      pathname: config.graphqlEndpoint
    });
    return urlPattern;
  };
  return {
    async onRequest({ request, serverContext, fetchAPI, endResponse: endResponse2, url }) {
      if (shouldRenderGraphiQL(request) && (request.url.endsWith(config.graphqlEndpoint) || request.url.endsWith(`${config.graphqlEndpoint}/`) || url.pathname === config.graphqlEndpoint || url.pathname === `${config.graphqlEndpoint}/` || getUrlPattern(fetchAPI).test(url))) {
        logger.debug(`Rendering GraphiQL`);
        const graphiqlOptions = await graphiqlOptionsFactory(request, serverContext);
        if (graphiqlOptions) {
          const graphiQLBody = await renderer({
            ...graphiqlOptions === true ? {} : graphiqlOptions
          });
          const response = new fetchAPI.Response(graphiQLBody, {
            headers: {
              "Content-Type": "text/html"
            },
            status: 200
          });
          endResponse2(response);
        }
      }
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-readiness-check.js
function useReadinessCheck({ endpoint = "/ready", check }) {
  let urlPattern;
  return {
    onYogaInit({ yoga }) {
      urlPattern = new yoga.fetchAPI.URLPattern({ pathname: endpoint });
    },
    async onRequest({ request, endResponse: endResponse2, fetchAPI, url }) {
      if (request.url.endsWith(endpoint) || url.pathname === endpoint || urlPattern.test(url)) {
        let response;
        try {
          const readyOrResponse = await check({ request, fetchAPI });
          if (typeof readyOrResponse === "object") {
            response = readyOrResponse;
          } else {
            response = new fetchAPI.Response(null, {
              status: readyOrResponse === false ? 503 : 200
            });
          }
        } catch (err) {
          const isError = err instanceof Error;
          response = new fetchAPI.Response(isError ? err.message : null, {
            status: 503,
            headers: isError ? { "content-type": "text/plain; charset=utf-8" } : {}
          });
        }
        endResponse2(response);
      }
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-schema.js
import { isSchema } from "https://esm.sh/graphql@16.8.2";
var useSchema = (schemaDef) => {
  if (schemaDef == null) {
    return {};
  }
  if (isSchema(schemaDef)) {
    return {
      onPluginInit({ setSchema }) {
        setSchema(schemaDef);
      }
    };
  }
  if ("then" in schemaDef) {
    let schema;
    return {
      onRequestParse() {
        return {
          async onRequestParseDone() {
            schema ||= await schemaDef;
          }
        };
      },
      onEnveloped({ setSchema }) {
        if (!schema) {
          throw new Error(`You provide a promise of a schema but it hasn't been resolved yet. Make sure you use this plugin with GraphQL Yoga.`);
        }
        setSchema(schema);
      }
    };
  }
  const schemaByRequest = /* @__PURE__ */ new WeakMap();
  return {
    onRequestParse({ request, serverContext }) {
      return {
        async onRequestParseDone() {
          const schema = await schemaDef({
            ...serverContext,
            request
          });
          schemaByRequest.set(request, schema);
        }
      };
    },
    onEnveloped({ setSchema, context }) {
      if (context?.request == null) {
        throw new Error("Request object is not available in the context. Make sure you use this plugin with GraphQL Yoga.");
      }
      const schema = schemaByRequest.get(context.request);
      if (schema == null) {
        throw new Error(`No schema found for this request. Make sure you use this plugin with GraphQL Yoga.`);
      }
      setSchema(schema);
    }
  };
};

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/schema.js
import { makeExecutableSchema } from "https://esm.sh/@graphql-tools/schema@10.0.6";
function createSchema(opts) {
  return makeExecutableSchema(opts);
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/server.js
import { parse, specifiedRules, validate } from "https://esm.sh/graphql@16.8.2";

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/document-string-map.js
var documentStringMap = /* @__PURE__ */ new WeakMap();

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/utils.js
var envelopIsIntrospectionSymbol = Symbol("ENVELOP_IS_INTROSPECTION");
function isIntrospectionOperationString(operation) {
  return (typeof operation === "string" ? operation : operation.body).indexOf("__schema") !== -1;
}
function getSubscribeArgs(args) {
  return args.length === 1 ? args[0] : {
    schema: args[0],
    document: args[1],
    rootValue: args[2],
    contextValue: args[3],
    variableValues: args[4],
    operationName: args[5],
    fieldResolver: args[6],
    subscribeFieldResolver: args[7]
  };
}
var makeSubscribe = (subscribeFn) => (...polyArgs) => subscribeFn(getSubscribeArgs(polyArgs));
function mapAsyncIterator(source, mapper) {
  const iterator = source[Symbol.asyncIterator]();
  async function mapResult(result) {
    if (result.done) {
      return result;
    }
    try {
      return { value: await mapper(result.value), done: false };
    } catch (error) {
      try {
        await iterator.return?.();
      } catch (_error) {
      }
      throw error;
    }
  }
  const stream = {
    [Symbol.asyncIterator]() {
      return stream;
    },
    async next() {
      return await mapResult(await iterator.next());
    },
    async return() {
      const promise = iterator.return?.();
      return promise ? await mapResult(await promise) : { value: void 0, done: true };
    },
    async throw(error) {
      const promise = iterator.throw?.();
      if (promise) {
        return await mapResult(await promise);
      }
      throw error;
    }
  };
  return stream;
}
function getExecuteArgs(args) {
  return args.length === 1 ? args[0] : {
    schema: args[0],
    document: args[1],
    rootValue: args[2],
    contextValue: args[3],
    variableValues: args[4],
    operationName: args[5],
    fieldResolver: args[6],
    typeResolver: args[7]
  };
}
var makeExecute = (executeFn) => (...polyArgs) => executeFn(getExecuteArgs(polyArgs));
function isAsyncIterable(maybeAsyncIterable) {
  return typeof maybeAsyncIterable === "object" && maybeAsyncIterable != null && typeof maybeAsyncIterable[Symbol.asyncIterator] === "function";
}
function handleStreamOrSingleExecutionResult(payload, fn) {
  if (isAsyncIterable(payload.result)) {
    return { onNext: fn };
  }
  fn({
    args: payload.args,
    result: payload.result,
    setResult: payload.setResult
  });
  return void 0;
}
function finalAsyncIterator(source, onFinal) {
  const iterator = source[Symbol.asyncIterator]();
  let isDone = false;
  const stream = {
    [Symbol.asyncIterator]() {
      return stream;
    },
    async next() {
      const result = await iterator.next();
      if (result.done && isDone === false) {
        isDone = true;
        onFinal();
      }
      return result;
    },
    async return() {
      const promise = iterator.return?.();
      if (isDone === false) {
        isDone = true;
        onFinal();
      }
      return promise ? await promise : { done: true, value: void 0 };
    },
    async throw(error) {
      const promise = iterator.throw?.();
      if (promise) {
        return await promise;
      }
      throw error;
    }
  };
  return stream;
}
function errorAsyncIterator(source, onError) {
  const iterator = source[Symbol.asyncIterator]();
  const stream = {
    [Symbol.asyncIterator]() {
      return stream;
    },
    async next() {
      try {
        return await iterator.next();
      } catch (error) {
        onError(error);
        return { done: true, value: void 0 };
      }
    },
    async return() {
      const promise = iterator.return?.();
      return promise ? await promise : { done: true, value: void 0 };
    },
    async throw(error) {
      const promise = iterator.throw?.();
      if (promise) {
        return await promise;
      }
      throw error;
    }
  };
  return stream;
}

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/orchestrator.js
function throwEngineFunctionError(name) {
  throw Error(`No \`${name}\` function found! Register it using "useEngine" plugin.`);
}
function createEnvelopOrchestrator({ plugins }) {
  let schema = null;
  let initDone = false;
  const parse2 = () => throwEngineFunctionError("parse");
  const validate2 = () => throwEngineFunctionError("validate");
  const execute3 = () => throwEngineFunctionError("execute");
  const subscribe2 = () => throwEngineFunctionError("subscribe");
  const replaceSchema = (newSchema, ignorePluginIndex = -1) => {
    schema = newSchema;
    if (initDone) {
      for (const [i, plugin] of plugins.entries()) {
        if (i !== ignorePluginIndex) {
          plugin.onSchemaChange && plugin.onSchemaChange({
            schema,
            replaceSchema: (schemaToSet) => {
              replaceSchema(schemaToSet, i);
            }
          });
        }
      }
    }
  };
  const contextErrorHandlers = [];
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const pluginsToAdd = [];
    plugin.onPluginInit && plugin.onPluginInit({
      plugins,
      addPlugin: (newPlugin) => {
        pluginsToAdd.push(newPlugin);
      },
      setSchema: (modifiedSchema) => replaceSchema(modifiedSchema, i),
      registerContextErrorHandler: (handler) => contextErrorHandlers.push(handler)
    });
    pluginsToAdd.length && plugins.splice(i + 1, 0, ...pluginsToAdd);
  }
  const beforeCallbacks = {
    init: [],
    parse: [],
    validate: [],
    subscribe: [],
    execute: [],
    context: []
  };
  for (const { onContextBuilding, onExecute, onParse, onSubscribe, onValidate, onEnveloped } of plugins) {
    onEnveloped && beforeCallbacks.init.push(onEnveloped);
    onContextBuilding && beforeCallbacks.context.push(onContextBuilding);
    onExecute && beforeCallbacks.execute.push(onExecute);
    onParse && beforeCallbacks.parse.push(onParse);
    onSubscribe && beforeCallbacks.subscribe.push(onSubscribe);
    onValidate && beforeCallbacks.validate.push(onValidate);
  }
  const init = (initialContext) => {
    for (const [i, onEnveloped] of beforeCallbacks.init.entries()) {
      onEnveloped({
        context: initialContext,
        extendContext: (extension) => {
          if (!initialContext) {
            return;
          }
          Object.assign(initialContext, extension);
        },
        setSchema: (modifiedSchema) => replaceSchema(modifiedSchema, i)
      });
    }
  };
  const customParse = beforeCallbacks.parse.length ? (initialContext) => (source, parseOptions) => {
    let result = null;
    let parseFn = parse2;
    const context = initialContext;
    const afterCalls = [];
    for (const onParse of beforeCallbacks.parse) {
      const afterFn = onParse({
        context,
        extendContext: (extension) => {
          Object.assign(context, extension);
        },
        params: { source, options: parseOptions },
        parseFn,
        setParseFn: (newFn) => {
          parseFn = newFn;
        },
        setParsedDocument: (newDoc) => {
          result = newDoc;
        }
      });
      afterFn && afterCalls.push(afterFn);
    }
    if (result === null) {
      try {
        result = parseFn(source, parseOptions);
      } catch (e) {
        result = e;
      }
    }
    for (const afterCb of afterCalls) {
      afterCb({
        context,
        extendContext: (extension) => {
          Object.assign(context, extension);
        },
        replaceParseResult: (newResult) => {
          result = newResult;
        },
        result
      });
    }
    if (result === null) {
      throw new Error(`Failed to parse document.`);
    }
    if (result instanceof Error) {
      throw result;
    }
    documentStringMap.set(result, source.toString());
    return result;
  } : () => parse2;
  const customValidate = beforeCallbacks.validate.length ? (initialContext) => (schema2, documentAST, rules, typeInfo, validationOptions) => {
    let actualRules = rules ? [...rules] : void 0;
    let validateFn = validate2;
    let result = null;
    const context = initialContext;
    const afterCalls = [];
    for (const onValidate of beforeCallbacks.validate) {
      const afterFn = onValidate({
        context,
        extendContext: (extension) => {
          Object.assign(context, extension);
        },
        params: {
          schema: schema2,
          documentAST,
          rules: actualRules,
          typeInfo,
          options: validationOptions
        },
        validateFn,
        addValidationRule: (rule) => {
          if (!actualRules) {
            actualRules = [];
          }
          actualRules.push(rule);
        },
        setValidationFn: (newFn) => {
          validateFn = newFn;
        },
        setResult: (newResults) => {
          result = newResults;
        }
      });
      afterFn && afterCalls.push(afterFn);
    }
    if (!result) {
      result = validateFn(schema2, documentAST, actualRules, typeInfo, validationOptions);
    }
    if (!result) {
      return;
    }
    const valid = result.length === 0;
    for (const afterCb of afterCalls) {
      afterCb({
        valid,
        result,
        context,
        extendContext: (extension) => {
          Object.assign(context, extension);
        },
        setResult: (newResult) => {
          result = newResult;
        }
      });
    }
    return result;
  } : () => validate2;
  const customContextFactory = beforeCallbacks.context.length ? (initialContext) => async (orchestratorCtx) => {
    const afterCalls = [];
    const context = initialContext;
    if (orchestratorCtx) {
      Object.assign(context, orchestratorCtx);
    }
    try {
      let isBreakingContextBuilding = false;
      for (const onContext of beforeCallbacks.context) {
        const afterHookResult = await onContext({
          context,
          extendContext: (extension) => {
            Object.assign(context, extension);
          },
          breakContextBuilding: () => {
            isBreakingContextBuilding = true;
          }
        });
        if (typeof afterHookResult === "function") {
          afterCalls.push(afterHookResult);
        }
        if (isBreakingContextBuilding === true) {
          break;
        }
      }
      for (const afterCb of afterCalls) {
        afterCb({
          context,
          extendContext: (extension) => {
            Object.assign(context, extension);
          }
        });
      }
      return context;
    } catch (err) {
      let error = err;
      for (const errorCb of contextErrorHandlers) {
        errorCb({
          context,
          error,
          setError: (err2) => {
            error = err2;
          }
        });
      }
      throw error;
    }
  } : (initialContext) => (orchestratorCtx) => {
    if (orchestratorCtx) {
      Object.assign(initialContext, orchestratorCtx);
    }
    return initialContext;
  };
  const useCustomSubscribe = beforeCallbacks.subscribe.length;
  const customSubscribe = useCustomSubscribe ? makeSubscribe(async (args) => {
    let subscribeFn = subscribe2;
    const afterCalls = [];
    const subscribeErrorHandlers = [];
    const context = args.contextValue || {};
    let result;
    for (const onSubscribe of beforeCallbacks.subscribe) {
      const after = await onSubscribe({
        subscribeFn,
        setSubscribeFn: (newSubscribeFn) => {
          subscribeFn = newSubscribeFn;
        },
        extendContext: (extension) => {
          Object.assign(context, extension);
        },
        args,
        setResultAndStopExecution: (stopResult) => {
          result = stopResult;
        }
      });
      if (after) {
        if (after.onSubscribeResult) {
          afterCalls.push(after.onSubscribeResult);
        }
        if (after.onSubscribeError) {
          subscribeErrorHandlers.push(after.onSubscribeError);
        }
      }
      if (result !== void 0) {
        break;
      }
    }
    if (result === void 0) {
      result = await subscribeFn({
        ...args,
        contextValue: context
        // Casted for GraphQL.js 15 compatibility
        // Can be removed once we drop support for GraphQL.js 15
      });
    }
    if (!result) {
      return;
    }
    const onNextHandler = [];
    const onEndHandler = [];
    for (const afterCb of afterCalls) {
      const hookResult = afterCb({
        args,
        result,
        setResult: (newResult) => {
          result = newResult;
        }
      });
      if (hookResult) {
        if (hookResult.onNext) {
          onNextHandler.push(hookResult.onNext);
        }
        if (hookResult.onEnd) {
          onEndHandler.push(hookResult.onEnd);
        }
      }
    }
    if (onNextHandler.length && isAsyncIterable(result)) {
      result = mapAsyncIterator(result, async (result2) => {
        for (const onNext of onNextHandler) {
          await onNext({
            args,
            result: result2,
            setResult: (newResult) => result2 = newResult
          });
        }
        return result2;
      });
    }
    if (onEndHandler.length && isAsyncIterable(result)) {
      result = finalAsyncIterator(result, () => {
        for (const onEnd of onEndHandler) {
          onEnd();
        }
      });
    }
    if (subscribeErrorHandlers.length && isAsyncIterable(result)) {
      result = errorAsyncIterator(result, (err) => {
        let error = err;
        for (const handler of subscribeErrorHandlers) {
          handler({
            error,
            setError: (err2) => {
              error = err2;
            }
          });
        }
        throw error;
      });
    }
    return result;
  }) : makeSubscribe(subscribe2);
  const useCustomExecute = beforeCallbacks.execute.length;
  const customExecute = useCustomExecute ? makeExecute(async (args) => {
    let executeFn = execute3;
    let result;
    const afterCalls = [];
    const context = args.contextValue || {};
    for (const onExecute of beforeCallbacks.execute) {
      const after = await onExecute({
        executeFn,
        setExecuteFn: (newExecuteFn) => {
          executeFn = newExecuteFn;
        },
        setResultAndStopExecution: (stopResult) => {
          result = stopResult;
        },
        extendContext: (extension) => {
          if (typeof extension === "object") {
            Object.assign(context, extension);
          } else {
            throw new Error(`Invalid context extension provided! Expected "object", got: "${JSON.stringify(extension)}" (${typeof extension})`);
          }
        },
        args
      });
      if (after?.onExecuteDone) {
        afterCalls.push(after.onExecuteDone);
      }
      if (result !== void 0) {
        break;
      }
    }
    if (result === void 0) {
      result = await executeFn({
        ...args,
        contextValue: context
      });
    }
    const onNextHandler = [];
    const onEndHandler = [];
    for (const afterCb of afterCalls) {
      const hookResult = await afterCb({
        args,
        result,
        setResult: (newResult) => {
          result = newResult;
        }
      });
      if (hookResult) {
        if (hookResult.onNext) {
          onNextHandler.push(hookResult.onNext);
        }
        if (hookResult.onEnd) {
          onEndHandler.push(hookResult.onEnd);
        }
      }
    }
    if (onNextHandler.length && isAsyncIterable(result)) {
      result = mapAsyncIterator(result, async (result2) => {
        for (const onNext of onNextHandler) {
          await onNext({
            args,
            result: result2,
            setResult: (newResult) => {
              result2 = newResult;
            }
          });
        }
        return result2;
      });
    }
    if (onEndHandler.length && isAsyncIterable(result)) {
      result = finalAsyncIterator(result, () => {
        for (const onEnd of onEndHandler) {
          onEnd();
        }
      });
    }
    return result;
  }) : makeExecute(execute3);
  initDone = true;
  if (schema) {
    for (const [i, plugin] of plugins.entries()) {
      plugin.onSchemaChange && plugin.onSchemaChange({
        schema,
        replaceSchema: (modifiedSchema) => replaceSchema(modifiedSchema, i)
      });
    }
  }
  return {
    getCurrentSchema() {
      return schema;
    },
    init,
    parse: customParse,
    validate: customValidate,
    execute: customExecute,
    subscribe: customSubscribe,
    contextFactory: customContextFactory
  };
}

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/create.js
function notEmpty(value) {
  return value != null;
}
function envelop(options) {
  const plugins = options.plugins.filter(notEmpty);
  const orchestrator = createEnvelopOrchestrator({
    plugins
  });
  const getEnveloped = (initialContext = {}) => {
    const typedOrchestrator = orchestrator;
    typedOrchestrator.init(initialContext);
    return {
      parse: typedOrchestrator.parse(initialContext),
      validate: typedOrchestrator.validate(initialContext),
      contextFactory: typedOrchestrator.contextFactory(initialContext),
      execute: typedOrchestrator.execute,
      subscribe: typedOrchestrator.subscribe,
      schema: typedOrchestrator.getCurrentSchema()
    };
  };
  getEnveloped._plugins = plugins;
  return getEnveloped;
}

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/plugins/use-envelop.js
var useEnvelop = (envelop2) => {
  let initialized = false;
  return {
    onPluginInit({ addPlugin }) {
      if (initialized) {
        return;
      }
      for (const plugin of envelop2._plugins) {
        addPlugin(plugin);
      }
      initialized = true;
    }
  };
};

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/plugins/use-logger.js
var DEFAULT_OPTIONS = {
  logFn: console.log
};
var useLogger = (rawOptions = DEFAULT_OPTIONS) => {
  const options = {
    DEFAULT_OPTIONS,
    ...rawOptions
  };
  return {
    onParse({ extendContext, params }) {
      if (options.skipIntrospection && isIntrospectionOperationString(params.source)) {
        extendContext({
          [envelopIsIntrospectionSymbol]: true
        });
      }
    },
    onExecute({ args }) {
      if (args.contextValue[envelopIsIntrospectionSymbol]) {
        return;
      }
      options.logFn("execute-start", { args });
      return {
        onExecuteDone: ({ result }) => {
          options.logFn("execute-end", { args, result });
        }
      };
    },
    onSubscribe({ args }) {
      if (args.contextValue[envelopIsIntrospectionSymbol]) {
        return;
      }
      options.logFn("subscribe-start", { args });
      return {
        onSubscribeResult: ({ result }) => {
          options.logFn("subscribe-end", { args, result });
        }
      };
    }
  };
};

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/plugins/use-masked-errors.js
var DEFAULT_ERROR_MESSAGE = "Unexpected error.";
function isGraphQLError2(error) {
  return error instanceof Error && error.name === "GraphQLError";
}
function isOriginalGraphQLError2(error) {
  if (isGraphQLError2(error)) {
    if (error.originalError != null) {
      return isOriginalGraphQLError2(error.originalError);
    }
    return true;
  }
  return false;
}
function createSerializableGraphQLError(message, originalError, isDev2) {
  const error = new Error(message);
  error.name = "GraphQLError";
  if (isDev2) {
    const extensions = originalError instanceof Error ? { message: originalError.message, stack: originalError.stack } : { message: String(originalError) };
    Object.defineProperty(error, "extensions", {
      get() {
        return extensions;
      }
    });
  }
  Object.defineProperty(error, "toJSON", {
    value() {
      return {
        message: error.message,
        extensions: error.extensions
      };
    }
  });
  return error;
}
var createDefaultMaskError = (isDev2) => (error, message) => {
  if (isOriginalGraphQLError2(error)) {
    return error;
  }
  return createSerializableGraphQLError(message, error, isDev2);
};
var isDev = globalThis.process?.env?.NODE_ENV === "development";
var defaultMaskError = createDefaultMaskError(isDev);
var makeHandleResult = (maskError2, message) => ({ result, setResult }) => {
  if (result.errors != null) {
    setResult({ ...result, errors: result.errors.map((error) => maskError2(error, message)) });
  }
};
function useMaskedErrors(opts) {
  const maskError2 = opts?.maskError ?? defaultMaskError;
  const message = opts?.errorMessage || DEFAULT_ERROR_MESSAGE;
  const handleResult = makeHandleResult(maskError2, message);
  return {
    onPluginInit(context) {
      context.registerContextErrorHandler(({ error, setError }) => {
        setError(maskError2(error, message));
      });
    },
    onExecute() {
      return {
        onExecuteDone(payload) {
          return handleStreamOrSingleExecutionResult(payload, handleResult);
        }
      };
    },
    onSubscribe() {
      return {
        onSubscribeResult(payload) {
          return handleStreamOrSingleExecutionResult(payload, handleResult);
        },
        onSubscribeError({ error, setError }) {
          setError(maskError2(error, message));
        }
      };
    }
  };
}

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/plugins/use-error-handler.js
var makeHandleResult2 = (errorHandler) => ({ result, args }) => {
  if (result.errors?.length) {
    errorHandler({ errors: result.errors, context: args, phase: "execution" });
  }
};
var useErrorHandler = (errorHandler) => {
  const handleResult = makeHandleResult2(errorHandler);
  return {
    onParse() {
      return function onParseEnd({ result, context }) {
        if (result instanceof Error) {
          errorHandler({ errors: [result], context, phase: "parse" });
        }
      };
    },
    onValidate() {
      return function onValidateEnd({ valid, result, context }) {
        if (valid === false && result.length > 0) {
          errorHandler({ errors: result, context, phase: "validate" });
        }
      };
    },
    onPluginInit(context) {
      context.registerContextErrorHandler(({ error }) => {
        if (isGraphQLError2(error)) {
          errorHandler({ errors: [error], context, phase: "context" });
        } else {
          errorHandler({ errors: [new Error(error)], context, phase: "context" });
        }
      });
    },
    onExecute() {
      return {
        onExecuteDone(payload) {
          return handleStreamOrSingleExecutionResult(payload, handleResult);
        }
      };
    },
    onSubscribe() {
      return {
        onSubscribeResult(payload) {
          return handleStreamOrSingleExecutionResult(payload, handleResult);
        }
      };
    }
  };
};

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/plugins/use-extend-context.js
var useExtendContext = (contextFactory) => ({
  async onContextBuilding({ context, extendContext }) {
    extendContext(await contextFactory(context));
  }
});

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/plugins/use-payload-formatter.js
var makeHandleResult3 = (formatter) => ({ args, result, setResult }) => {
  const modified = formatter(result, args);
  if (modified !== false) {
    setResult(modified);
  }
};
var usePayloadFormatter = (formatter) => ({
  onExecute() {
    const handleResult = makeHandleResult3(formatter);
    return {
      onExecuteDone(payload) {
        return handleStreamOrSingleExecutionResult(payload, handleResult);
      }
    };
  }
});

// ../../../node_modules/.pnpm/@envelop+core@5.0.1/node_modules/@envelop/core/esm/plugins/use-engine.js
var useEngine = (engine) => {
  return {
    onExecute: ({ setExecuteFn }) => {
      if (engine.execute) {
        setExecuteFn(engine.execute);
      }
    },
    onParse: ({ setParseFn }) => {
      if (engine.parse) {
        setParseFn(engine.parse);
      }
    },
    onValidate: ({ setValidationFn, addValidationRule }) => {
      if (engine.validate) {
        setValidationFn(engine.validate);
      }
      engine.specifiedRules?.map(addValidationRule);
    },
    onSubscribe: ({ setSubscribeFn }) => {
      if (engine.subscribe) {
        setSubscribeFn(engine.subscribe);
      }
    }
  };
};

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/execute.js
import { assertValidSchema, getDirectiveValues, GraphQLError as GraphQLError2, isAbstractType, isLeafType, isListType, isNonNullType as isNonNullType2, isObjectType, Kind, locatedError, SchemaMetaFieldDef, TypeMetaFieldDef, TypeNameMetaFieldDef, versionInfo } from "https://esm.sh/graphql@16.8.2";

// ../../../node_modules/.pnpm/value-or-promise@1.0.12/node_modules/value-or-promise/build/module/ValueOrPromise.js
function isPromiseLike(object) {
  return object != null && typeof object.then === "function";
}
var defaultOnRejectedFn = (reason) => {
  throw reason;
};
var ValueOrPromise = class _ValueOrPromise {
  state;
  constructor(executor) {
    let value;
    try {
      value = executor();
    } catch (reason) {
      this.state = { status: "rejected", value: reason };
      return;
    }
    if (isPromiseLike(value)) {
      this.state = { status: "pending", value };
      return;
    }
    this.state = { status: "fulfilled", value };
  }
  then(onFulfilled, onRejected) {
    const state = this.state;
    if (state.status === "pending") {
      return new _ValueOrPromise(() => state.value.then(onFulfilled, onRejected));
    }
    const onRejectedFn = typeof onRejected === "function" ? onRejected : defaultOnRejectedFn;
    if (state.status === "rejected") {
      return new _ValueOrPromise(() => onRejectedFn(state.value));
    }
    try {
      const onFulfilledFn = typeof onFulfilled === "function" ? onFulfilled : void 0;
      return onFulfilledFn === void 0 ? new _ValueOrPromise(() => state.value) : new _ValueOrPromise(() => onFulfilledFn(state.value));
    } catch (e) {
      return new _ValueOrPromise(() => onRejectedFn(e));
    }
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  resolve() {
    const state = this.state;
    if (state.status === "pending") {
      return Promise.resolve(state.value);
    }
    if (state.status === "rejected") {
      throw state.value;
    }
    return state.value;
  }
  static all(valueOrPromises) {
    let rejected = false;
    let reason;
    let containsPromise = false;
    const values = [];
    for (const valueOrPromise of valueOrPromises) {
      const state = valueOrPromise.state;
      if (state.status === "rejected") {
        if (rejected) {
          continue;
        }
        rejected = true;
        reason = state.value;
        continue;
      }
      if (state.status === "pending") {
        containsPromise = true;
      }
      values.push(state.value);
    }
    if (containsPromise) {
      if (rejected) {
        Promise.all(values).catch(() => {
        });
        return new _ValueOrPromise(() => {
          throw reason;
        });
      }
      return new _ValueOrPromise(() => Promise.all(values));
    }
    return new _ValueOrPromise(() => values);
  }
};

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/execute.js
import { collectSubFields as _collectSubfields, addPath, collectFields, createGraphQLError as createGraphQLError3, getArgumentValues, getDefinedRootType, GraphQLStreamDirective, inspect as inspect2, isAsyncIterable as isAsyncIterable2, isIterableObject, isObjectLike, isPromise, mapAsyncIterator as mapAsyncIterator2, memoize1, memoize3, pathToArray, promiseReduce } from "https://esm.sh/@graphql-tools/utils@10.5.4";

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/coerceError.js
function coerceError(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error != null) {
    if ("message" in error && typeof error.message === "string") {
      let errorOptions;
      if ("cause" in error) {
        errorOptions = { cause: error.cause };
      }
      const coercedError = new Error(error.message, errorOptions);
      if ("stack" in error && typeof error.stack === "string") {
        coercedError.stack = error.stack;
      }
      if ("name" in error && typeof error.name === "string") {
        coercedError.name = error.name;
      }
      return coercedError;
    }
  }
  return new Error(String(error));
}

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/flattenAsyncIterable.js
function flattenAsyncIterable(iterable) {
  const topIterator = iterable[Symbol.asyncIterator]();
  let currentNestedIterator;
  let waitForCurrentNestedIterator;
  let done = false;
  async function next() {
    if (done) {
      return { value: void 0, done: true };
    }
    try {
      if (!currentNestedIterator) {
        if (waitForCurrentNestedIterator) {
          await waitForCurrentNestedIterator;
          return await next();
        }
        let resolve;
        waitForCurrentNestedIterator = new Promise((r) => {
          resolve = r;
        });
        const topIteratorResult = await topIterator.next();
        if (topIteratorResult.done) {
          done = true;
          return await next();
        }
        currentNestedIterator = topIteratorResult.value[Symbol.asyncIterator]();
        waitForCurrentNestedIterator = void 0;
        resolve();
        return await next();
      }
      const rememberCurrentNestedIterator = currentNestedIterator;
      const nestedIteratorResult = await currentNestedIterator.next();
      if (!nestedIteratorResult.done) {
        return nestedIteratorResult;
      }
      if (currentNestedIterator === rememberCurrentNestedIterator) {
        currentNestedIterator = void 0;
      }
      return await next();
    } catch (err) {
      done = true;
      throw err;
    }
  }
  return {
    next,
    async return() {
      done = true;
      await Promise.all([currentNestedIterator?.return?.(), topIterator.return?.()]);
      return { value: void 0, done: true };
    },
    async throw(error) {
      done = true;
      await Promise.all([currentNestedIterator?.throw?.(error), topIterator.throw?.(error)]);
      throw error;
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/invariant.js
function invariant(condition, message) {
  if (!condition) {
    throw new Error(message != null ? message : "Unexpected invariant triggered.");
  }
}

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/promiseForObject.js
async function promiseForObject(object, signal) {
  const resolvedObject = /* @__PURE__ */ Object.create(null);
  await new Promise((resolve, reject2) => {
    signal?.addEventListener("abort", () => {
      reject2(signal.reason);
    });
    Promise.all(Object.entries(object).map(async ([key, value]) => {
      resolvedObject[key] = await value;
    })).then(() => resolve(), reject2);
  });
  return resolvedObject;
}

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/values.js
import { coerceInputValue, isInputType, isNonNullType, print, typeFromAST, valueFromAST } from "https://esm.sh/graphql@16.8.2";
import { createGraphQLError as createGraphQLError2, hasOwnProperty, inspect, printPathArray } from "https://esm.sh/@graphql-tools/utils@10.5.4";
function getVariableValues(schema, varDefNodes, inputs, options) {
  const errors = [];
  const maxErrors = options?.maxErrors;
  try {
    const coerced = coerceVariableValues(schema, varDefNodes, inputs, (error) => {
      if (maxErrors != null && errors.length >= maxErrors) {
        throw createGraphQLError2("Too many errors processing variables, error limit reached. Execution aborted.");
      }
      errors.push(error);
    });
    if (errors.length === 0) {
      return { coerced };
    }
  } catch (error) {
    errors.push(error);
  }
  return { errors };
}
function coerceVariableValues(schema, varDefNodes, inputs, onError) {
  const coercedValues = {};
  for (const varDefNode of varDefNodes) {
    const varName = varDefNode.variable.name.value;
    const varType = typeFromAST(schema, varDefNode.type);
    if (!isInputType(varType)) {
      const varTypeStr = print(varDefNode.type);
      onError(createGraphQLError2(`Variable "$${varName}" expected value of type "${varTypeStr}" which cannot be used as an input type.`, { nodes: varDefNode.type }));
      continue;
    }
    if (!hasOwnProperty(inputs, varName)) {
      if (varDefNode.defaultValue) {
        coercedValues[varName] = valueFromAST(varDefNode.defaultValue, varType);
      } else if (isNonNullType(varType)) {
        const varTypeStr = inspect(varType);
        onError(createGraphQLError2(`Variable "$${varName}" of required type "${varTypeStr}" was not provided.`, {
          nodes: varDefNode
        }));
      }
      continue;
    }
    const value = inputs[varName];
    if (value === null && isNonNullType(varType)) {
      const varTypeStr = inspect(varType);
      onError(createGraphQLError2(`Variable "$${varName}" of non-null type "${varTypeStr}" must not be null.`, {
        nodes: varDefNode
      }));
      continue;
    }
    coercedValues[varName] = coerceInputValue(value, varType, (path, invalidValue, error) => {
      let prefix = `Variable "$${varName}" got invalid value ` + inspect(invalidValue);
      if (path.length > 0) {
        prefix += ` at "${varName}${printPathArray(path)}"`;
      }
      onError(createGraphQLError2(prefix + "; " + error.message, {
        nodes: varDefNode,
        originalError: error
      }));
    });
  }
  return coercedValues;
}

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/execute.js
var collectSubfields = memoize3((exeContext, returnType, fieldNodes) => _collectSubfields(exeContext.schema, exeContext.fragments, exeContext.variableValues, returnType, fieldNodes));
function execute(args) {
  const exeContext = buildExecutionContext(args);
  if (!("schema" in exeContext)) {
    return {
      errors: exeContext.map((e) => {
        Object.defineProperty(e, "extensions", {
          value: {
            ...e.extensions,
            http: {
              ...e.extensions?.["http"],
              status: 400
            }
          }
        });
        return e;
      })
    };
  }
  return executeImpl(exeContext);
}
function executeImpl(exeContext) {
  if (exeContext.signal?.aborted) {
    throw exeContext.signal.reason;
  }
  const result = new ValueOrPromise(() => executeOperation(exeContext)).then((data) => {
    const initialResult = buildResponse(data, exeContext.errors);
    if (exeContext.subsequentPayloads.size > 0) {
      return {
        initialResult: {
          ...initialResult,
          hasNext: true
        },
        subsequentResults: yieldSubsequentPayloads(exeContext)
      };
    }
    return initialResult;
  }, (error) => {
    if (exeContext.signal?.aborted) {
      throw exeContext.signal.reason;
    }
    if (error.errors) {
      exeContext.errors.push(...error.errors);
    } else {
      exeContext.errors.push(error);
    }
    return buildResponse(null, exeContext.errors);
  }).resolve();
  return result;
}
function buildResponse(data, errors) {
  return errors.length === 0 ? { data } : { errors, data };
}
var getFragmentsFromDocument = memoize1(function getFragmentsFromDocument2(document) {
  const fragments = /* @__PURE__ */ Object.create(null);
  for (const definition of document.definitions) {
    if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      fragments[definition.name.value] = definition;
    }
  }
  return fragments;
});
function buildExecutionContext(args) {
  const { schema, document, rootValue, contextValue, variableValues: rawVariableValues, operationName, fieldResolver, typeResolver, subscribeFieldResolver, signal } = args;
  assertValidSchema(schema);
  const fragments = getFragmentsFromDocument(document);
  let operation;
  for (const definition of document.definitions) {
    switch (definition.kind) {
      case Kind.OPERATION_DEFINITION:
        if (operationName == null) {
          if (operation !== void 0) {
            return [
              createGraphQLError3("Must provide operation name if query contains multiple operations.")
            ];
          }
          operation = definition;
        } else if (definition.name?.value === operationName) {
          operation = definition;
        }
        break;
      default:
    }
  }
  if (operation == null) {
    if (operationName != null) {
      return [createGraphQLError3(`Unknown operation named "${operationName}".`)];
    }
    return [createGraphQLError3("Must provide an operation.")];
  }
  const variableDefinitions = operation.variableDefinitions ?? [];
  const coercedVariableValues = getVariableValues(schema, variableDefinitions, rawVariableValues ?? {}, {
    maxErrors: 50
  });
  if (coercedVariableValues.errors) {
    return coercedVariableValues.errors;
  }
  return {
    schema,
    fragments,
    rootValue,
    contextValue,
    operation,
    variableValues: coercedVariableValues.coerced,
    fieldResolver: fieldResolver ?? defaultFieldResolver,
    typeResolver: typeResolver ?? defaultTypeResolver,
    subscribeFieldResolver: subscribeFieldResolver ?? defaultFieldResolver,
    subsequentPayloads: /* @__PURE__ */ new Set(),
    errors: [],
    signal
  };
}
function buildPerEventExecutionContext(exeContext, payload) {
  return {
    ...exeContext,
    rootValue: payload,
    subsequentPayloads: /* @__PURE__ */ new Set(),
    errors: []
  };
}
function executeOperation(exeContext) {
  const { operation, schema, fragments, variableValues, rootValue } = exeContext;
  const rootType = getDefinedRootType(schema, operation.operation, [operation]);
  if (rootType == null) {
    createGraphQLError3(`Schema is not configured to execute ${operation.operation} operation.`, {
      nodes: operation
    });
  }
  const { fields: rootFields, patches } = collectFields(schema, fragments, variableValues, rootType, operation.selectionSet);
  const path = void 0;
  let result;
  if (operation.operation === "mutation") {
    result = executeFieldsSerially(exeContext, rootType, rootValue, path, rootFields);
  } else {
    result = executeFields(exeContext, rootType, rootValue, path, rootFields);
  }
  for (const patch of patches) {
    const { label, fields: patchFields } = patch;
    executeDeferredFragment(exeContext, rootType, rootValue, patchFields, label, path);
  }
  return result;
}
function executeFieldsSerially(exeContext, parentType, sourceValue, path, fields) {
  return promiseReduce(fields, (results, [responseName, fieldNodes]) => {
    const fieldPath = addPath(path, responseName, parentType.name);
    if (exeContext.signal?.aborted) {
      throw exeContext.signal.reason;
    }
    return new ValueOrPromise(() => executeField(exeContext, parentType, sourceValue, fieldNodes, fieldPath)).then((result) => {
      if (result === void 0) {
        return results;
      }
      results[responseName] = result;
      return results;
    });
  }, /* @__PURE__ */ Object.create(null)).resolve();
}
function executeFields(exeContext, parentType, sourceValue, path, fields, asyncPayloadRecord) {
  const results = /* @__PURE__ */ Object.create(null);
  let containsPromise = false;
  try {
    for (const [responseName, fieldNodes] of fields) {
      if (exeContext.signal?.aborted) {
        throw exeContext.signal.reason;
      }
      const fieldPath = addPath(path, responseName, parentType.name);
      const result = executeField(exeContext, parentType, sourceValue, fieldNodes, fieldPath, asyncPayloadRecord);
      if (result !== void 0) {
        results[responseName] = result;
        if (isPromise(result)) {
          containsPromise = true;
        }
      }
    }
  } catch (error) {
    if (containsPromise) {
      return promiseForObject(results, exeContext.signal).finally(() => {
        throw error;
      });
    }
    throw error;
  }
  if (!containsPromise) {
    return results;
  }
  return promiseForObject(results, exeContext.signal);
}
function executeField(exeContext, parentType, source, fieldNodes, path, asyncPayloadRecord) {
  const errors = asyncPayloadRecord?.errors ?? exeContext.errors;
  const fieldDef = getFieldDef(exeContext.schema, parentType, fieldNodes[0]);
  if (!fieldDef) {
    return;
  }
  const returnType = fieldDef.type;
  const resolveFn = fieldDef.resolve ?? exeContext.fieldResolver;
  const info = buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path);
  try {
    const args = getArgumentValues(fieldDef, fieldNodes[0], exeContext.variableValues);
    const contextValue = exeContext.contextValue;
    const result = resolveFn(source, args, contextValue, info);
    let completed;
    if (isPromise(result)) {
      completed = result.then((resolved) => completeValue(exeContext, returnType, fieldNodes, info, path, resolved, asyncPayloadRecord));
    } else {
      completed = completeValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
    }
    if (isPromise(completed)) {
      return completed.then(void 0, (rawError) => {
        if (rawError instanceof AggregateError) {
          return new AggregateError(rawError.errors.map((rawErrorItem) => {
            rawErrorItem = coerceError(rawErrorItem);
            const error2 = locatedError(rawErrorItem, fieldNodes, pathToArray(path));
            const handledError2 = handleFieldError(error2, returnType, errors);
            filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
            return handledError2;
          }));
        }
        rawError = coerceError(rawError);
        const error = locatedError(rawError, fieldNodes, pathToArray(path));
        const handledError = handleFieldError(error, returnType, errors);
        filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
        return handledError;
      });
    }
    return completed;
  } catch (rawError) {
    if (rawError instanceof AggregateError) {
      return new AggregateError(rawError.errors.map((rawErrorItem) => {
        const coercedError2 = coerceError(rawErrorItem);
        const error2 = locatedError(coercedError2, fieldNodes, pathToArray(path));
        return handleFieldError(error2, returnType, errors);
      }));
    }
    const coercedError = coerceError(rawError);
    const error = locatedError(coercedError, fieldNodes, pathToArray(path));
    const handledError = handleFieldError(error, returnType, errors);
    filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
    return handledError;
  }
}
function buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path) {
  return {
    fieldName: fieldDef.name,
    fieldNodes,
    returnType: fieldDef.type,
    parentType,
    path,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues
  };
}
var CRITICAL_ERROR = "CRITICAL_ERROR";
function handleFieldError(error, returnType, errors) {
  if (isNonNullType2(returnType)) {
    throw error;
  }
  if (error.extensions?.[CRITICAL_ERROR]) {
    throw error;
  }
  errors.push(error);
  return null;
}
function completeValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  if (result instanceof Error) {
    throw result;
  }
  if (isNonNullType2(returnType)) {
    const completed = completeValue(exeContext, returnType.ofType, fieldNodes, info, path, result, asyncPayloadRecord);
    if (completed === null) {
      throw new Error(`Cannot return null for non-nullable field ${info.parentType.name}.${info.fieldName}.`);
    }
    return completed;
  }
  if (result == null) {
    return null;
  }
  if (isListType(returnType)) {
    return completeListValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
  }
  if (isLeafType(returnType)) {
    return completeLeafValue(returnType, result);
  }
  if (isAbstractType(returnType)) {
    return completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
  }
  if (isObjectType(returnType)) {
    return completeObjectValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord);
  }
  console.assert(false, "Cannot complete value of unexpected output type: " + inspect2(returnType));
}
function getStreamValues(exeContext, fieldNodes, path) {
  if (typeof path.key === "number") {
    return;
  }
  const stream = getDirectiveValues(GraphQLStreamDirective, fieldNodes[0], exeContext.variableValues);
  if (!stream) {
    return;
  }
  if (stream.if === false) {
    return;
  }
  invariant(typeof stream["initialCount"] === "number", "initialCount must be a number");
  invariant(stream["initialCount"] >= 0, "initialCount must be a positive integer");
  return {
    initialCount: stream["initialCount"],
    label: typeof stream["label"] === "string" ? stream["label"] : void 0
  };
}
async function completeAsyncIteratorValue(exeContext, itemType, fieldNodes, info, path, iterator, asyncPayloadRecord) {
  exeContext.signal?.addEventListener("abort", () => {
    iterator.return?.();
  });
  const errors = asyncPayloadRecord?.errors ?? exeContext.errors;
  const stream = getStreamValues(exeContext, fieldNodes, path);
  let containsPromise = false;
  const completedResults = [];
  let index = 0;
  while (true) {
    if (stream && typeof stream.initialCount === "number" && index >= stream.initialCount) {
      executeStreamIterator(index, iterator, exeContext, fieldNodes, info, itemType, path, stream.label, asyncPayloadRecord);
      break;
    }
    const itemPath = addPath(path, index, void 0);
    let iteration;
    try {
      iteration = await iterator.next();
      if (iteration.done) {
        break;
      }
    } catch (rawError) {
      const coercedError = coerceError(rawError);
      const error = locatedError(coercedError, fieldNodes, pathToArray(itemPath));
      completedResults.push(handleFieldError(error, itemType, errors));
      break;
    }
    if (completeListItemValue(iteration.value, completedResults, errors, exeContext, itemType, fieldNodes, info, itemPath, asyncPayloadRecord)) {
      containsPromise = true;
    }
    index += 1;
  }
  return containsPromise ? Promise.all(completedResults) : completedResults;
}
function completeListValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  const itemType = returnType.ofType;
  const errors = asyncPayloadRecord?.errors ?? exeContext.errors;
  if (isAsyncIterable2(result)) {
    const iterator = result[Symbol.asyncIterator]();
    return completeAsyncIteratorValue(exeContext, itemType, fieldNodes, info, path, iterator, asyncPayloadRecord);
  }
  if (!isIterableObject(result)) {
    throw createGraphQLError3(`Expected Iterable, but did not find one for field "${info.parentType.name}.${info.fieldName}".`);
  }
  const stream = getStreamValues(exeContext, fieldNodes, path);
  let containsPromise = false;
  let previousAsyncPayloadRecord = asyncPayloadRecord;
  const completedResults = [];
  let index = 0;
  for (const item of result) {
    const itemPath = addPath(path, index, void 0);
    if (stream && typeof stream.initialCount === "number" && index >= stream.initialCount) {
      previousAsyncPayloadRecord = executeStreamField(path, itemPath, item, exeContext, fieldNodes, info, itemType, stream.label, previousAsyncPayloadRecord);
      index++;
      continue;
    }
    if (completeListItemValue(item, completedResults, errors, exeContext, itemType, fieldNodes, info, itemPath, asyncPayloadRecord)) {
      containsPromise = true;
    }
    index++;
  }
  return containsPromise ? Promise.all(completedResults) : completedResults;
}
function completeListItemValue(item, completedResults, errors, exeContext, itemType, fieldNodes, info, itemPath, asyncPayloadRecord) {
  try {
    let completedItem;
    if (isPromise(item)) {
      completedItem = item.then((resolved) => completeValue(exeContext, itemType, fieldNodes, info, itemPath, resolved, asyncPayloadRecord));
    } else {
      completedItem = completeValue(exeContext, itemType, fieldNodes, info, itemPath, item, asyncPayloadRecord);
    }
    if (isPromise(completedItem)) {
      completedResults.push(completedItem.then(void 0, (rawError) => {
        rawError = coerceError(rawError);
        const error = locatedError(rawError, fieldNodes, pathToArray(itemPath));
        const handledError = handleFieldError(error, itemType, errors);
        filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
        return handledError;
      }));
      return true;
    }
    completedResults.push(completedItem);
  } catch (rawError) {
    const coercedError = coerceError(rawError);
    const error = locatedError(coercedError, fieldNodes, pathToArray(itemPath));
    const handledError = handleFieldError(error, itemType, errors);
    filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
    completedResults.push(handledError);
  }
  return false;
}
function completeLeafValue(returnType, result) {
  let serializedResult;
  try {
    serializedResult = returnType.serialize(result);
  } catch (err) {
    if (err instanceof GraphQLError2) {
      throw new Error(err.message);
    }
    throw err;
  }
  if (serializedResult == null) {
    throw new Error(`Expected \`${inspect2(returnType)}.serialize(${inspect2(result)})\` to return non-nullable value, returned: ${inspect2(serializedResult)}`);
  }
  return serializedResult;
}
function completeAbstractValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  const resolveTypeFn = returnType.resolveType ?? exeContext.typeResolver;
  const contextValue = exeContext.contextValue;
  const runtimeType = resolveTypeFn(result, contextValue, info, returnType);
  if (isPromise(runtimeType)) {
    return runtimeType.then((resolvedRuntimeType) => completeObjectValue(exeContext, ensureValidRuntimeType(resolvedRuntimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result, asyncPayloadRecord));
  }
  return completeObjectValue(exeContext, ensureValidRuntimeType(runtimeType, exeContext, returnType, fieldNodes, info, result), fieldNodes, info, path, result, asyncPayloadRecord);
}
function ensureValidRuntimeType(runtimeTypeName, exeContext, returnType, fieldNodes, info, result) {
  if (runtimeTypeName == null) {
    throw createGraphQLError3(`Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}". Either the "${returnType.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`, { nodes: fieldNodes });
  }
  if (isObjectType(runtimeTypeName)) {
    if (versionInfo.major >= 16) {
      throw createGraphQLError3("Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead.");
    }
    runtimeTypeName = runtimeTypeName.name;
  }
  if (typeof runtimeTypeName !== "string") {
    throw createGraphQLError3(`Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}" with value ${inspect2(result)}, received "${inspect2(runtimeTypeName)}".`);
  }
  const runtimeType = exeContext.schema.getType(runtimeTypeName);
  if (runtimeType == null) {
    throw createGraphQLError3(`Abstract type "${returnType.name}" was resolved to a type "${runtimeTypeName}" that does not exist inside the schema.`, { nodes: fieldNodes });
  }
  if (!isObjectType(runtimeType)) {
    throw createGraphQLError3(`Abstract type "${returnType.name}" was resolved to a non-object type "${runtimeTypeName}".`, { nodes: fieldNodes });
  }
  if (!exeContext.schema.isSubType(returnType, runtimeType)) {
    throw createGraphQLError3(`Runtime Object type "${runtimeType.name}" is not a possible type for "${returnType.name}".`, { nodes: fieldNodes });
  }
  return runtimeType;
}
function completeObjectValue(exeContext, returnType, fieldNodes, info, path, result, asyncPayloadRecord) {
  if (returnType.isTypeOf) {
    const isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);
    if (isPromise(isTypeOf)) {
      return isTypeOf.then((resolvedIsTypeOf) => {
        if (!resolvedIsTypeOf) {
          throw invalidReturnTypeError(returnType, result, fieldNodes);
        }
        return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result, asyncPayloadRecord);
      });
    }
    if (!isTypeOf) {
      throw invalidReturnTypeError(returnType, result, fieldNodes);
    }
  }
  return collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result, asyncPayloadRecord);
}
function invalidReturnTypeError(returnType, result, fieldNodes) {
  return createGraphQLError3(`Expected value of type "${returnType.name}" but got: ${inspect2(result)}.`, {
    nodes: fieldNodes
  });
}
function collectAndExecuteSubfields(exeContext, returnType, fieldNodes, path, result, asyncPayloadRecord) {
  const { fields: subFieldNodes, patches: subPatches } = collectSubfields(exeContext, returnType, fieldNodes);
  const subFields = executeFields(exeContext, returnType, result, path, subFieldNodes, asyncPayloadRecord);
  for (const subPatch of subPatches) {
    const { label, fields: subPatchFieldNodes } = subPatch;
    executeDeferredFragment(exeContext, returnType, result, subPatchFieldNodes, label, path, asyncPayloadRecord);
  }
  return subFields;
}
var defaultTypeResolver = function(value, contextValue, info, abstractType) {
  if (isObjectLike(value) && typeof value["__typename"] === "string") {
    return value["__typename"];
  }
  const possibleTypes = info.schema.getPossibleTypes(abstractType);
  const promisedIsTypeOfResults = [];
  for (let i = 0; i < possibleTypes.length; i++) {
    const type = possibleTypes[i];
    if (type.isTypeOf) {
      const isTypeOfResult = type.isTypeOf(value, contextValue, info);
      if (isPromise(isTypeOfResult)) {
        promisedIsTypeOfResults[i] = isTypeOfResult;
      } else if (isTypeOfResult) {
        return type.name;
      }
    }
  }
  if (promisedIsTypeOfResults.length) {
    return Promise.all(promisedIsTypeOfResults).then((isTypeOfResults) => {
      for (let i = 0; i < isTypeOfResults.length; i++) {
        if (isTypeOfResults[i]) {
          return possibleTypes[i].name;
        }
      }
    });
  }
};
var defaultFieldResolver = function(source, args, contextValue, info) {
  if (isObjectLike(source) || typeof source === "function") {
    const property = source[info.fieldName];
    if (typeof property === "function") {
      return source[info.fieldName](args, contextValue, info);
    }
    return property;
  }
};
function subscribe(args) {
  const exeContext = buildExecutionContext(args);
  if (!("schema" in exeContext)) {
    return {
      errors: exeContext.map((e) => {
        Object.defineProperty(e, "extensions", {
          value: {
            ...e.extensions,
            http: {
              ...e.extensions?.["http"],
              status: 400
            }
          }
        });
        return e;
      })
    };
  }
  const resultOrStream = createSourceEventStreamImpl(exeContext);
  if (isPromise(resultOrStream)) {
    return resultOrStream.then((resolvedResultOrStream) => mapSourceToResponse(exeContext, resolvedResultOrStream));
  }
  return mapSourceToResponse(exeContext, resultOrStream);
}
function flattenIncrementalResults(incrementalResults) {
  const subsequentIterator = incrementalResults.subsequentResults;
  let initialResultSent = false;
  let done = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      if (done) {
        return Promise.resolve({
          value: void 0,
          done
        });
      }
      if (initialResultSent) {
        return subsequentIterator.next();
      }
      initialResultSent = true;
      return Promise.resolve({
        value: incrementalResults.initialResult,
        done
      });
    },
    return() {
      done = true;
      return subsequentIterator.return();
    },
    throw(error) {
      done = true;
      return subsequentIterator.throw(error);
    }
  };
}
async function* ensureAsyncIterable(someExecutionResult) {
  if ("initialResult" in someExecutionResult) {
    yield* flattenIncrementalResults(someExecutionResult);
  } else {
    yield someExecutionResult;
  }
}
function mapSourceToResponse(exeContext, resultOrStream) {
  if (!isAsyncIterable2(resultOrStream)) {
    return resultOrStream;
  }
  return flattenAsyncIterable(mapAsyncIterator2(resultOrStream, async (payload) => ensureAsyncIterable(await executeImpl(buildPerEventExecutionContext(exeContext, payload))), (error) => {
    if (error instanceof AggregateError) {
      throw new AggregateError(error.errors.map((e) => wrapError(e, exeContext.operation)), error.message);
    }
    throw wrapError(error, exeContext.operation);
  }));
}
function wrapError(error, operation) {
  return createGraphQLError3(error.message, {
    originalError: error,
    nodes: [operation]
  });
}
function createSourceEventStreamImpl(exeContext) {
  try {
    const eventStream = executeSubscription(exeContext);
    if (isPromise(eventStream)) {
      return eventStream.then(void 0, (error) => ({ errors: [error] }));
    }
    return eventStream;
  } catch (error) {
    return { errors: [error] };
  }
}
function executeSubscription(exeContext) {
  const { schema, fragments, operation, variableValues, rootValue } = exeContext;
  const rootType = schema.getSubscriptionType();
  if (rootType == null) {
    throw createGraphQLError3("Schema is not configured to execute subscription operation.", {
      nodes: operation
    });
  }
  const { fields: rootFields } = collectFields(schema, fragments, variableValues, rootType, operation.selectionSet);
  const [responseName, fieldNodes] = [...rootFields.entries()][0];
  const fieldName = fieldNodes[0].name.value;
  const fieldDef = getFieldDef(schema, rootType, fieldNodes[0]);
  if (!fieldDef) {
    throw createGraphQLError3(`The subscription field "${fieldName}" is not defined.`, {
      nodes: fieldNodes
    });
  }
  const path = addPath(void 0, responseName, rootType.name);
  const info = buildResolveInfo(exeContext, fieldDef, fieldNodes, rootType, path);
  try {
    const args = getArgumentValues(fieldDef, fieldNodes[0], variableValues);
    const contextValue = exeContext.contextValue;
    const resolveFn = fieldDef.subscribe ?? exeContext.subscribeFieldResolver;
    const result = resolveFn(rootValue, args, contextValue, info);
    if (isPromise(result)) {
      return result.then(assertEventStream).then(void 0, (error) => {
        throw locatedError(error, fieldNodes, pathToArray(path));
      });
    }
    return assertEventStream(result, exeContext.signal);
  } catch (error) {
    throw locatedError(error, fieldNodes, pathToArray(path));
  }
}
function assertEventStream(result, signal) {
  if (result instanceof Error) {
    throw result;
  }
  if (!isAsyncIterable2(result)) {
    throw createGraphQLError3(`Subscription field must return Async Iterable. Received: ${inspect2(result)}.`);
  }
  return {
    [Symbol.asyncIterator]() {
      const asyncIterator = result[Symbol.asyncIterator]();
      signal?.addEventListener("abort", () => {
        asyncIterator.return?.();
      });
      return asyncIterator;
    }
  };
}
function executeDeferredFragment(exeContext, parentType, sourceValue, fields, label, path, parentContext) {
  const asyncPayloadRecord = new DeferredFragmentRecord({
    label,
    path,
    parentContext,
    exeContext
  });
  let promiseOrData;
  try {
    promiseOrData = executeFields(exeContext, parentType, sourceValue, path, fields, asyncPayloadRecord);
    if (isPromise(promiseOrData)) {
      promiseOrData = promiseOrData.then(null, (e) => {
        asyncPayloadRecord.errors.push(e);
        return null;
      });
    }
  } catch (e) {
    asyncPayloadRecord.errors.push(e);
    promiseOrData = null;
  }
  asyncPayloadRecord.addData(promiseOrData);
}
function executeStreamField(path, itemPath, item, exeContext, fieldNodes, info, itemType, label, parentContext) {
  const asyncPayloadRecord = new StreamRecord({
    label,
    path: itemPath,
    parentContext,
    exeContext
  });
  let completedItem;
  try {
    try {
      if (isPromise(item)) {
        completedItem = item.then((resolved) => completeValue(exeContext, itemType, fieldNodes, info, itemPath, resolved, asyncPayloadRecord));
      } else {
        completedItem = completeValue(exeContext, itemType, fieldNodes, info, itemPath, item, asyncPayloadRecord);
      }
      if (isPromise(completedItem)) {
        completedItem = completedItem.then(void 0, (rawError) => {
          rawError = coerceError(rawError);
          const error = locatedError(rawError, fieldNodes, pathToArray(itemPath));
          const handledError = handleFieldError(error, itemType, asyncPayloadRecord.errors);
          filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
          return handledError;
        });
      }
    } catch (rawError) {
      const coercedError = coerceError(rawError);
      const error = locatedError(coercedError, fieldNodes, pathToArray(itemPath));
      completedItem = handleFieldError(error, itemType, asyncPayloadRecord.errors);
      filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
    }
  } catch (error) {
    asyncPayloadRecord.errors.push(error);
    filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
    asyncPayloadRecord.addItems(null);
    return asyncPayloadRecord;
  }
  let completedItems;
  if (isPromise(completedItem)) {
    completedItems = completedItem.then((value) => [value], (error) => {
      asyncPayloadRecord.errors.push(error);
      filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
      return null;
    });
  } else {
    completedItems = [completedItem];
  }
  asyncPayloadRecord.addItems(completedItems);
  return asyncPayloadRecord;
}
async function executeStreamIteratorItem(iterator, exeContext, fieldNodes, info, itemType, asyncPayloadRecord, itemPath) {
  let item;
  try {
    const { value, done } = await iterator.next();
    if (done) {
      asyncPayloadRecord.setIsCompletedIterator();
      return { done, value: void 0 };
    }
    item = value;
  } catch (rawError) {
    const coercedError = coerceError(rawError);
    const error = locatedError(coercedError, fieldNodes, pathToArray(itemPath));
    const value = handleFieldError(error, itemType, asyncPayloadRecord.errors);
    return { done: true, value };
  }
  let completedItem;
  try {
    completedItem = completeValue(exeContext, itemType, fieldNodes, info, itemPath, item, asyncPayloadRecord);
    if (isPromise(completedItem)) {
      completedItem = completedItem.then(void 0, (rawError) => {
        const error = locatedError(rawError, fieldNodes, pathToArray(itemPath));
        const handledError = handleFieldError(error, itemType, asyncPayloadRecord.errors);
        filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
        return handledError;
      });
    }
    return { done: false, value: completedItem };
  } catch (rawError) {
    const error = locatedError(rawError, fieldNodes, pathToArray(itemPath));
    const value = handleFieldError(error, itemType, asyncPayloadRecord.errors);
    filterSubsequentPayloads(exeContext, itemPath, asyncPayloadRecord);
    return { done: false, value };
  }
}
async function executeStreamIterator(initialIndex, iterator, exeContext, fieldNodes, info, itemType, path, label, parentContext) {
  let index = initialIndex;
  let previousAsyncPayloadRecord = parentContext ?? void 0;
  while (true) {
    const itemPath = addPath(path, index, void 0);
    const asyncPayloadRecord = new StreamRecord({
      label,
      path: itemPath,
      parentContext: previousAsyncPayloadRecord,
      iterator,
      exeContext
    });
    let iteration;
    try {
      iteration = await executeStreamIteratorItem(iterator, exeContext, fieldNodes, info, itemType, asyncPayloadRecord, itemPath);
    } catch (error) {
      asyncPayloadRecord.errors.push(error);
      filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
      asyncPayloadRecord.addItems(null);
      if (iterator?.return) {
        iterator.return().catch(() => {
        });
      }
      return;
    }
    const { done, value: completedItem } = iteration;
    let completedItems;
    if (isPromise(completedItem)) {
      completedItems = completedItem.then((value) => [value], (error) => {
        asyncPayloadRecord.errors.push(error);
        filterSubsequentPayloads(exeContext, path, asyncPayloadRecord);
        return null;
      });
    } else {
      completedItems = [completedItem];
    }
    asyncPayloadRecord.addItems(completedItems);
    if (done) {
      break;
    }
    previousAsyncPayloadRecord = asyncPayloadRecord;
    index++;
  }
}
function filterSubsequentPayloads(exeContext, nullPath, currentAsyncRecord) {
  const nullPathArray = pathToArray(nullPath);
  exeContext.subsequentPayloads.forEach((asyncRecord) => {
    if (asyncRecord === currentAsyncRecord) {
      return;
    }
    for (let i = 0; i < nullPathArray.length; i++) {
      if (asyncRecord.path[i] !== nullPathArray[i]) {
        return;
      }
    }
    if (isStreamPayload(asyncRecord) && asyncRecord.iterator?.return) {
      asyncRecord.iterator.return().catch(() => {
      });
    }
    exeContext.subsequentPayloads.delete(asyncRecord);
  });
}
function getCompletedIncrementalResults(exeContext) {
  const incrementalResults = [];
  for (const asyncPayloadRecord of exeContext.subsequentPayloads) {
    const incrementalResult = {};
    if (!asyncPayloadRecord.isCompleted) {
      continue;
    }
    exeContext.subsequentPayloads.delete(asyncPayloadRecord);
    if (isStreamPayload(asyncPayloadRecord)) {
      const items = asyncPayloadRecord.items;
      if (asyncPayloadRecord.isCompletedIterator) {
        continue;
      }
      incrementalResult.items = items;
    } else {
      const data = asyncPayloadRecord.data;
      incrementalResult.data = data ?? null;
    }
    incrementalResult.path = asyncPayloadRecord.path;
    if (asyncPayloadRecord.label) {
      incrementalResult.label = asyncPayloadRecord.label;
    }
    if (asyncPayloadRecord.errors.length > 0) {
      incrementalResult.errors = asyncPayloadRecord.errors;
    }
    incrementalResults.push(incrementalResult);
  }
  return incrementalResults;
}
function yieldSubsequentPayloads(exeContext) {
  let isDone = false;
  const abortPromise = new Promise((_, reject2) => {
    exeContext.signal?.addEventListener("abort", () => {
      isDone = true;
      reject2(exeContext.signal?.reason);
    });
  });
  async function next() {
    if (isDone) {
      return { value: void 0, done: true };
    }
    await Promise.race([
      abortPromise,
      ...Array.from(exeContext.subsequentPayloads).map((p) => p.promise)
    ]);
    if (isDone) {
      return { value: void 0, done: true };
    }
    const incremental = getCompletedIncrementalResults(exeContext);
    const hasNext = exeContext.subsequentPayloads.size > 0;
    if (!incremental.length && hasNext) {
      return next();
    }
    if (!hasNext) {
      isDone = true;
    }
    return {
      value: incremental.length ? { incremental, hasNext } : { hasNext },
      done: false
    };
  }
  function returnStreamIterators() {
    const promises = [];
    exeContext.subsequentPayloads.forEach((asyncPayloadRecord) => {
      if (isStreamPayload(asyncPayloadRecord) && asyncPayloadRecord.iterator?.return) {
        promises.push(asyncPayloadRecord.iterator.return());
      }
    });
    return Promise.all(promises);
  }
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next,
    async return() {
      await returnStreamIterators();
      isDone = true;
      return { value: void 0, done: true };
    },
    async throw(error) {
      await returnStreamIterators();
      isDone = true;
      return Promise.reject(error);
    }
  };
}
var DeferredFragmentRecord = class {
  type;
  errors;
  label;
  path;
  promise;
  data;
  parentContext;
  isCompleted;
  _exeContext;
  _resolve;
  constructor(opts) {
    this.type = "defer";
    this.label = opts.label;
    this.path = pathToArray(opts.path);
    this.parentContext = opts.parentContext;
    this.errors = [];
    this._exeContext = opts.exeContext;
    this._exeContext.subsequentPayloads.add(this);
    this.isCompleted = false;
    this.data = null;
    this.promise = new Promise((resolve) => {
      this._resolve = (MaybePromise) => {
        resolve(MaybePromise);
      };
    }).then((data) => {
      this.data = data;
      this.isCompleted = true;
    });
  }
  addData(data) {
    const parentData = this.parentContext?.promise;
    if (parentData) {
      this._resolve?.(parentData.then(() => data));
      return;
    }
    this._resolve?.(data);
  }
};
var StreamRecord = class {
  type;
  errors;
  label;
  path;
  items;
  promise;
  parentContext;
  iterator;
  isCompletedIterator;
  isCompleted;
  _exeContext;
  _resolve;
  constructor(opts) {
    this.type = "stream";
    this.items = null;
    this.label = opts.label;
    this.path = pathToArray(opts.path);
    this.parentContext = opts.parentContext;
    this.iterator = opts.iterator;
    this.errors = [];
    this._exeContext = opts.exeContext;
    this._exeContext.subsequentPayloads.add(this);
    this.isCompleted = false;
    this.items = null;
    this.promise = new Promise((resolve) => {
      this._resolve = (MaybePromise) => {
        resolve(MaybePromise);
      };
    }).then((items) => {
      this.items = items;
      this.isCompleted = true;
    });
  }
  addItems(items) {
    const parentData = this.parentContext?.promise;
    if (parentData) {
      this._resolve?.(parentData.then(() => items));
      return;
    }
    this._resolve?.(items);
  }
  setIsCompletedIterator() {
    this.isCompletedIterator = true;
  }
};
function isStreamPayload(asyncPayload) {
  return asyncPayload.type === "stream";
}
function getFieldDef(schema, parentType, fieldNode) {
  const fieldName = fieldNode.name.value;
  if (fieldName === SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return SchemaMetaFieldDef;
  } else if (fieldName === TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return TypeMetaFieldDef;
  } else if (fieldName === TypeNameMetaFieldDef.name) {
    return TypeNameMetaFieldDef;
  }
  return parentType.getFields()[fieldName];
}

// ../../../node_modules/.pnpm/@graphql-tools+executor@1.3.1_graphql@16.9.0/node_modules/@graphql-tools/executor/esm/execution/normalizedExecutor.js
import { getOperationAST } from "https://esm.sh/graphql@16.8.2";
function normalizedExecutor(args) {
  const operationAST = getOperationAST(args.document, args.operationName);
  if (operationAST == null) {
    throw new Error("Must provide an operation.");
  }
  if (operationAST.operation === "subscription") {
    return subscribe(args);
  }
  return new ValueOrPromise(() => execute(args)).then((result) => {
    if ("initialResult" in result) {
      return flattenIncrementalResults(result);
    }
    return result;
  }).resolve();
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/server.js
import { mapAsyncIterator as mapAsyncIterator3 } from "https://esm.sh/@graphql-tools/utils@10.5.4";

// fetch.shim.js
var fetch_shim_exports = {};
__export(fetch_shim_exports, {
  ReadableStream: () => ReadableStream2,
  Request: () => Request,
  Response: () => Response,
  TextEncoder: () => TextEncoder,
  URL: () => URL,
  URLPattern: () => URLPattern,
  URLSearchParams: () => URLSearchParams,
  createFetch: () => createFetch,
  fetch: () => fetch
});
import { URLPattern as URLPatternPolyfill } from "data:application/javascript,const URLPattern=globalThis.URLPattern;export{URLPattern}";
var fetch = globalThis.fetch;
var Request = globalThis.Request;
var Response = globalThis.Response;
var ReadableStream2 = globalThis.ReadableStream;
var TextEncoder = globalThis.TextEncoder;
var URL = globalThis.URL;
var URLPattern = URLPatternPolyfill;
var URLSearchParams = globalThis.URLSearchParams;
function createFetch() {
  return {
    fetch,
    Request,
    Response,
    ReadableStream: ReadableStream2,
    TextEncoder,
    URL,
    URLPattern,
    URLSearchParams
  };
}

// ../../../node_modules/.pnpm/@whatwg-node+server@0.9.46/node_modules/@whatwg-node/server/esm/utils.js
function isAsyncIterable3(body) {
  return body != null && typeof body === "object" && typeof body[Symbol.asyncIterator] === "function";
}
function getPort(nodeRequest) {
  if (nodeRequest.socket?.localPort) {
    return nodeRequest.socket?.localPort;
  }
  const hostInHeader = nodeRequest.headers?.[":authority"] || nodeRequest.headers?.host;
  const portInHeader = hostInHeader?.split(":")?.[1];
  if (portInHeader) {
    return portInHeader;
  }
  return 80;
}
function getHostnameWithPort(nodeRequest) {
  if (nodeRequest.headers?.[":authority"]) {
    return nodeRequest.headers?.[":authority"];
  }
  if (nodeRequest.headers?.host) {
    return nodeRequest.headers?.host;
  }
  const port = getPort(nodeRequest);
  if (nodeRequest.hostname) {
    return nodeRequest.hostname + ":" + port;
  }
  const localIp = nodeRequest.socket?.localAddress;
  if (localIp && !localIp?.includes("::") && !localIp?.includes("ffff")) {
    return `${localIp}:${port}`;
  }
  return "localhost";
}
function buildFullUrl(nodeRequest) {
  const hostnameWithPort = getHostnameWithPort(nodeRequest);
  const protocol = nodeRequest.protocol || (nodeRequest.socket?.encrypted ? "https" : "http");
  const endpoint = nodeRequest.originalUrl || nodeRequest.url || "/graphql";
  return `${protocol}://${hostnameWithPort}${endpoint}`;
}
function isRequestBody(body) {
  const stringTag = body[Symbol.toStringTag];
  if (typeof body === "string" || stringTag === "Uint8Array" || stringTag === "Blob" || stringTag === "FormData" || stringTag === "URLSearchParams" || isAsyncIterable3(body)) {
    return true;
  }
  return false;
}
var ServerAdapterRequestAbortSignal = class extends EventTarget {
  aborted = false;
  _onabort = null;
  reason;
  throwIfAborted() {
    if (this.aborted) {
      throw this.reason;
    }
  }
  sendAbort() {
    this.reason = new DOMException("This operation was aborted", "AbortError");
    this.aborted = true;
    this.dispatchEvent(new Event("abort"));
  }
  get onabort() {
    return this._onabort;
  }
  set onabort(value) {
    this._onabort = value;
    if (value) {
      this.addEventListener("abort", value);
    } else {
      this.removeEventListener("abort", value);
    }
  }
  any(signals) {
    return AbortSignal.any([...signals]);
  }
};
var bunNodeCompatModeWarned = false;
var nodeRequestResponseMap = /* @__PURE__ */ new WeakMap();
function normalizeNodeRequest(nodeRequest, RequestCtor) {
  const rawRequest = nodeRequest.raw || nodeRequest.req || nodeRequest;
  let fullUrl = buildFullUrl(rawRequest);
  if (nodeRequest.query) {
    const url = new URL(fullUrl);
    for (const key in nodeRequest.query) {
      url.searchParams.set(key, nodeRequest.query[key]);
    }
    fullUrl = url.toString();
  }
  let signal;
  const nodeResponse = nodeRequestResponseMap.get(nodeRequest);
  nodeRequestResponseMap.delete(nodeRequest);
  let normalizedHeaders = nodeRequest.headers;
  if (nodeRequest.headers?.[":method"]) {
    normalizedHeaders = {};
    for (const key in nodeRequest.headers) {
      if (!key.startsWith(":")) {
        normalizedHeaders[key] = nodeRequest.headers[key];
      }
    }
  }
  if (nodeResponse?.once) {
    let sendAbortSignal;
    if (RequestCtor !== globalThis.Request) {
      signal = new ServerAdapterRequestAbortSignal();
      sendAbortSignal = () => signal.sendAbort();
    } else {
      const controller = new AbortController();
      signal = controller.signal;
      sendAbortSignal = () => controller.abort();
    }
    const closeEventListener = () => {
      if (signal && !signal.aborted) {
        rawRequest.aborted = true;
        sendAbortSignal();
      }
    };
    nodeResponse.once("error", closeEventListener);
    nodeResponse.once("close", closeEventListener);
    nodeResponse.once("finish", () => {
      nodeResponse.removeListener("close", closeEventListener);
    });
  }
  if (nodeRequest.method === "GET" || nodeRequest.method === "HEAD") {
    return new RequestCtor(fullUrl, {
      method: nodeRequest.method,
      headers: normalizedHeaders,
      signal
    });
  }
  const maybeParsedBody = nodeRequest.body;
  if (maybeParsedBody != null && Object.keys(maybeParsedBody).length > 0) {
    if (isRequestBody(maybeParsedBody)) {
      return new RequestCtor(fullUrl, {
        method: nodeRequest.method,
        headers: normalizedHeaders,
        body: maybeParsedBody,
        signal
      });
    }
    const request = new RequestCtor(fullUrl, {
      method: nodeRequest.method,
      headers: normalizedHeaders,
      signal
    });
    if (!request.headers.get("content-type")?.includes("json")) {
      request.headers.set("content-type", "application/json; charset=utf-8");
    }
    return new Proxy(request, {
      get: (target, prop, receiver) => {
        switch (prop) {
          case "json":
            return async () => maybeParsedBody;
          case "text":
            return async () => JSON.stringify(maybeParsedBody);
          default:
            return Reflect.get(target, prop, receiver);
        }
      }
    });
  }
  if (globalThis.process?.versions?.bun && isReadable(rawRequest)) {
    if (!bunNodeCompatModeWarned) {
      bunNodeCompatModeWarned = true;
      console.warn(`You use Bun Node compatibility mode, which is not recommended!
It will affect your performance. Please check our Bun integration recipe, and avoid using 'http' for your server implementation.`);
    }
    return new RequestCtor(fullUrl, {
      method: nodeRequest.method,
      headers: normalizedHeaders,
      duplex: "half",
      body: new ReadableStream({
        start(controller) {
          rawRequest.on("data", (chunk) => {
            controller.enqueue(chunk);
          });
          rawRequest.on("error", (e) => {
            controller.error(e);
          });
          rawRequest.on("end", () => {
            controller.close();
          });
        },
        cancel(e) {
          rawRequest.destroy(e);
        }
      }),
      signal
    });
  }
  return new RequestCtor(fullUrl, {
    method: nodeRequest.method,
    headers: normalizedHeaders,
    body: rawRequest,
    duplex: "half",
    signal
  });
}
function isReadable(stream) {
  return stream.read != null;
}
function isNodeRequest(request) {
  return isReadable(request);
}
function isServerResponse(stream) {
  return stream != null && stream.setHeader != null && stream.end != null && stream.once != null && stream.write != null;
}
function isFetchEvent(event) {
  return event != null && event.request != null && event.respondWith != null;
}
function configureSocket(rawRequest) {
  rawRequest?.socket?.setTimeout?.(0);
  rawRequest?.socket?.setNoDelay?.(true);
  rawRequest?.socket?.setKeepAlive?.(true);
}
function endResponse(serverResponse) {
  serverResponse.end(null, null, null);
}
async function sendAsyncIterable(serverResponse, asyncIterable) {
  let closed = false;
  const closeEventListener = () => {
    closed = true;
  };
  serverResponse.once("error", closeEventListener);
  serverResponse.once("close", closeEventListener);
  serverResponse.once("finish", () => {
    serverResponse.removeListener("close", closeEventListener);
  });
  for await (const chunk of asyncIterable) {
    if (closed) {
      break;
    }
    if (!serverResponse.write(chunk)) {
      if (closed) {
        break;
      }
      await new Promise((resolve) => serverResponse.once("drain", resolve));
    }
  }
  endResponse(serverResponse);
}
function sendNodeResponse(fetchResponse, serverResponse, nodeRequest) {
  if (serverResponse.closed || serverResponse.destroyed || serverResponse.writableEnded) {
    return;
  }
  if (!fetchResponse) {
    serverResponse.statusCode = 404;
    serverResponse.end();
    return;
  }
  serverResponse.statusCode = fetchResponse.status;
  serverResponse.statusMessage = fetchResponse.statusText;
  let setCookiesSet = false;
  fetchResponse.headers.forEach((value, key) => {
    if (key === "set-cookie") {
      if (setCookiesSet) {
        return;
      }
      setCookiesSet = true;
      const setCookies = fetchResponse.headers.getSetCookie?.();
      if (setCookies) {
        serverResponse.setHeader("set-cookie", setCookies);
        return;
      }
    }
    serverResponse.setHeader(key, value);
  });
  const bufOfRes = fetchResponse._buffer;
  if (bufOfRes) {
    serverResponse.write(bufOfRes);
    endResponse(serverResponse);
    return;
  }
  const fetchBody = fetchResponse.body;
  if (fetchBody == null) {
    endResponse(serverResponse);
    return;
  }
  if (fetchBody[Symbol.toStringTag] === "Uint8Array") {
    serverResponse.write(fetchBody);
    endResponse(serverResponse);
    return;
  }
  configureSocket(nodeRequest);
  if (isReadable(fetchBody)) {
    serverResponse.once("close", () => {
      fetchBody.destroy();
    });
    fetchBody.pipe(serverResponse);
    return;
  }
  if (isAsyncIterable3(fetchBody)) {
    return sendAsyncIterable(serverResponse, fetchBody);
  }
}
function isRequestInit(val) {
  return val != null && typeof val === "object" && ("body" in val || "cache" in val || "credentials" in val || "headers" in val || "integrity" in val || "keepalive" in val || "method" in val || "mode" in val || "redirect" in val || "referrer" in val || "referrerPolicy" in val || "signal" in val || "window" in val);
}
function completeAssign(...args) {
  const [target, ...sources] = args.filter((arg) => arg != null && typeof arg === "object");
  sources.forEach((source) => {
    const descriptors = Object.getOwnPropertyNames(source).reduce((descriptors2, key) => {
      const descriptor = Object.getOwnPropertyDescriptor(source, key);
      if (descriptor) {
        descriptors2[key] = Object.getOwnPropertyDescriptor(source, key);
      }
      return descriptors2;
    }, {});
    Object.getOwnPropertySymbols(source).forEach((sym) => {
      const descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor?.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}
function isPromise2(val) {
  return val?.then != null;
}
function iterateAsyncVoid(iterable, callback) {
  const iterator = iterable[Symbol.iterator]();
  let stopEarlyFlag = false;
  function stopEarlyFn() {
    stopEarlyFlag = true;
  }
  function iterate() {
    const { done: endOfIterator, value } = iterator.next();
    if (endOfIterator) {
      return;
    }
    const result$ = callback(value, stopEarlyFn);
    if (isPromise2(result$)) {
      return result$.then(() => {
        if (stopEarlyFlag) {
          return;
        }
        return iterate();
      });
    }
    if (stopEarlyFlag) {
      return;
    }
    return iterate();
  }
  return iterate();
}
function handleErrorFromRequestHandler(error, ResponseCtor) {
  return new ResponseCtor(error.stack || error.message || error.toString(), {
    status: error.status || 500
  });
}
function isolateObject(originalCtx, waitUntilPromises) {
  if (originalCtx == null) {
    return {};
  }
  const extraProps = {};
  const deletedProps = /* @__PURE__ */ new Set();
  return new Proxy(originalCtx, {
    get(originalCtx2, prop) {
      if (waitUntilPromises != null && prop === "waitUntil") {
        return function waitUntil(promise) {
          waitUntilPromises.push(promise.catch((err) => console.error(err)));
        };
      }
      const extraPropVal = extraProps[prop];
      if (extraPropVal != null) {
        if (typeof extraPropVal === "function") {
          return extraPropVal.bind(extraProps);
        }
        return extraPropVal;
      }
      if (deletedProps.has(prop)) {
        return void 0;
      }
      return originalCtx2[prop];
    },
    set(_originalCtx, prop, value) {
      extraProps[prop] = value;
      return true;
    },
    has(originalCtx2, prop) {
      if (waitUntilPromises != null && prop === "waitUntil") {
        return true;
      }
      if (deletedProps.has(prop)) {
        return false;
      }
      if (prop in extraProps) {
        return true;
      }
      return prop in originalCtx2;
    },
    defineProperty(_originalCtx, prop, descriptor) {
      return Reflect.defineProperty(extraProps, prop, descriptor);
    },
    deleteProperty(_originalCtx, prop) {
      if (prop in extraProps) {
        return Reflect.deleteProperty(extraProps, prop);
      }
      deletedProps.add(prop);
      return true;
    },
    ownKeys(originalCtx2) {
      const extraKeys = Reflect.ownKeys(extraProps);
      const originalKeys = Reflect.ownKeys(originalCtx2);
      const deletedKeys = Array.from(deletedProps);
      const allKeys = new Set(extraKeys.concat(originalKeys.filter((keys) => !deletedKeys.includes(keys))));
      if (waitUntilPromises != null) {
        allKeys.add("waitUntil");
      }
      return Array.from(allKeys);
    },
    getOwnPropertyDescriptor(originalCtx2, prop) {
      if (prop in extraProps) {
        return Reflect.getOwnPropertyDescriptor(extraProps, prop);
      }
      if (deletedProps.has(prop)) {
        return void 0;
      }
      return Reflect.getOwnPropertyDescriptor(originalCtx2, prop);
    }
  });
}
function createDeferredPromise() {
  let resolveFn;
  let rejectFn;
  const promise = new Promise(function deferredPromiseExecutor(resolve, reject2) {
    resolveFn = resolve;
    rejectFn = reject2;
  });
  return {
    promise,
    get resolve() {
      return resolveFn;
    },
    get reject() {
      return rejectFn;
    }
  };
}
function handleAbortSignalAndPromiseResponse(response$, abortSignal) {
  if (isPromise2(response$) && abortSignal) {
    const deferred$ = createDeferredPromise();
    abortSignal.addEventListener("abort", function abortSignalFetchErrorHandler() {
      deferred$.reject(abortSignal.reason);
    });
    response$.then(function fetchSuccessHandler(res) {
      deferred$.resolve(res);
    }).catch(function fetchErrorHandler(err) {
      deferred$.reject(err);
    });
    return deferred$.promise;
  }
  return response$;
}

// ../../../node_modules/.pnpm/@whatwg-node+server@0.9.46/node_modules/@whatwg-node/server/esm/uwebsockets.js
function isUWSResponse(res) {
  return !!res.onData;
}
function getRequestFromUWSRequest({ req, res, fetchAPI, signal }) {
  let body;
  const method = req.getMethod();
  if (method !== "get" && method !== "head") {
    let controller;
    body = new fetchAPI.ReadableStream({
      start(c) {
        controller = c;
      }
    });
    const readable = body.readable;
    if (readable) {
      signal.addEventListener("abort", () => {
        readable.push(null);
      });
      res.onData(function(ab, isLast) {
        const chunk = Buffer.from(ab, 0, ab.byteLength);
        readable.push(Buffer.from(chunk));
        if (isLast) {
          readable.push(null);
        }
      });
    } else {
      let closed = false;
      signal.addEventListener("abort", () => {
        if (!closed) {
          closed = true;
          controller.close();
        }
      });
      res.onData(function(ab, isLast) {
        const chunk = Buffer.from(ab, 0, ab.byteLength);
        controller.enqueue(Buffer.from(chunk));
        if (isLast) {
          closed = true;
          controller.close();
        }
      });
    }
  }
  const headers = new fetchAPI.Headers();
  req.forEach((key, value) => {
    headers.append(key, value);
  });
  let url = `http://localhost${req.getUrl()}`;
  const query = req.getQuery();
  if (query) {
    url += `?${query}`;
  }
  return new fetchAPI.Request(url, {
    method,
    headers,
    body,
    signal,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - not in the TS types yet
    duplex: "half"
  });
}
async function forwardResponseBodyToUWSResponse(uwsResponse, fetchResponse, signal) {
  for await (const chunk of fetchResponse.body) {
    if (signal.aborted) {
      return;
    }
    uwsResponse.cork(() => {
      uwsResponse.write(chunk);
    });
  }
  uwsResponse.cork(() => {
    uwsResponse.end();
  });
}
function sendResponseToUwsOpts(uwsResponse, fetchResponse, signal) {
  if (!fetchResponse) {
    uwsResponse.writeStatus("404 Not Found");
    uwsResponse.end();
    return;
  }
  const bufferOfRes = fetchResponse._buffer;
  if (signal.aborted) {
    return;
  }
  uwsResponse.cork(() => {
    uwsResponse.writeStatus(`${fetchResponse.status} ${fetchResponse.statusText}`);
    for (const [key, value] of fetchResponse.headers) {
      if (key !== "content-length") {
        if (key === "set-cookie") {
          const setCookies = fetchResponse.headers.getSetCookie?.();
          if (setCookies) {
            for (const setCookie of setCookies) {
              uwsResponse.writeHeader(key, setCookie);
            }
            continue;
          }
        }
        uwsResponse.writeHeader(key, value);
      }
    }
    if (bufferOfRes) {
      uwsResponse.end(bufferOfRes);
    }
  });
  if (bufferOfRes) {
    return;
  }
  if (!fetchResponse.body) {
    uwsResponse.end();
    return;
  }
  return forwardResponseBodyToUWSResponse(uwsResponse, fetchResponse, signal);
}

// ../../../node_modules/.pnpm/@whatwg-node+server@0.9.46/node_modules/@whatwg-node/server/esm/createServerAdapter.js
async function handleWaitUntils(waitUntilPromises) {
  await Promise.allSettled(waitUntilPromises);
}
function isRequestAccessible(serverContext) {
  try {
    return !!serverContext?.request;
  } catch {
    return false;
  }
}
var EMPTY_OBJECT = {};
function createServerAdapter(serverAdapterBaseObject, options) {
  const fetchAPI = {
    ...fetch_shim_exports,
    ...options?.fetchAPI
  };
  const givenHandleRequest = typeof serverAdapterBaseObject === "function" ? serverAdapterBaseObject : serverAdapterBaseObject.handle;
  const onRequestHooks = [];
  const onResponseHooks = [];
  if (options?.plugins != null) {
    for (const plugin of options.plugins) {
      if (plugin.onRequest) {
        onRequestHooks.push(plugin.onRequest);
      }
      if (plugin.onResponse) {
        onResponseHooks.push(plugin.onResponse);
      }
    }
  }
  const handleRequest = onRequestHooks.length > 0 || onResponseHooks.length > 0 ? function handleRequest2(request, serverContext) {
    let requestHandler = givenHandleRequest;
    let response;
    if (onRequestHooks.length === 0) {
      return handleEarlyResponse();
    }
    let url = new Proxy(EMPTY_OBJECT, {
      get(_target, prop, _receiver) {
        url = new fetchAPI.URL(request.url, "http://localhost");
        return Reflect.get(url, prop, url);
      }
    });
    const onRequestHooksIteration$ = iterateAsyncVoid(onRequestHooks, (onRequestHook, stopEarly) => onRequestHook({
      request,
      setRequest(newRequest) {
        request = newRequest;
      },
      serverContext,
      fetchAPI,
      url,
      requestHandler,
      setRequestHandler(newRequestHandler) {
        requestHandler = newRequestHandler;
      },
      endResponse(newResponse) {
        response = newResponse;
        if (newResponse) {
          stopEarly();
        }
      }
    }));
    function handleResponse(response2) {
      if (onResponseHooks.length === 0) {
        return response2;
      }
      const onResponseHookPayload = {
        request,
        response: response2,
        serverContext,
        setResponse(newResponse) {
          response2 = newResponse;
        },
        fetchAPI
      };
      const onResponseHooksIteration$ = iterateAsyncVoid(onResponseHooks, (onResponseHook) => onResponseHook(onResponseHookPayload));
      if (isPromise2(onResponseHooksIteration$)) {
        return onResponseHooksIteration$.then(() => response2);
      }
      return response2;
    }
    function handleEarlyResponse() {
      if (!response) {
        const response$ = requestHandler(request, serverContext);
        if (isPromise2(response$)) {
          return response$.then(handleResponse);
        }
        return handleResponse(response$);
      }
      return handleResponse(response);
    }
    if (isPromise2(onRequestHooksIteration$)) {
      return onRequestHooksIteration$.then(handleEarlyResponse);
    }
    return handleEarlyResponse();
  } : givenHandleRequest;
  function handleNodeRequest(nodeRequest, ...ctx) {
    const serverContext = ctx.length > 1 ? completeAssign(...ctx) : ctx[0] || {};
    const request = normalizeNodeRequest(nodeRequest, fetchAPI.Request);
    return handleRequest(request, serverContext);
  }
  function handleNodeRequestAndResponse(nodeRequest, nodeResponseOrContainer, ...ctx) {
    const nodeResponse = nodeResponseOrContainer.raw || nodeResponseOrContainer;
    nodeRequestResponseMap.set(nodeRequest, nodeResponse);
    return handleNodeRequest(nodeRequest, ...ctx);
  }
  function requestListener(nodeRequest, nodeResponse, ...ctx) {
    const waitUntilPromises = [];
    const defaultServerContext = {
      req: nodeRequest,
      res: nodeResponse,
      waitUntil(cb) {
        waitUntilPromises.push(cb.catch((err) => console.error(err)));
      }
    };
    let response$;
    try {
      response$ = handleNodeRequestAndResponse(nodeRequest, nodeResponse, defaultServerContext, ...ctx);
    } catch (err) {
      response$ = handleErrorFromRequestHandler(err, fetchAPI.Response);
    }
    if (isPromise2(response$)) {
      return response$.catch((e) => handleErrorFromRequestHandler(e, fetchAPI.Response)).then((response) => sendNodeResponse(response, nodeResponse, nodeRequest)).catch((err) => {
        console.error(`Unexpected error while handling request: ${err.message || err}`);
      });
    }
    try {
      return sendNodeResponse(response$, nodeResponse, nodeRequest);
    } catch (err) {
      console.error(`Unexpected error while handling request: ${err.message || err}`);
    }
  }
  function handleUWS(res, req, ...ctx) {
    const waitUntilPromises = [];
    const defaultServerContext = {
      res,
      req,
      waitUntil(cb) {
        waitUntilPromises.push(cb.catch((err) => console.error(err)));
      }
    };
    const filteredCtxParts = ctx.filter((partCtx) => partCtx != null);
    const serverContext = filteredCtxParts.length > 0 ? completeAssign(defaultServerContext, ...ctx) : defaultServerContext;
    const signal = new ServerAdapterRequestAbortSignal();
    const originalResEnd = res.end.bind(res);
    let resEnded = false;
    res.end = function(data) {
      resEnded = true;
      return originalResEnd(data);
    };
    const originalOnAborted = res.onAborted.bind(res);
    originalOnAborted(function() {
      signal.sendAbort();
    });
    res.onAborted = function(cb) {
      signal.addEventListener("abort", cb);
    };
    const request = getRequestFromUWSRequest({
      req,
      res,
      fetchAPI,
      signal
    });
    let response$;
    try {
      response$ = handleRequest(request, serverContext);
    } catch (err) {
      response$ = handleErrorFromRequestHandler(err, fetchAPI.Response);
    }
    if (isPromise2(response$)) {
      return response$.catch((e) => handleErrorFromRequestHandler(e, fetchAPI.Response)).then((response) => {
        if (!signal.aborted && !resEnded) {
          return sendResponseToUwsOpts(res, response, signal);
        }
      }).catch((err) => {
        console.error(`Unexpected error while handling request: 
${err.stack || err.message || err}`);
      });
    }
    try {
      if (!signal.aborted && !resEnded) {
        return sendResponseToUwsOpts(res, response$, signal);
      }
    } catch (err) {
      console.error(`Unexpected error while handling request: 
${err.stack || err.message || err}`);
    }
  }
  function handleEvent(event, ...ctx) {
    if (!event.respondWith || !event.request) {
      throw new TypeError(`Expected FetchEvent, got ${event}`);
    }
    const filteredCtxParts = ctx.filter((partCtx) => partCtx != null);
    const serverContext = filteredCtxParts.length > 0 ? completeAssign({}, event, ...filteredCtxParts) : isolateObject(event);
    const response$ = handleRequest(event.request, serverContext);
    event.respondWith(response$);
  }
  function handleRequestWithWaitUntil(request, ...ctx) {
    const filteredCtxParts = ctx.filter((partCtx) => partCtx != null);
    let waitUntilPromises;
    const serverContext = filteredCtxParts.length > 1 ? completeAssign({}, ...filteredCtxParts) : isolateObject(filteredCtxParts[0], filteredCtxParts[0] == null || filteredCtxParts[0].waitUntil == null ? waitUntilPromises = [] : void 0);
    const response$ = handleRequest(request, serverContext);
    if (waitUntilPromises?.length) {
      return handleWaitUntils(waitUntilPromises).then(() => response$);
    }
    return response$;
  }
  const fetchFn = (input, ...maybeCtx) => {
    if (typeof input === "string" || "href" in input) {
      const [initOrCtx, ...restOfCtx] = maybeCtx;
      if (isRequestInit(initOrCtx)) {
        const request2 = new fetchAPI.Request(input, initOrCtx);
        const res$2 = handleRequestWithWaitUntil(request2, ...restOfCtx);
        return handleAbortSignalAndPromiseResponse(res$2, initOrCtx?.signal);
      }
      const request = new fetchAPI.Request(input);
      return handleRequestWithWaitUntil(request, ...maybeCtx);
    }
    const res$ = handleRequestWithWaitUntil(input, ...maybeCtx);
    return handleAbortSignalAndPromiseResponse(res$, input._signal);
  };
  const genericRequestHandler = (input, ...maybeCtx) => {
    const [initOrCtxOrRes, ...restOfCtx] = maybeCtx;
    if (isNodeRequest(input)) {
      if (!isServerResponse(initOrCtxOrRes)) {
        throw new TypeError(`Expected ServerResponse, got ${initOrCtxOrRes}`);
      }
      return requestListener(input, initOrCtxOrRes, ...restOfCtx);
    }
    if (isUWSResponse(input)) {
      return handleUWS(input, initOrCtxOrRes, ...restOfCtx);
    }
    if (isServerResponse(initOrCtxOrRes)) {
      throw new TypeError("Got Node response without Node request");
    }
    if (isRequestAccessible(input)) {
      if (isFetchEvent(input)) {
        return handleEvent(input, ...maybeCtx);
      }
      return handleRequestWithWaitUntil(input.request, input, ...maybeCtx);
    }
    return fetchFn(input, ...maybeCtx);
  };
  const adapterObj = {
    handleRequest: handleRequestWithWaitUntil,
    fetch: fetchFn,
    handleNodeRequest,
    handleNodeRequestAndResponse,
    requestListener,
    handleEvent,
    handleUWS,
    handle: genericRequestHandler
  };
  const serverAdapter = new Proxy(genericRequestHandler, {
    // It should have all the attributes of the handler function and the server instance
    has: (_, prop) => {
      return prop in adapterObj || prop in genericRequestHandler || serverAdapterBaseObject && prop in serverAdapterBaseObject;
    },
    get: (_, prop) => {
      const adapterProp = adapterObj[prop];
      if (adapterProp) {
        if (adapterProp.bind) {
          return adapterProp.bind(adapterObj);
        }
        return adapterProp;
      }
      const handleProp = genericRequestHandler[prop];
      if (handleProp) {
        if (handleProp.bind) {
          return handleProp.bind(genericRequestHandler);
        }
        return handleProp;
      }
      if (serverAdapterBaseObject) {
        const serverAdapterBaseObjectProp = serverAdapterBaseObject[prop];
        if (serverAdapterBaseObjectProp) {
          if (serverAdapterBaseObjectProp.bind) {
            return function(...args) {
              const returnedVal = serverAdapterBaseObject[prop](...args);
              if (returnedVal === serverAdapterBaseObject) {
                return serverAdapter;
              }
              return returnedVal;
            };
          }
          return serverAdapterBaseObjectProp;
        }
      }
    },
    apply(_, __, args) {
      return genericRequestHandler(...args);
    }
  });
  return serverAdapter;
}

// ../../../node_modules/.pnpm/@whatwg-node+server@0.9.46/node_modules/@whatwg-node/server/esm/plugins/useCors.js
function getCORSHeadersByRequestAndOptions(request, corsOptions) {
  const currentOrigin = request.headers.get("origin");
  if (corsOptions === false || currentOrigin == null) {
    return null;
  }
  const headers = {};
  if (corsOptions.origin == null || corsOptions.origin.length === 0 || corsOptions.origin.includes("*")) {
    headers["Access-Control-Allow-Origin"] = currentOrigin;
    headers["Vary"] = "Origin";
  } else if (typeof corsOptions.origin === "string") {
    headers["Access-Control-Allow-Origin"] = corsOptions.origin;
  } else if (Array.isArray(corsOptions.origin)) {
    if (corsOptions.origin.length === 1) {
      headers["Access-Control-Allow-Origin"] = corsOptions.origin[0];
    } else if (corsOptions.origin.includes(currentOrigin)) {
      headers["Access-Control-Allow-Origin"] = currentOrigin;
      headers["Vary"] = "Origin";
    } else {
      headers["Access-Control-Allow-Origin"] = "null";
    }
  }
  if (corsOptions.methods?.length) {
    headers["Access-Control-Allow-Methods"] = corsOptions.methods.join(", ");
  } else {
    const requestMethod = request.headers.get("access-control-request-method");
    if (requestMethod) {
      headers["Access-Control-Allow-Methods"] = requestMethod;
    }
  }
  if (corsOptions.allowedHeaders?.length) {
    headers["Access-Control-Allow-Headers"] = corsOptions.allowedHeaders.join(", ");
  } else {
    const requestHeaders = request.headers.get("access-control-request-headers");
    if (requestHeaders) {
      headers["Access-Control-Allow-Headers"] = requestHeaders;
      if (headers["Vary"]) {
        headers["Vary"] += ", Access-Control-Request-Headers";
      } else {
        headers["Vary"] = "Access-Control-Request-Headers";
      }
    }
  }
  if (corsOptions.credentials != null) {
    if (corsOptions.credentials === true) {
      headers["Access-Control-Allow-Credentials"] = "true";
    }
  } else if (headers["Access-Control-Allow-Origin"] !== "*") {
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  if (corsOptions.exposedHeaders) {
    headers["Access-Control-Expose-Headers"] = corsOptions.exposedHeaders.join(", ");
  }
  if (corsOptions.maxAge) {
    headers["Access-Control-Max-Age"] = corsOptions.maxAge.toString();
  }
  return headers;
}
async function getCORSResponseHeaders(request, corsOptionsFactory, serverContext) {
  const corsOptions = await corsOptionsFactory(request, serverContext);
  return getCORSHeadersByRequestAndOptions(request, corsOptions);
}
function useCORS(options) {
  let corsOptionsFactory = () => ({});
  if (options != null) {
    if (typeof options === "function") {
      corsOptionsFactory = options;
    } else if (typeof options === "object") {
      const corsOptions = {
        ...options
      };
      corsOptionsFactory = () => corsOptions;
    } else if (options === false) {
      corsOptionsFactory = () => false;
    }
  }
  return {
    onRequest({ request, fetchAPI, endResponse: endResponse2 }) {
      if (request.method.toUpperCase() === "OPTIONS") {
        const response = new fetchAPI.Response(null, {
          status: 204,
          // Safari (and potentially other browsers) need content-length 0,
          // for 204 or they just hang waiting for a body
          // see: https://github.com/expressjs/cors/blob/master/lib/index.js#L176
          headers: {
            "Content-Length": "0"
          }
        });
        endResponse2(response);
      }
    },
    async onResponse({ request, serverContext, response }) {
      const headers = await getCORSResponseHeaders(request, corsOptionsFactory, serverContext);
      if (headers != null) {
        for (const headerName in headers) {
          response.headers.set(headerName, headers[headerName]);
        }
      }
    }
  };
}

// ../../../node_modules/.pnpm/@whatwg-node+server@0.9.46/node_modules/@whatwg-node/server/esm/plugins/useErrorHandling.js
function createDefaultErrorHandler(ResponseCtor = Response) {
  return function defaultErrorHandler(e) {
    if (e.details || e.status || e.headers || e.name === "HTTPError") {
      return new ResponseCtor(typeof e.details === "object" ? JSON.stringify(e.details) : e.message, {
        status: e.status,
        headers: e.headers || {}
      });
    }
    console.error(e);
    return createDefaultErrorResponse(ResponseCtor);
  };
}
function createDefaultErrorResponse(ResponseCtor) {
  if (ResponseCtor.error) {
    return ResponseCtor.error();
  }
  return new ResponseCtor(null, { status: 500 });
}
function useErrorHandling(onError) {
  return {
    onRequest({ requestHandler, setRequestHandler, fetchAPI }) {
      const errorHandler = onError || createDefaultErrorHandler(fetchAPI.Response);
      setRequestHandler(function handlerWithErrorHandling(request, serverContext) {
        try {
          const response$ = requestHandler(request, serverContext);
          if (isPromise2(response$)) {
            return response$.catch((e) => errorHandler(e, request, serverContext) || createDefaultErrorResponse(fetchAPI.Response));
          }
          return response$;
        } catch (e) {
          return errorHandler(e, request, serverContext) || createDefaultErrorResponse(fetchAPI.Response);
        }
      });
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-parser/utils.js
function handleURLSearchParams(searchParams) {
  const operationName = searchParams.get("operationName") || void 0;
  const query = searchParams.get("query") || void 0;
  const variablesStr = searchParams.get("variables") || void 0;
  const extensionsStr = searchParams.get("extensions") || void 0;
  return {
    operationName,
    query,
    variables: variablesStr ? JSON.parse(variablesStr) : void 0,
    extensions: extensionsStr ? JSON.parse(extensionsStr) : void 0
  };
}
function parseURLSearchParams(requestBody) {
  const searchParams = new URLSearchParams(requestBody);
  return handleURLSearchParams(searchParams);
}
function isContentTypeMatch(request, expectedContentType) {
  let contentType = request.headers.get("content-type");
  contentType = contentType?.split(",")[0] || null;
  return contentType === expectedContentType || !!contentType?.startsWith(`${expectedContentType};`);
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-parser/get.js
function isGETRequest(request) {
  return request.method === "GET";
}
function parseGETRequest(request) {
  const [, queryString = ""] = request.url.split("?");
  const searchParams = new URLSearchParams(queryString);
  return handleURLSearchParams(searchParams);
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-parser/post-form-url-encoded.js
function isPOSTFormUrlEncodedRequest(request) {
  return request.method === "POST" && isContentTypeMatch(request, "application/x-www-form-urlencoded");
}
async function parsePOSTFormUrlEncodedRequest(request) {
  const requestBody = await request.text();
  return parseURLSearchParams(requestBody);
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-parser/post-graphql-string.js
function isPOSTGraphQLStringRequest(request) {
  return request.method === "POST" && isContentTypeMatch(request, "application/graphql");
}
async function parsePOSTGraphQLStringRequest(request) {
  const requestBody = await request.text();
  return {
    query: requestBody
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-parser/post-json.js
import { createGraphQLError as createGraphQLError4 } from "https://esm.sh/@graphql-tools/utils@10.5.4";
function isPOSTJsonRequest(request) {
  return request.method === "POST" && (isContentTypeMatch(request, "application/json") || isContentTypeMatch(request, "application/graphql+json"));
}
async function parsePOSTJsonRequest(request) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (err) {
    const extensions = {
      http: {
        spec: true,
        status: 400
      }
    };
    if (err instanceof Error) {
      extensions.originalError = {
        name: err.name,
        message: err.message
      };
    }
    throw createGraphQLError4("POST body sent invalid JSON.", {
      extensions
    });
  }
  if (requestBody == null) {
    throw createGraphQLError4(`POST body is expected to be object but received ${requestBody}`, {
      extensions: {
        http: {
          status: 400
        }
      }
    });
  }
  const requestBodyTypeof = typeof requestBody;
  if (requestBodyTypeof !== "object") {
    throw createGraphQLError4(`POST body is expected to be object but received ${requestBodyTypeof}`, {
      extensions: {
        http: {
          status: 400
        }
      }
    });
  }
  return requestBody;
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-parser/post-multipart.js
import { dset } from "https://esm.sh/dset@3.1.3";
import { createGraphQLError as createGraphQLError5 } from "https://esm.sh/@graphql-tools/utils@10.5.4";
function isPOSTMultipartRequest(request) {
  return request.method === "POST" && isContentTypeMatch(request, "multipart/form-data");
}
async function parsePOSTMultipartRequest(request) {
  let requestBody;
  try {
    requestBody = await request.formData();
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("File size limit exceeded: ")) {
      throw createGraphQLError5(e.message, {
        extensions: {
          http: {
            status: 413
          }
        }
      });
    }
    throw e;
  }
  const operationsStr = requestBody.get("operations");
  if (!operationsStr) {
    throw createGraphQLError5('Missing multipart form field "operations"');
  }
  if (typeof operationsStr !== "string") {
    throw createGraphQLError5('Multipart form field "operations" must be a string');
  }
  let operations;
  try {
    operations = JSON.parse(operationsStr);
  } catch (err) {
    throw createGraphQLError5('Multipart form field "operations" must be a valid JSON string');
  }
  const mapStr = requestBody.get("map");
  if (mapStr != null) {
    if (typeof mapStr !== "string") {
      throw createGraphQLError5('Multipart form field "map" must be a string');
    }
    let map2;
    try {
      map2 = JSON.parse(mapStr);
    } catch (err) {
      throw createGraphQLError5('Multipart form field "map" must be a valid JSON string');
    }
    for (const fileIndex in map2) {
      const file = requestBody.get(fileIndex);
      const keys = map2[fileIndex];
      for (const key of keys) {
        dset(operations, key, file);
      }
    }
  }
  return operations;
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-validation/use-check-graphql-query-params.js
import { createGraphQLError as createGraphQLError6 } from "https://esm.sh/@graphql-tools/utils@10.5.4";
var expectedParameters = /* @__PURE__ */ new Set(["query", "variables", "operationName", "extensions"]);
function assertInvalidParams(params, extraParamNames) {
  if (params == null || typeof params !== "object") {
    throw createGraphQLError6('Invalid "params" in the request body', {
      extensions: {
        http: {
          spec: true,
          status: 400
        }
      }
    });
  }
  for (const paramKey in params) {
    if (params[paramKey] == null) {
      continue;
    }
    if (!expectedParameters.has(paramKey)) {
      if (extraParamNames?.includes(paramKey)) {
        continue;
      }
      throw createGraphQLError6(`Unexpected parameter "${paramKey}" in the request body.`, {
        extensions: {
          http: {
            status: 400
          }
        }
      });
    }
  }
}
function checkGraphQLQueryParams(params, extraParamNames) {
  if (!isObject(params)) {
    throw createGraphQLError6(`Expected params to be an object but given ${extendedTypeof(params)}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        }
      }
    });
  }
  assertInvalidParams(params, extraParamNames);
  if (params.query == null) {
    throw createGraphQLError6("Must provide query string.", {
      extensions: {
        http: {
          spec: true,
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        }
      }
    });
  }
  const queryType = extendedTypeof(params.query);
  if (queryType !== "string") {
    throw createGraphQLError6(`Expected "query" param to be a string, but given ${queryType}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        }
      }
    });
  }
  const variablesParamType = extendedTypeof(params.variables);
  if (!["object", "null", "undefined"].includes(variablesParamType)) {
    throw createGraphQLError6(`Expected "variables" param to be empty or an object, but given ${variablesParamType}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        }
      }
    });
  }
  const extensionsParamType = extendedTypeof(params.extensions);
  if (!["object", "null", "undefined"].includes(extensionsParamType)) {
    throw createGraphQLError6(`Expected "extensions" param to be empty or an object, but given ${extensionsParamType}.`, {
      extensions: {
        http: {
          status: 400,
          headers: {
            Allow: "GET, POST"
          }
        }
      }
    });
  }
  return params;
}
function useCheckGraphQLQueryParams(extraParamNames) {
  return {
    onParams({ params }) {
      checkGraphQLQueryParams(params, extraParamNames);
    }
  };
}
function extendedTypeof(val) {
  if (val === null) {
    return "null";
  }
  if (Array.isArray(val)) {
    return "array";
  }
  return typeof val;
}
function isObject(val) {
  return extendedTypeof(val) === "object";
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-validation/use-check-method-for-graphql.js
import { createGraphQLError as createGraphQLError7 } from "https://esm.sh/@graphql-tools/utils@10.5.4";
function isValidMethodForGraphQL(method) {
  return method === "GET" || method === "POST";
}
function useCheckMethodForGraphQL() {
  return {
    onRequestParse({ request }) {
      if (!isValidMethodForGraphQL(request.method)) {
        throw createGraphQLError7("GraphQL only supports GET and POST requests.", {
          extensions: {
            http: {
              status: 405,
              headers: {
                Allow: "GET, POST"
              }
            }
          }
        });
      }
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-validation/use-http-validation-error.js
function useHTTPValidationError() {
  return {
    onValidate() {
      return ({ valid, result }) => {
        if (!valid) {
          for (const error of result) {
            error.extensions.http = {
              ...error.extensions.http,
              spec: error.extensions.http?.spec ?? true,
              status: error.extensions.http?.status ?? 400
            };
          }
        }
      };
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-validation/use-limit-batching.js
function useLimitBatching(limit) {
  return {
    onRequestParse() {
      return {
        onRequestParseDone({ requestParserResult }) {
          if (Array.isArray(requestParserResult)) {
            if (!limit) {
              throw createGraphQLError(`Batching is not supported.`, {
                extensions: {
                  http: {
                    status: 400
                  }
                }
              });
            }
            if (requestParserResult.length > limit) {
              throw createGraphQLError(`Batching is limited to ${limit} operations per request.`, {
                extensions: {
                  http: {
                    status: 413
                  }
                }
              });
            }
          }
        }
      };
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/request-validation/use-prevent-mutation-via-get.js
import { getOperationAST as getOperationAST2, GraphQLError as GraphQLError3 } from "https://esm.sh/graphql@16.8.2";
import { createGraphQLError as createGraphQLError8 } from "https://esm.sh/@graphql-tools/utils@10.5.4";
function assertMutationViaGet(method, document, operationName) {
  const operation = document ? getOperationAST2(document, operationName) ?? void 0 : void 0;
  if (!operation) {
    throw createGraphQLError8("Could not determine what operation to execute.", {
      extensions: {
        http: {
          status: 400
        }
      }
    });
  }
  if (operation.operation === "mutation" && method === "GET") {
    throw createGraphQLError8("Can only perform a mutation operation from a POST request.", {
      extensions: {
        http: {
          status: 405,
          headers: {
            Allow: "POST"
          }
        }
      }
    });
  }
}
function usePreventMutationViaGET() {
  return {
    onParse() {
      return ({ result, context: {
        request,
        // the `params` might be missing in cases where the user provided
        // malformed context to getEnveloped (like `yoga.getEnveloped({})`)
        params: { operationName } = {}
      } }) => {
        if (!request) {
          return;
        }
        if (result instanceof Error) {
          if (result instanceof GraphQLError3) {
            result.extensions.http = {
              spec: true,
              status: 400
            };
          }
          throw result;
        }
        assertMutationViaGet(request.method, result, operationName);
      };
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-health-check.js
function useHealthCheck({ id = Date.now().toString(), logger = console, endpoint = "/health" } = {}) {
  return {
    onRequest({ endResponse: endResponse2, fetchAPI, request }) {
      if (request.url.endsWith(endpoint)) {
        logger.debug("Responding Health Check");
        const response = new fetchAPI.Response(null, {
          status: 200,
          headers: {
            "x-yoga-id": id
          }
        });
        endResponse2(response);
      }
    }
  };
}

// ../../../node_modules/.pnpm/lru-cache@10.4.3/node_modules/lru-cache/dist/esm/index.js
var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
var warned = /* @__PURE__ */ new Set();
var PROCESS = typeof process === "object" && !!process ? process : {};
var emitWarning = (msg, type, code, fn) => {
  typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
var AC = globalThis.AbortController;
var AS = globalThis.AbortSignal;
if (typeof AC === "undefined") {
  AS = class AbortSignal {
    onabort;
    _onabort = [];
    reason;
    aborted = false;
    addEventListener(_, fn) {
      this._onabort.push(fn);
    }
  };
  AC = class AbortController {
    constructor() {
      warnACPolyfill();
    }
    signal = new AS();
    abort(reason) {
      if (this.signal.aborted)
        return;
      this.signal.reason = reason;
      this.signal.aborted = true;
      for (const fn of this.signal._onabort) {
        fn(reason);
      }
      this.signal.onabort?.(reason);
    }
  };
  let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
  const warnACPolyfill = () => {
    if (!printACPolyfillWarning)
      return;
    printACPolyfillWarning = false;
    emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
  };
}
var shouldWarn = (code) => !warned.has(code);
var TYPE = Symbol("type");
var isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
var ZeroArray = class extends Array {
  constructor(size) {
    super(size);
    this.fill(0);
  }
};
var Stack = class _Stack {
  heap;
  length;
  // private constructor
  static #constructing = false;
  static create(max) {
    const HeapCls = getUintArray(max);
    if (!HeapCls)
      return [];
    _Stack.#constructing = true;
    const s = new _Stack(max, HeapCls);
    _Stack.#constructing = false;
    return s;
  }
  constructor(max, HeapCls) {
    if (!_Stack.#constructing) {
      throw new TypeError("instantiate Stack using Stack.create(n)");
    }
    this.heap = new HeapCls(max);
    this.length = 0;
  }
  push(n) {
    this.heap[this.length++] = n;
  }
  pop() {
    return this.heap[--this.length];
  }
};
var LRUCache = class _LRUCache {
  // options that cannot be changed without disaster
  #max;
  #maxSize;
  #dispose;
  #disposeAfter;
  #fetchMethod;
  #memoMethod;
  /**
   * {@link LRUCache.OptionsBase.ttl}
   */
  ttl;
  /**
   * {@link LRUCache.OptionsBase.ttlResolution}
   */
  ttlResolution;
  /**
   * {@link LRUCache.OptionsBase.ttlAutopurge}
   */
  ttlAutopurge;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnGet}
   */
  updateAgeOnGet;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnHas}
   */
  updateAgeOnHas;
  /**
   * {@link LRUCache.OptionsBase.allowStale}
   */
  allowStale;
  /**
   * {@link LRUCache.OptionsBase.noDisposeOnSet}
   */
  noDisposeOnSet;
  /**
   * {@link LRUCache.OptionsBase.noUpdateTTL}
   */
  noUpdateTTL;
  /**
   * {@link LRUCache.OptionsBase.maxEntrySize}
   */
  maxEntrySize;
  /**
   * {@link LRUCache.OptionsBase.sizeCalculation}
   */
  sizeCalculation;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
   */
  noDeleteOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
   */
  noDeleteOnStaleGet;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
   */
  allowStaleOnFetchAbort;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
   */
  allowStaleOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.ignoreFetchAbort}
   */
  ignoreFetchAbort;
  // computed properties
  #size;
  #calculatedSize;
  #keyMap;
  #keyList;
  #valList;
  #next;
  #prev;
  #head;
  #tail;
  #free;
  #disposed;
  #sizes;
  #starts;
  #ttls;
  #hasDispose;
  #hasFetchMethod;
  #hasDisposeAfter;
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(c) {
    return {
      // properties
      starts: c.#starts,
      ttls: c.#ttls,
      sizes: c.#sizes,
      keyMap: c.#keyMap,
      keyList: c.#keyList,
      valList: c.#valList,
      next: c.#next,
      prev: c.#prev,
      get head() {
        return c.#head;
      },
      get tail() {
        return c.#tail;
      },
      free: c.#free,
      // methods
      isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
      backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
      moveToTail: (index) => c.#moveToTail(index),
      indexes: (options) => c.#indexes(options),
      rindexes: (options) => c.#rindexes(options),
      isStale: (index) => c.#isStale(index)
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return this.#max;
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return this.#maxSize;
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return this.#calculatedSize;
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return this.#size;
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return this.#fetchMethod;
  }
  get memoMethod() {
    return this.#memoMethod;
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return this.#dispose;
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return this.#disposeAfter;
  }
  constructor(options) {
    const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
    if (max !== 0 && !isPosInt(max)) {
      throw new TypeError("max option must be a nonnegative integer");
    }
    const UintArray = max ? getUintArray(max) : Array;
    if (!UintArray) {
      throw new Error("invalid max value: " + max);
    }
    this.#max = max;
    this.#maxSize = maxSize;
    this.maxEntrySize = maxEntrySize || this.#maxSize;
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!this.#maxSize && !this.maxEntrySize) {
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      }
      if (typeof this.sizeCalculation !== "function") {
        throw new TypeError("sizeCalculation set to non-function");
      }
    }
    if (memoMethod !== void 0 && typeof memoMethod !== "function") {
      throw new TypeError("memoMethod must be a function if defined");
    }
    this.#memoMethod = memoMethod;
    if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
      throw new TypeError("fetchMethod must be a function if specified");
    }
    this.#fetchMethod = fetchMethod;
    this.#hasFetchMethod = !!fetchMethod;
    this.#keyMap = /* @__PURE__ */ new Map();
    this.#keyList = new Array(max).fill(void 0);
    this.#valList = new Array(max).fill(void 0);
    this.#next = new UintArray(max);
    this.#prev = new UintArray(max);
    this.#head = 0;
    this.#tail = 0;
    this.#free = Stack.create(max);
    this.#size = 0;
    this.#calculatedSize = 0;
    if (typeof dispose === "function") {
      this.#dispose = dispose;
    }
    if (typeof disposeAfter === "function") {
      this.#disposeAfter = disposeAfter;
      this.#disposed = [];
    } else {
      this.#disposeAfter = void 0;
      this.#disposed = void 0;
    }
    this.#hasDispose = !!this.#dispose;
    this.#hasDisposeAfter = !!this.#disposeAfter;
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    if (this.maxEntrySize !== 0) {
      if (this.#maxSize !== 0) {
        if (!isPosInt(this.#maxSize)) {
          throw new TypeError("maxSize must be a positive integer if specified");
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      }
      this.#initializeSizeTracking();
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError("ttl must be a positive integer if specified");
      }
      this.#initializeTTLTracking();
    }
    if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    }
    if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
      const code = "LRU_CACHE_UNBOUNDED";
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
        emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
      }
    }
  }
  /**
   * Return the number of ms left in the item's TTL. If item is not in cache,
   * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
   */
  getRemainingTTL(key) {
    return this.#keyMap.has(key) ? Infinity : 0;
  }
  #initializeTTLTracking() {
    const ttls = new ZeroArray(this.#max);
    const starts = new ZeroArray(this.#max);
    this.#ttls = ttls;
    this.#starts = starts;
    this.#setItemTTL = (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (this.#isStale(index)) {
            this.#delete(this.#keyList[index], "expire");
          }
        }, ttl + 1);
        if (t.unref) {
          t.unref();
        }
      }
    };
    this.#updateItemAge = (index) => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    };
    this.#statusTTL = (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        if (!ttl || !start)
          return;
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    };
    let cachedNow = 0;
    const getNow = () => {
      const n = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    };
    this.getRemainingTTL = (key) => {
      const index = this.#keyMap.get(key);
      if (index === void 0) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (!ttl || !start) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    this.#isStale = (index) => {
      const s = starts[index];
      const t = ttls[index];
      return !!t && !!s && (cachedNow || getNow()) - s > t;
    };
  }
  // conditionally set private methods related to TTL
  #updateItemAge = () => {
  };
  #statusTTL = () => {
  };
  #setItemTTL = () => {
  };
  /* c8 ignore stop */
  #isStale = () => false;
  #initializeSizeTracking() {
    const sizes = new ZeroArray(this.#max);
    this.#calculatedSize = 0;
    this.#sizes = sizes;
    this.#removeItemSize = (index) => {
      this.#calculatedSize -= sizes[index];
      sizes[index] = 0;
    };
    this.#requireSize = (k, v, size, sizeCalculation) => {
      if (this.#isBackgroundFetch(v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        }
      }
      return size;
    };
    this.#addItemSize = (index, size, status) => {
      sizes[index] = size;
      if (this.#maxSize) {
        const maxSize = this.#maxSize - sizes[index];
        while (this.#calculatedSize > maxSize) {
          this.#evict(true);
        }
      }
      this.#calculatedSize += sizes[index];
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = this.#calculatedSize;
      }
    };
  }
  #removeItemSize = (_i) => {
  };
  #addItemSize = (_i, _s, _st) => {
  };
  #requireSize = (_k, _v, size, sizeCalculation) => {
    if (size || sizeCalculation) {
      throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
    }
    return 0;
  };
  *#indexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#tail; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#head) {
          break;
        } else {
          i = this.#prev[i];
        }
      }
    }
  }
  *#rindexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#head; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#tail) {
          break;
        } else {
          i = this.#next[i];
        }
      }
    }
  }
  #isValidIndex(index) {
    return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const i of this.#indexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const i of this.#rindexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const i of this.#indexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const i of this.#rindexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * A String value that is used in the creation of the default string
   * description of an object. Called by the built-in method
   * `Object.prototype.toString`.
   */
  [Symbol.toStringTag] = "LRUCache";
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
   */
  find(fn, getOptions = {}) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      if (fn(value, this.#keyList[i], this)) {
        return this.get(this.#keyList[i], getOptions);
      }
    }
  }
  /**
   * Call the supplied function on each item in the cache, in order from most
   * recently used to least recently used.
   *
   * `fn` is called as `fn(value, key, cache)`.
   *
   * If `thisp` is provided, function will be called in the `this`-context of
   * the provided object, or the cache if no `thisp` object is provided.
   *
   * Does not update age or recenty of use, or iterate over stale values.
   */
  forEach(fn, thisp = this) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(fn, thisp = this) {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let deleted = false;
    for (const i of this.#rindexes({ allowStale: true })) {
      if (this.#isStale(i)) {
        this.#delete(this.#keyList[i], "expire");
        deleted = true;
      }
    }
    return deleted;
  }
  /**
   * Get the extended info about a given entry, to get its value, size, and
   * TTL info simultaneously. Returns `undefined` if the key is not present.
   *
   * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
   * serialization, the `start` value is always the current timestamp, and the
   * `ttl` is a calculated remaining time to live (negative if expired).
   *
   * Always returns stale values, if their info is found in the cache, so be
   * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
   * if relevant.
   */
  info(key) {
    const i = this.#keyMap.get(key);
    if (i === void 0)
      return void 0;
    const v = this.#valList[i];
    const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    if (value === void 0)
      return void 0;
    const entry = { value };
    if (this.#ttls && this.#starts) {
      const ttl = this.#ttls[i];
      const start = this.#starts[i];
      if (ttl && start) {
        const remain = ttl - (perf.now() - start);
        entry.ttl = remain;
        entry.start = Date.now();
      }
    }
    if (this.#sizes) {
      entry.size = this.#sizes[i];
    }
    return entry;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to {@link LRLUCache#load}.
   *
   * The `start` fields are calculated relative to a portable `Date.now()`
   * timestamp, even if `performance.now()` is available.
   *
   * Stale entries are always included in the `dump`, even if
   * {@link LRUCache.OptionsBase.allowStale} is false.
   *
   * Note: this returns an actual array, not a generator, so it can be more
   * easily passed around.
   */
  dump() {
    const arr = [];
    for (const i of this.#indexes({ allowStale: true })) {
      const key = this.#keyList[i];
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0 || key === void 0)
        continue;
      const entry = { value };
      if (this.#ttls && this.#starts) {
        entry.ttl = this.#ttls[i];
        const age = perf.now() - this.#starts[i];
        entry.start = Math.floor(Date.now() - age);
      }
      if (this.#sizes) {
        entry.size = this.#sizes[i];
      }
      arr.unshift([key, entry]);
    }
    return arr;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   *
   * The shape of the resulting cache may be different if the same options are
   * not used in both caches.
   *
   * The `start` fields are assumed to be calculated relative to a portable
   * `Date.now()` timestamp, even if `performance.now()` is available.
   */
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        const age = Date.now() - entry.start;
        entry.start = perf.now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  /**
   * Add a value to the cache.
   *
   * Note: if `undefined` is specified as a value, this is an alias for
   * {@link LRUCache#delete}
   *
   * Fields on the {@link LRUCache.SetOptions} options param will override
   * their corresponding values in the constructor options for the scope
   * of this single `set()` operation.
   *
   * If `start` is provided, then that will set the effective start
   * time for the TTL calculation. Note that this must be a previous
   * value of `performance.now()` if supported, or a previous value of
   * `Date.now()` if not.
   *
   * Options object may also include `size`, which will prevent
   * calling the `sizeCalculation` function and just use the specified
   * number if it is a positive integer, and `noDisposeOnSet` which
   * will prevent calling a `dispose` function in the case of
   * overwrites.
   *
   * If the `size` (or return value of `sizeCalculation`) for a given
   * entry is greater than `maxEntrySize`, then the item will not be
   * added to the cache.
   *
   * Will update the recency of the entry.
   *
   * If the value is `undefined`, then this is an alias for
   * `cache.delete(key)`. `undefined` is never stored in the cache.
   */
  set(k, v, setOptions = {}) {
    if (v === void 0) {
      this.delete(k);
      return this;
    }
    const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
    let { noUpdateTTL = this.noUpdateTTL } = setOptions;
    const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = "miss";
        status.maxEntrySizeExceeded = true;
      }
      this.#delete(k, "set");
      return this;
    }
    let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
    if (index === void 0) {
      index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
      this.#keyList[index] = k;
      this.#valList[index] = v;
      this.#keyMap.set(k, index);
      this.#next[this.#tail] = index;
      this.#prev[index] = this.#tail;
      this.#tail = index;
      this.#size++;
      this.#addItemSize(index, size, status);
      if (status)
        status.set = "add";
      noUpdateTTL = false;
    } else {
      this.#moveToTail(index);
      const oldVal = this.#valList[index];
      if (v !== oldVal) {
        if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
          oldVal.__abortController.abort(new Error("replaced"));
          const { __staleWhileFetching: s } = oldVal;
          if (s !== void 0 && !noDisposeOnSet) {
            if (this.#hasDispose) {
              this.#dispose?.(s, k, "set");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([s, k, "set"]);
            }
          }
        } else if (!noDisposeOnSet) {
          if (this.#hasDispose) {
            this.#dispose?.(oldVal, k, "set");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([oldVal, k, "set"]);
          }
        }
        this.#removeItemSize(index);
        this.#addItemSize(index, size, status);
        this.#valList[index] = v;
        if (status) {
          status.set = "replace";
          const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== void 0)
            status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = "update";
      }
    }
    if (ttl !== 0 && !this.#ttls) {
      this.#initializeTTLTracking();
    }
    if (this.#ttls) {
      if (!noUpdateTTL) {
        this.#setItemTTL(index, ttl, start);
      }
      if (status)
        this.#statusTTL(status, index);
    }
    if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    try {
      while (this.#size) {
        const val = this.#valList[this.#head];
        this.#evict(true);
        if (this.#isBackgroundFetch(val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== void 0) {
          return val;
        }
      }
    } finally {
      if (this.#hasDisposeAfter && this.#disposed) {
        const dt = this.#disposed;
        let task;
        while (task = dt?.shift()) {
          this.#disposeAfter?.(...task);
        }
      }
    }
  }
  #evict(free) {
    const head = this.#head;
    const k = this.#keyList[head];
    const v = this.#valList[head];
    if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
      v.__abortController.abort(new Error("evicted"));
    } else if (this.#hasDispose || this.#hasDisposeAfter) {
      if (this.#hasDispose) {
        this.#dispose?.(v, k, "evict");
      }
      if (this.#hasDisposeAfter) {
        this.#disposed?.push([v, k, "evict"]);
      }
    }
    this.#removeItemSize(head);
    if (free) {
      this.#keyList[head] = void 0;
      this.#valList[head] = void 0;
      this.#free.push(head);
    }
    if (this.#size === 1) {
      this.#head = this.#tail = 0;
      this.#free.length = 0;
    } else {
      this.#head = this.#next[head];
    }
    this.#keyMap.delete(k);
    this.#size--;
    return head;
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Check if a key is in the cache, without updating the recency of
   * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
   * to `true` in either the options or the constructor.
   *
   * Will return `false` if the item is stale, even though it is technically in
   * the cache. The difference can be determined (if it matters) by using a
   * `status` argument, and inspecting the `has` field.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(k, hasOptions = {}) {
    const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) {
        return false;
      }
      if (!this.#isStale(index)) {
        if (updateAgeOnHas) {
          this.#updateItemAge(index);
        }
        if (status) {
          status.has = "hit";
          this.#statusTTL(status, index);
        }
        return true;
      } else if (status) {
        status.has = "stale";
        this.#statusTTL(status, index);
      }
    } else if (status) {
      status.has = "miss";
    }
    return false;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(k, peekOptions = {}) {
    const { allowStale = this.allowStale } = peekOptions;
    const index = this.#keyMap.get(k);
    if (index === void 0 || !allowStale && this.#isStale(index)) {
      return;
    }
    const v = this.#valList[index];
    return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
  }
  #backgroundFetch(k, index, options, context) {
    const v = index === void 0 ? void 0 : this.#valList[index];
    if (this.#isBackgroundFetch(v)) {
      return v;
    }
    const ac = new AC();
    const { signal } = options;
    signal?.addEventListener("abort", () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = (v2, updateCache = false) => {
      const { aborted } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort)
            options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      const bf2 = p;
      if (this.#valList[index] === p) {
        if (v2 === void 0) {
          if (bf2.__staleWhileFetching) {
            this.#valList[index] = bf2.__staleWhileFetching;
          } else {
            this.#delete(k, "fetch");
          }
        } else {
          if (options.status)
            options.status.fetchUpdated = true;
          this.set(k, v2, fetchOpts.options);
        }
      }
      return v2;
    };
    const eb = (er) => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    };
    const fetchFail = (er) => {
      const { aborted } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf2 = p;
      if (this.#valList[index] === p) {
        const del = !noDelete || bf2.__staleWhileFetching === void 0;
        if (del) {
          this.#delete(k, "fetch");
        } else if (!allowStaleAborted) {
          this.#valList[index] = bf2.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf2.__staleWhileFetching !== void 0) {
          options.status.returnedStale = true;
        }
        return bf2.__staleWhileFetching;
      } else if (bf2.__returned === bf2) {
        throw er;
      }
    };
    const pcall = (res, rej) => {
      const fmp = this.#fetchMethod?.(k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then((v2) => res(v2 === void 0 ? void 0 : v2), rej);
      }
      ac.signal.addEventListener("abort", () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res(void 0);
          if (options.allowStaleOnFetchAbort) {
            res = (v2) => cb(v2, true);
          }
        }
      });
    };
    if (options.status)
      options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: void 0
    });
    if (index === void 0) {
      this.set(k, bf, { ...fetchOpts.options, status: void 0 });
      index = this.#keyMap.get(k);
    } else {
      this.#valList[index] = bf;
    }
    return bf;
  }
  #isBackgroundFetch(p) {
    if (!this.#hasFetchMethod)
      return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
  }
  async fetch(k, fetchOptions = {}) {
    const {
      // get options
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      // set options
      ttl = this.ttl,
      noDisposeOnSet = this.noDisposeOnSet,
      size = 0,
      sizeCalculation = this.sizeCalculation,
      noUpdateTTL = this.noUpdateTTL,
      // fetch exclusive options
      noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
      ignoreFetchAbort = this.ignoreFetchAbort,
      allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
      context,
      forceRefresh = false,
      status,
      signal
    } = fetchOptions;
    if (!this.#hasFetchMethod) {
      if (status)
        status.fetch = "get";
      return this.get(k, {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        status
      });
    }
    const options = {
      allowStale,
      updateAgeOnGet,
      noDeleteOnStaleGet,
      ttl,
      noDisposeOnSet,
      size,
      sizeCalculation,
      noUpdateTTL,
      noDeleteOnFetchRejection,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      status,
      signal
    };
    let index = this.#keyMap.get(k);
    if (index === void 0) {
      if (status)
        status.fetch = "miss";
      const p = this.#backgroundFetch(k, index, options, context);
      return p.__returned = p;
    } else {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        const stale = allowStale && v.__staleWhileFetching !== void 0;
        if (status) {
          status.fetch = "inflight";
          if (stale)
            status.returnedStale = true;
        }
        return stale ? v.__staleWhileFetching : v.__returned = v;
      }
      const isStale = this.#isStale(index);
      if (!forceRefresh && !isStale) {
        if (status)
          status.fetch = "hit";
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        if (status)
          this.#statusTTL(status, index);
        return v;
      }
      const p = this.#backgroundFetch(k, index, options, context);
      const hasStale = p.__staleWhileFetching !== void 0;
      const staleVal = hasStale && allowStale;
      if (status) {
        status.fetch = isStale ? "stale" : "refresh";
        if (staleVal && isStale)
          status.returnedStale = true;
      }
      return staleVal ? p.__staleWhileFetching : p.__returned = p;
    }
  }
  async forceFetch(k, fetchOptions = {}) {
    const v = await this.fetch(k, fetchOptions);
    if (v === void 0)
      throw new Error("fetch() returned undefined");
    return v;
  }
  memo(k, memoOptions = {}) {
    const memoMethod = this.#memoMethod;
    if (!memoMethod) {
      throw new Error("no memoMethod provided to constructor");
    }
    const { context, forceRefresh, ...options } = memoOptions;
    const v = this.get(k, options);
    if (!forceRefresh && v !== void 0)
      return v;
    const vv = memoMethod(k, v, {
      options,
      context
    });
    this.set(k, vv, options);
    return vv;
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(k, getOptions = {}) {
    const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const value = this.#valList[index];
      const fetching = this.#isBackgroundFetch(value);
      if (status)
        this.#statusTTL(status, index);
      if (this.#isStale(index)) {
        if (status)
          status.get = "stale";
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            this.#delete(k, "expire");
          }
          if (status && allowStale)
            status.returnedStale = true;
          return allowStale ? value : void 0;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== void 0) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : void 0;
        }
      } else {
        if (status)
          status.get = "hit";
        if (fetching) {
          return value.__staleWhileFetching;
        }
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        return value;
      }
    } else if (status) {
      status.get = "miss";
    }
  }
  #connect(p, n) {
    this.#prev[n] = p;
    this.#next[p] = n;
  }
  #moveToTail(index) {
    if (index !== this.#tail) {
      if (index === this.#head) {
        this.#head = this.#next[index];
      } else {
        this.#connect(this.#prev[index], this.#next[index]);
      }
      this.#connect(this.#tail, index);
      this.#tail = index;
    }
  }
  /**
   * Deletes a key out of the cache.
   *
   * Returns true if the key was deleted, false otherwise.
   */
  delete(k) {
    return this.#delete(k, "delete");
  }
  #delete(k, reason) {
    let deleted = false;
    if (this.#size !== 0) {
      const index = this.#keyMap.get(k);
      if (index !== void 0) {
        deleted = true;
        if (this.#size === 1) {
          this.#clear(reason);
        } else {
          this.#removeItemSize(index);
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v, k, reason);
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, reason]);
            }
          }
          this.#keyMap.delete(k);
          this.#keyList[index] = void 0;
          this.#valList[index] = void 0;
          if (index === this.#tail) {
            this.#tail = this.#prev[index];
          } else if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            const pi = this.#prev[index];
            this.#next[pi] = this.#next[index];
            const ni = this.#next[index];
            this.#prev[ni] = this.#prev[index];
          }
          this.#size--;
          this.#free.push(index);
        }
      }
    }
    if (this.#hasDisposeAfter && this.#disposed?.length) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return deleted;
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    return this.#clear("delete");
  }
  #clear(reason) {
    for (const index of this.#rindexes({ allowStale: true })) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        v.__abortController.abort(new Error("deleted"));
      } else {
        const k = this.#keyList[index];
        if (this.#hasDispose) {
          this.#dispose?.(v, k, reason);
        }
        if (this.#hasDisposeAfter) {
          this.#disposed?.push([v, k, reason]);
        }
      }
    }
    this.#keyMap.clear();
    this.#valList.fill(void 0);
    this.#keyList.fill(void 0);
    if (this.#ttls && this.#starts) {
      this.#ttls.fill(0);
      this.#starts.fill(0);
    }
    if (this.#sizes) {
      this.#sizes.fill(0);
    }
    this.#head = 0;
    this.#tail = 0;
    this.#free.length = 0;
    this.#calculatedSize = 0;
    this.#size = 0;
    if (this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
  }
};

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/utils/create-lru-cache.js
var DEFAULT_MAX = 1024;
var DEFAULT_TTL = 36e5;
function createLRUCache({ max = DEFAULT_MAX, ttl = DEFAULT_TTL } = {}) {
  return new LRUCache({ max, ttl });
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-parser-and-validation-cache.js
function useParserAndValidationCache({ documentCache = createLRUCache(), errorCache = createLRUCache(), validationCache = true }) {
  const validationCacheByRules = createLRUCache();
  return {
    onParse({ params, setParsedDocument }) {
      const strDocument = params.source.toString();
      const document = documentCache.get(strDocument);
      if (document) {
        setParsedDocument(document);
        return;
      }
      const parserError = errorCache.get(strDocument);
      if (parserError) {
        throw parserError;
      }
      return ({ result }) => {
        if (result != null) {
          if (result instanceof Error) {
            errorCache.set(strDocument, result);
          } else {
            documentCache.set(strDocument, result);
          }
        }
      };
    },
    onValidate({
      params: { schema, documentAST, rules },
      setResult
      // eslint-disable-next-line @typescript-eslint/ban-types
    }) {
      if (schema == null) {
        return;
      }
      if (validationCache !== false) {
        const rulesKey = rules?.map((rule) => rule.name).join(",") || "";
        let validationCacheBySchema = validationCacheByRules.get(rulesKey);
        if (!validationCacheBySchema) {
          validationCacheBySchema = /* @__PURE__ */ new WeakMap();
          validationCacheByRules.set(rulesKey, validationCacheBySchema);
        }
        let validationCacheByDocument = validationCacheBySchema.get(schema);
        if (!validationCacheByDocument) {
          validationCacheByDocument = /* @__PURE__ */ new WeakMap();
          validationCacheBySchema.set(schema, validationCacheByDocument);
        }
        const cachedResult = validationCacheByDocument.get(documentAST);
        if (cachedResult) {
          setResult(cachedResult);
          return;
        }
        return ({ result }) => {
          if (result != null) {
            validationCacheByDocument?.set(documentAST, result);
          }
        };
      }
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-request-parser.js
var DEFAULT_MATCHER = () => true;
function useRequestParser(options) {
  const matchFn = options.match || DEFAULT_MATCHER;
  return {
    onRequestParse({ request, setRequestParser }) {
      if (matchFn(request)) {
        setRequestParser(options.parse);
      }
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/result-processor/accept.js
function getMediaTypesForRequestInOrder(request) {
  const accepts = (request.headers.get("accept") || "*/*").replace(/\s/g, "").toLowerCase().split(",");
  const mediaTypes = [];
  for (const accept of accepts) {
    const [mediaType, ...params] = accept.split(";");
    const charset = params?.find((param) => param.includes("charset=")) || "charset=utf-8";
    if (charset !== "charset=utf-8") {
      continue;
    }
    mediaTypes.push(mediaType);
  }
  return mediaTypes.reverse();
}
function isMatchingMediaType(askedMediaType, processorMediaType) {
  const [askedPre, askedSuf] = askedMediaType.split("/");
  const [pre, suf] = processorMediaType.split("/");
  if ((pre === "*" || pre === askedPre) && (suf === "*" || suf === askedSuf)) {
    return true;
  }
  return false;
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/result-processor/stringify.js
function jsonStringifyResultWithoutInternals(result) {
  if (Array.isArray(result)) {
    return `[${result.map((r) => {
      const sanitizedResult2 = omitInternalsFromResultErrors(r);
      const stringifier2 = r.stringify || JSON.stringify;
      return stringifier2(sanitizedResult2);
    }).join(",")}]`;
  }
  const sanitizedResult = omitInternalsFromResultErrors(result);
  const stringifier = result.stringify || JSON.stringify;
  return stringifier(sanitizedResult);
}
function omitInternalsFromResultErrors(result) {
  if (result.errors?.length || result.extensions?.http) {
    const newResult = { ...result };
    newResult.errors &&= newResult.errors.map(omitInternalsFromError);
    if (newResult.extensions) {
      const { http, ...extensions } = result.extensions;
      newResult.extensions = Object.keys(extensions).length ? extensions : void 0;
    }
    return newResult;
  }
  return result;
}
function omitInternalsFromError(err) {
  if (isGraphQLError(err)) {
    const serializedError = "toJSON" in err && typeof err.toJSON === "function" ? err.toJSON() : Object(err);
    const { http, unexpected, ...extensions } = serializedError.extensions || {};
    return createGraphQLError(err.message, {
      nodes: err.nodes,
      source: err.source,
      positions: err.positions,
      path: err.path,
      originalError: omitInternalsFromError(err.originalError || void 0),
      extensions: Object.keys(extensions).length ? extensions : void 0
    });
  }
  return err;
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/result-processor/multipart.js
function processMultipartResult(result, fetchAPI) {
  const headersInit = {
    Connection: "keep-alive",
    "Content-Type": 'multipart/mixed; boundary="-"',
    "Transfer-Encoding": "chunked"
  };
  const responseInit = getResponseInitByRespectingErrors(result, headersInit);
  let iterator;
  const textEncoder = new fetchAPI.TextEncoder();
  const readableStream = new fetchAPI.ReadableStream({
    start(controller) {
      if (isAsyncIterable(result)) {
        iterator = result[Symbol.asyncIterator]();
      } else {
        let finished = false;
        iterator = {
          next: () => {
            if (finished) {
              return Promise.resolve({ done: true, value: null });
            }
            finished = true;
            return Promise.resolve({ done: false, value: result });
          }
        };
      }
      controller.enqueue(textEncoder.encode("\r\n"));
      controller.enqueue(textEncoder.encode(`---`));
    },
    async pull(controller) {
      try {
        const { done, value } = await iterator.next();
        if (value != null) {
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(textEncoder.encode("Content-Type: application/json; charset=utf-8"));
          controller.enqueue(textEncoder.encode("\r\n"));
          const chunk = jsonStringifyResultWithoutInternals(value);
          const encodedChunk = textEncoder.encode(chunk);
          controller.enqueue(textEncoder.encode("Content-Length: " + encodedChunk.byteLength));
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(encodedChunk);
          controller.enqueue(textEncoder.encode("\r\n"));
          controller.enqueue(textEncoder.encode("---"));
        }
        if (done) {
          controller.enqueue(textEncoder.encode("--\r\n"));
          controller.close();
        }
      } catch (err) {
        controller.error(err);
      }
    },
    async cancel(e) {
      await iterator.return?.(e);
    }
  });
  return new fetchAPI.Response(readableStream, responseInit);
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/result-processor/regular.js
import { isAsyncIterable as isAsyncIterable4 } from "https://esm.sh/@graphql-tools/utils@10.5.4";
function processRegularResult(executionResult, fetchAPI, acceptedHeader) {
  if (isAsyncIterable4(executionResult)) {
    return new fetchAPI.Response(null, {
      status: 406,
      statusText: "Not Acceptable",
      headers: {
        accept: "application/json; charset=utf-8, application/graphql-response+json; charset=utf-8"
      }
    });
  }
  const headersInit = {
    "Content-Type": acceptedHeader + "; charset=utf-8"
  };
  const responseInit = getResponseInitByRespectingErrors(
    executionResult,
    headersInit,
    // prefer 200 only if accepting application/json and all errors are exclusively GraphQL errors
    acceptedHeader === "application/json" && !Array.isArray(executionResult) && areGraphQLErrors(executionResult.errors) && executionResult.errors.some((err) => !err.extensions?.originalError || isGraphQLError(err.extensions.originalError))
  );
  const responseBody = jsonStringifyResultWithoutInternals(executionResult);
  return new fetchAPI.Response(responseBody, responseInit);
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/result-processor/sse.js
function getSSEProcessor() {
  return function processSSEResult(result, fetchAPI) {
    let pingIntervalMs = 12e3;
    if (globalThis.process?.env?.NODE_ENV === "test") {
      pingIntervalMs = 300;
    }
    const headersInit = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none"
    };
    const responseInit = getResponseInitByRespectingErrors(result, headersInit, true);
    let iterator;
    let pingInterval;
    const textEncoder = new fetchAPI.TextEncoder();
    const readableStream = new fetchAPI.ReadableStream({
      start(controller) {
        controller.enqueue(textEncoder.encode(":\n\n"));
        pingInterval = setInterval(() => {
          if (!controller.desiredSize) {
            clearInterval(pingInterval);
            return;
          }
          controller.enqueue(textEncoder.encode(":\n\n"));
        }, pingIntervalMs);
        if (isAsyncIterable(result)) {
          iterator = result[Symbol.asyncIterator]();
        } else {
          let finished = false;
          iterator = {
            next: () => {
              if (finished) {
                return Promise.resolve({ done: true, value: null });
              }
              finished = true;
              return Promise.resolve({ done: false, value: result });
            }
          };
        }
      },
      async pull(controller) {
        try {
          const result2 = await iterator.next();
          if (result2.value != null) {
            controller.enqueue(textEncoder.encode(`event: next
`));
            const chunk = jsonStringifyResultWithoutInternals(result2.value);
            controller.enqueue(textEncoder.encode(`data: ${chunk}

`));
          }
          if (result2.done) {
            controller.enqueue(textEncoder.encode(`event: complete
`));
            controller.enqueue(textEncoder.encode(`data:

`));
            clearInterval(pingInterval);
            controller.close();
          }
        } catch (err) {
          controller.error(err);
        }
      },
      async cancel(e) {
        clearInterval(pingInterval);
        await iterator.return?.(e);
      }
    });
    return new fetchAPI.Response(readableStream, responseInit);
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-result-processor.js
var multipart = {
  mediaTypes: ["multipart/mixed"],
  asyncIterables: true,
  processResult: processMultipartResult
};
function getSSEProcessorConfig() {
  return {
    mediaTypes: ["text/event-stream"],
    asyncIterables: true,
    processResult: getSSEProcessor()
  };
}
var regular = {
  mediaTypes: ["application/graphql-response+json", "application/json"],
  asyncIterables: false,
  processResult: processRegularResult
};
function useResultProcessors() {
  const isSubscriptionRequestMap = /* @__PURE__ */ new WeakMap();
  const sse = getSSEProcessorConfig();
  const defaultList = [sse, multipart, regular];
  const subscriptionList = [sse, regular];
  return {
    onSubscribe({ args: { contextValue } }) {
      if (contextValue.request) {
        isSubscriptionRequestMap.set(contextValue.request, true);
      }
    },
    onResultProcess({ request, result, acceptableMediaTypes, setResultProcessor }) {
      const isSubscriptionRequest = isSubscriptionRequestMap.get(request);
      const processorConfigList = isSubscriptionRequest ? subscriptionList : defaultList;
      const requestMediaTypes = getMediaTypesForRequestInOrder(request);
      const isAsyncIterableResult = isAsyncIterable(result);
      for (const resultProcessorConfig of processorConfigList) {
        for (const requestMediaType of requestMediaTypes) {
          if (isAsyncIterableResult && !resultProcessorConfig.asyncIterables) {
            continue;
          }
          for (const processorMediaType of resultProcessorConfig.mediaTypes) {
            acceptableMediaTypes.push(processorMediaType);
            if (isMatchingMediaType(processorMediaType, requestMediaType)) {
              setResultProcessor(resultProcessorConfig.processResult, processorMediaType);
            }
          }
        }
      }
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-unhandled-route.js
import { isPromise as isPromise3 } from "https://esm.sh/@graphql-tools/utils@10.5.4";

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/landing-page-html.js
var landing_page_html_default = `<!doctype html><html lang=en><head><meta charset=utf-8><title>Welcome to GraphQL Yoga</title><link rel=icon href=https://raw.githubusercontent.com/dotansimha/graphql-yoga/main/website/public/favicon.ico><style>body,html{padding:0;margin:0;height:100%;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;color:#fff;background-color:#000}main>section.hero{display:flex;height:90vh;justify-content:center;align-items:center;flex-direction:column}.logo{display:flex;align-items:center}.buttons{margin-top:24px}h1{font-size:80px}h2{color:#888;max-width:50%;margin-top:0;text-align:center}a{color:#fff;text-decoration:none;margin-left:10px;margin-right:10px;font-weight:700;transition:color .3s ease;padding:4px;overflow:visible}a.graphiql:hover{color:rgba(255,0,255,.7)}a.docs:hover{color:rgba(28,200,238,.7)}a.tutorial:hover{color:rgba(125,85,245,.7)}svg{margin-right:24px}.not-what-your-looking-for{margin-top:5vh}.not-what-your-looking-for>*{margin-left:auto;margin-right:auto}.not-what-your-looking-for>p{text-align:center}.not-what-your-looking-for>h2{color:#464646}.not-what-your-looking-for>p{max-width:600px;line-height:1.3em}.not-what-your-looking-for>pre{max-width:300px}</style></head><body id=body><main><section class=hero><div class=logo><div><svg xmlns=http://www.w3.org/2000/svg viewBox="-0.41 0.445 472.812 499.811" height=150><defs><linearGradient id=paint0_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint1_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint2_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint3_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint4_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><linearGradient id=paint5_linear_1677_11483 x1=16 y1=14 x2=87.2132 y2=44.5982 gradientUnits=userSpaceOnUse><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><filter id=filter0_f_1677_11483 x=23 y=-25 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter><filter id=filter1_f_1677_11483 x=-24 y=19 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter><linearGradient id=paint6_linear_1677_11483 x1=30 y1=28 x2=66.1645 y2=44.4363 gradientUnits=userSpaceOnUse gradientTransform="matrix(8.139854, 0, 0, 8.139854, -130.346407, -113.25101)"><stop stop-color=#7433FF /><stop offset=1 stop-color=#FFA3FD /></linearGradient><filter id=filter2_f_1677_11483 x=-12 y=-44 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter><filter id=filter3_f_1677_11483 x=13 y=19 width=100 height=100 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix /><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape /><feGaussianBlur stdDeviation=12 result=effect1_foregroundBlur_1677_11483 /></filter></defs><mask id=mask0_1677_11483 style=mask-type:alpha maskUnits=userSpaceOnUse x=16 y=14 width=58 height=62><path d="M21 25.3501C21.7279 25.3501 22.4195 25.5056 23.0433 25.7853L42.1439 14.8C43.0439 14.3 44.1439 14 45.1439 14C46.2439 14 47.2439 14.3 48.1439 14.8L64.5439 24.3C63.3439 25.1 62.4439 26.3 61.8439 27.7L45.9438 18.5C45.6439 18.3 45.344 18.3 45.0441 18.3C44.7441 18.3 44.4439 18.4 44.1439 18.5L25.8225 29.0251C25.9382 29.4471 26 29.8914 26 30.3501C26 33.1115 23.7614 35.3501 21 35.3501C18.2386 35.3501 16 33.1115 16 30.3501C16 27.5887 18.2386 25.3501 21 25.3501Z" fill=url(#paint3_linear_1677_11483) /><path d="M67.2438 35.0329C65.3487 34.3219 64 32.4934 64 30.35C64 27.5886 66.2386 25.35 69 25.35C71.7614 25.35 74 27.5886 74 30.35C74 32.1825 73.0142 33.7848 71.5439 34.6554V55.2C71.5439 57.4 70.3439 59.4 68.5439 60.5L52.1439 69.9C52.1439 68.4 51.6438 66.9 50.7438 65.8L66.3439 56.8C66.9439 56.5 67.2438 55.9 67.2438 55.2V35.0329Z" fill=url(#paint4_linear_1677_11483) /><path d="M49.8439 69.1055C49.9458 69.5034 50 69.9204 50 70.3501C50 73.1115 47.7614 75.3501 45 75.3501C42.5102 75.3501 40.4454 73.5302 40.0633 71.1481L21.8439 60.6C19.9439 59.5 18.8439 57.5 18.8439 55.3V36.8C19.5439 37 20.3439 37.2 21.0439 37.2C21.7439 37.2 22.4439 37.1 23.0439 36.9V55.3C23.0439 56 23.4438 56.6 23.9438 56.9L41.3263 66.9583C42.2398 65.9694 43.5476 65.3501 45 65.3501C47.3291 65.3501 49.2862 66.9426 49.8419 69.0981L49.8436 69.0997L49.8439 69.1055Z" fill=url(#paint5_linear_1677_11483) /></mask><mask id=mask1_1677_11483 style=mask-type:alpha maskUnits=userSpaceOnUse x=30 y=28 width=30 height=30><path fill-rule=evenodd clip-rule=evenodd d="M49.3945 32.3945C49.3945 34.7088 47.5796 38.5469 45 38.5469C42.4271 38.5469 40.6055 34.7112 40.6055 32.3945C40.6055 29.9714 42.5769 28 45 28C47.4231 28 49.3945 29.9714 49.3945 32.3945ZM35.332 49.0433V48.2148C35.332 42.8117 37.8535 41.0004 39.8796 39.545L39.8801 39.5447C40.3928 39.1767 40.8604 38.8404 41.2488 38.4742C42.3293 39.6642 43.626 40.3047 45 40.3047C46.3752 40.3047 47.6725 39.6642 48.7529 38.4754C49.1408 38.841 49.6078 39.1773 50.1199 39.5447L50.1204 39.545C52.1465 41.0004 54.668 42.8117 54.668 48.2148V49.0433L53.8406 49.092C49.9848 49.3185 46.8646 46.9002 45 43.5777C43.1159 46.935 39.9847 49.318 36.1594 49.092L35.332 49.0433ZM58.1463 51.0747L58.1463 51.0746C57.0179 50.891 50.0128 49.7507 45.0007 55.693C40.0116 49.7553 33.1965 50.8592 31.9095 51.0677L31.9095 51.0677C31.7906 51.087 31.7189 51.0986 31.7002 51.0963C31.7005 51.0969 31.7011 51.1045 31.7023 51.1187C31.726 51.4003 31.9682 54.2745 34.0566 56.2422L30 58H60L55.8956 56.2422C57.8537 54.4764 58.1396 52.2685 58.2508 51.4092V51.4091C58.2697 51.2628 58.2836 51.1556 58.2998 51.0963C58.2881 51.0977 58.2356 51.0892 58.1463 51.0747ZM40.4836 50.104C42.3956 49.3212 43.6746 48.1737 45 46.61C46.332 48.1841 47.6159 49.3259 49.5164 50.104C49.5356 50.1425 49.5557 50.1805 49.5756 50.2182C49.5793 50.2253 49.583 50.2323 49.5867 50.2393C48.0911 50.8127 46.4264 51.825 45.0047 53.1444C43.5906 51.8221 41.9673 50.8196 40.4256 50.2153C40.4455 50.1784 40.4648 50.1415 40.4836 50.104Z" fill=black /></mask><path d="M 40.59 93.095 C 46.517 93.095 52.14 94.365 57.22 96.635 L 212.7 7.22 C 220.025 3.149 228.978 0.706 237.12 0.706 C 246.073 0.706 254.213 3.149 261.54 7.22 L 395.032 84.547 C 385.264 91.059 377.939 100.827 373.055 112.224 L 243.631 37.338 C 241.19 35.71 238.747 35.71 236.305 35.71 C 233.863 35.71 231.42 36.523 228.978 37.338 L 79.84 123.009 C 80.786 126.443 81.29 130.058 81.29 133.793 C 81.29 156.269 63.065 174.493 40.59 174.493 C 18.116 174.493 -0.109 156.269 -0.109 133.793 C -0.109 111.32 18.116 93.095 40.59 93.095 Z" fill=url(#paint0_linear_1677_11483) /><path d="M 417.01 171.913 C 401.585 166.126 390.603 151.238 390.603 133.793 C 390.603 111.32 408.83 93.095 431.303 93.095 C 453.777 93.095 472.001 111.32 472.001 133.793 C 472.001 148.706 463.976 161.755 452.011 168.835 L 452.011 336.07 C 452.011 353.977 442.243 370.258 427.591 379.21 L 294.098 455.726 C 294.098 443.516 290.029 431.306 282.703 422.353 L 409.683 349.093 C 414.568 346.651 417.01 341.767 417.01 336.07 L 417.01 171.913 Z" fill=url(#paint1_linear_1677_11483) /><path d="M 275.376 449.253 C 276.206 452.495 276.646 455.889 276.646 459.389 C 276.646 481.863 258.422 500.087 235.947 500.087 C 215.679 500.087 198.87 485.272 195.761 465.883 L 47.46 380.025 C 31.995 371.071 23.041 354.792 23.041 336.884 L 23.041 186.296 C 28.738 187.923 35.25 189.553 40.948 189.553 C 46.646 189.553 52.345 188.738 57.228 187.111 L 57.228 336.884 C 57.228 342.582 60.485 347.465 64.554 349.908 L 206.042 431.777 C 213.481 423.728 224.127 418.689 235.947 418.689 C 254.905 418.689 270.833 431.656 275.36 449.196 L 275.376 449.214 L 275.376 449.253 Z" fill=url(#paint2_linear_1677_11483) /><g mask=url(#mask0_1677_11483) transform="matrix(8.139854, 0, 0, 8.139854, -130.346375, -113.251038)"><g filter=url(#filter0_f_1677_11483)><circle cx=73 cy=25 r=26 fill=#ED2E7E /></g><g filter=url(#filter1_f_1677_11483)><circle cx=26 cy=69 r=26 fill=#1CC8EE /></g></g><path fill-rule=evenodd clip-rule=evenodd d="M 271.713 150.431 C 271.713 169.275 256.948 200.517 235.947 200.517 C 215.003 200.517 200.172 169.292 200.172 150.431 C 200.172 130.708 216.225 114.666 235.947 114.666 C 255.67 114.666 271.713 130.708 271.713 150.431 Z M 157.251 285.952 L 157.251 279.212 C 157.251 235.233 177.771 220.485 194.27 208.641 C 198.447 205.644 202.247 202.901 205.414 199.923 C 214.204 209.608 224.763 214.826 235.947 214.826 C 247.138 214.826 257.697 209.608 266.496 199.931 C 269.653 202.911 273.456 205.644 277.622 208.641 C 294.114 220.485 314.642 235.233 314.642 279.212 L 314.642 285.952 L 307.912 286.351 C 276.525 288.191 251.128 268.509 235.947 241.468 C 220.611 268.795 195.126 288.191 163.981 286.351 L 157.251 285.952 Z M 342.953 302.492 C 333.771 300.994 276.751 291.715 235.955 340.082 C 195.345 291.749 139.865 300.734 129.389 302.436 C 128.428 302.59 127.841 302.688 127.687 302.665 C 127.687 302.673 127.695 302.729 127.702 302.85 C 127.897 305.138 129.867 328.532 146.872 344.55 L 113.849 358.862 L 358.044 358.862 L 324.639 344.55 C 340.576 330.177 342.905 312.202 343.807 305.212 C 343.962 304.022 344.077 303.153 344.206 302.665 C 344.108 302.68 343.686 302.606 342.953 302.492 Z M 199.188 294.59 C 214.751 288.215 225.161 278.879 235.947 266.15 C 246.788 278.96 257.241 288.255 272.707 294.59 C 272.869 294.898 273.031 295.207 273.196 295.518 C 273.219 295.574 273.252 295.631 273.285 295.688 C 261.107 300.361 247.555 308.598 235.989 319.334 C 224.477 308.573 211.258 300.417 198.715 295.493 C 198.87 295.191 199.033 294.891 199.188 294.59 Z" fill=url(#paint6_linear_1677_11483) /><g mask=url(#mask1_1677_11483) transform="matrix(8.139854, 0, 0, 8.139854, -130.346375, -113.251038)"><g filter=url(#filter2_f_1677_11483)><circle cx=38 cy=6 r=26 fill=#ED2E7E /></g><g filter=url(#filter3_f_1677_11483)><circle cx=63 cy=69 r=26 fill=#1CC8EE /></g></g></svg></div><h1>GraphQL Yoga</h1></div><h2>The batteries-included cross-platform GraphQL Server.</h2><div class=buttons><a href=https://www.the-guild.dev/graphql/yoga-server/docs class=docs>Read the Docs</a> <a href=https://www.the-guild.dev/graphql/yoga-server/tutorial/basic class=tutorial>Start the Tutorial </a><a href=__GRAPHIQL_LINK__ class=graphiql>Visit GraphiQL</a></div></section><section class=not-what-your-looking-for><h2>Not the page you are looking for? \u{1F440}</h2><p>This page is shown be default whenever a 404 is hit.<br>You can disable this by behavior via the <code>landingPage</code> option.</p><pre>
          <code>
import { createYoga } from 'graphql-yoga';

const yoga = createYoga({
  landingPage: false
})
          </code>
        </pre><p>If you expected this page to be the GraphQL route, you need to configure Yoga. Currently, the GraphQL route is configured to be on <code>__GRAPHIQL_LINK__</code>.</p><pre>
          <code>
import { createYoga } from 'graphql-yoga';

const yoga = createYoga({
  graphqlEndpoint: '__REQUEST_PATH__',
})
          </code>
        </pre></section></main></body></html>`;

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-unhandled-route.js
var defaultRenderLandingPage = function defaultRenderLandingPage2(opts) {
  return new opts.fetchAPI.Response(landing_page_html_default.replace(/__GRAPHIQL_LINK__/g, opts.graphqlEndpoint).replace(/__REQUEST_PATH__/g, opts.url.pathname), {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "text/html"
    }
  });
};
function useUnhandledRoute(args) {
  let urlPattern;
  function getUrlPattern({ URLPattern: URLPattern2 }) {
    urlPattern ||= new URLPattern2({
      pathname: args.graphqlEndpoint
    });
    return urlPattern;
  }
  const landingPageRenderer = args.landingPageRenderer || defaultRenderLandingPage;
  return {
    onRequest({ request, fetchAPI, endResponse: endResponse2, url }) {
      if (!request.url.endsWith(args.graphqlEndpoint) && !request.url.endsWith(`${args.graphqlEndpoint}/`) && url.pathname !== args.graphqlEndpoint && url.pathname !== `${args.graphqlEndpoint}/` && !getUrlPattern(fetchAPI).test(url)) {
        if (args.showLandingPage === true && request.method === "GET" && !!request.headers?.get("accept")?.includes("text/html")) {
          const landingPage$ = landingPageRenderer({
            request,
            fetchAPI,
            url,
            graphqlEndpoint: args.graphqlEndpoint,
            get urlPattern() {
              return getUrlPattern(fetchAPI);
            }
          });
          if (isPromise3(landingPage$)) {
            return landingPage$.then(endResponse2);
          }
          endResponse2(landingPage$);
          return;
        }
        endResponse2(new fetchAPI.Response("", {
          status: 404,
          statusText: "Not Found"
        }));
      }
    }
  };
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/process-request.js
import { getOperationAST as getOperationAST3 } from "https://esm.sh/graphql@16.8.2";
async function processResult({ request, result, fetchAPI, onResultProcessHooks, serverContext }) {
  let resultProcessor;
  const acceptableMediaTypes = [];
  let acceptedMediaType = "*/*";
  for (const onResultProcessHook of onResultProcessHooks) {
    await onResultProcessHook({
      request,
      acceptableMediaTypes,
      result,
      setResult(newResult) {
        result = newResult;
      },
      resultProcessor,
      setResultProcessor(newResultProcessor, newAcceptedMimeType) {
        resultProcessor = newResultProcessor;
        acceptedMediaType = newAcceptedMimeType;
      },
      serverContext
    });
  }
  if (!resultProcessor) {
    return new fetchAPI.Response(null, {
      status: 406,
      statusText: "Not Acceptable",
      headers: {
        accept: acceptableMediaTypes.join("; charset=utf-8, ")
      }
    });
  }
  return resultProcessor(result, fetchAPI, acceptedMediaType);
}
async function processRequest({ params, enveloped }) {
  const document = enveloped.parse(params.query);
  const errors = enveloped.validate(enveloped.schema, document);
  if (errors.length > 0) {
    return { errors };
  }
  const contextValue = await enveloped.contextFactory();
  const executionArgs = {
    schema: enveloped.schema,
    document,
    contextValue,
    variableValues: params.variables,
    operationName: params.operationName
  };
  const operation = getOperationAST3(document, params.operationName);
  const executeFn = operation?.operation === "subscription" ? enveloped.subscribe : enveloped.execute;
  return executeFn(executionArgs);
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/utils/mask-error.js
import { createGraphQLError as createGraphQLError9 } from "https://esm.sh/@graphql-tools/utils@10.5.4";
var maskError = (error, message, isDev2 = globalThis.process?.env?.NODE_ENV === "development") => {
  if (isGraphQLError(error)) {
    if (error.originalError) {
      if (error.originalError.name === "GraphQLError") {
        return error;
      }
      const extensions = {
        ...error.extensions,
        unexpected: true
      };
      if (isDev2) {
        extensions.originalError = {
          message: error.originalError.message,
          stack: error.originalError.stack
        };
      }
      return createGraphQLError9(message, {
        nodes: error.nodes,
        source: error.source,
        positions: error.positions,
        path: error.path,
        extensions
      });
    }
    return error;
  }
  return createGraphQLError9(message, {
    extensions: {
      unexpected: true,
      originalError: isDev2 ? error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error : void 0
    }
  });
};

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/server.js
var YogaServer = class {
  /**
   * Instance of envelop
   */
  getEnveloped;
  logger;
  graphqlEndpoint;
  fetchAPI;
  plugins;
  onRequestParseHooks;
  onParamsHooks;
  onExecutionResultHooks;
  onResultProcessHooks;
  maskedErrorsOpts;
  id;
  constructor(options) {
    this.id = options?.id ?? "yoga";
    this.fetchAPI = {
      ...fetch_shim_exports
    };
    if (options?.fetchAPI) {
      for (const key in options.fetchAPI) {
        if (options.fetchAPI[key]) {
          this.fetchAPI[key] = options.fetchAPI[key];
        }
      }
    }
    const logger = options?.logging == null ? true : options.logging;
    this.logger = typeof logger === "boolean" ? logger === true ? createLogger() : createLogger("silent") : typeof logger === "string" ? createLogger(logger) : logger;
    const maskErrorFn = typeof options?.maskedErrors === "object" && options.maskedErrors.maskError || maskError;
    const maskedErrorSet = /* @__PURE__ */ new WeakSet();
    this.maskedErrorsOpts = options?.maskedErrors === false ? null : {
      errorMessage: "Unexpected error.",
      ...typeof options?.maskedErrors === "object" ? options.maskedErrors : {},
      maskError: (error, message) => {
        if (maskedErrorSet.has(error)) {
          return error;
        }
        const newError = maskErrorFn(error, message, this.maskedErrorsOpts?.isDev);
        if (newError !== error) {
          this.logger.error(error);
        }
        maskedErrorSet.add(newError);
        return newError;
      }
    };
    const maskedErrors = this.maskedErrorsOpts == null ? null : this.maskedErrorsOpts;
    let batchingLimit = 0;
    if (options?.batching) {
      if (typeof options.batching === "boolean") {
        batchingLimit = 10;
      } else {
        batchingLimit = options.batching.limit ?? 10;
      }
    }
    this.graphqlEndpoint = options?.graphqlEndpoint || "/graphql";
    const graphqlEndpoint = this.graphqlEndpoint;
    this.plugins = [
      useEngine({
        parse,
        validate,
        execute: normalizedExecutor,
        subscribe: normalizedExecutor,
        specifiedRules
      }),
      // Use the schema provided by the user
      !!options?.schema && useSchema(options.schema),
      options?.context != null && useExtendContext((initialContext) => {
        if (options?.context) {
          if (typeof options.context === "function") {
            return options.context(initialContext);
          }
          return options.context;
        }
        return {};
      }),
      // Middlewares before processing the incoming HTTP request
      useHealthCheck({
        id: this.id,
        logger: this.logger,
        endpoint: options?.healthCheckEndpoint
      }),
      options?.cors !== false && useCORS(options?.cors),
      options?.graphiql !== false && useGraphiQL({
        graphqlEndpoint,
        options: options?.graphiql,
        render: options?.renderGraphiQL,
        logger: this.logger
      }),
      // Middlewares before the GraphQL execution
      useRequestParser({
        match: isGETRequest,
        parse: parseGETRequest
      }),
      useRequestParser({
        match: isPOSTJsonRequest,
        parse: parsePOSTJsonRequest
      }),
      options?.multipart !== false && useRequestParser({
        match: isPOSTMultipartRequest,
        parse: parsePOSTMultipartRequest
      }),
      useRequestParser({
        match: isPOSTGraphQLStringRequest,
        parse: parsePOSTGraphQLStringRequest
      }),
      useRequestParser({
        match: isPOSTFormUrlEncodedRequest,
        parse: parsePOSTFormUrlEncodedRequest
      }),
      // Middlewares after the GraphQL execution
      useResultProcessors(),
      useErrorHandling((error, request, serverContext) => {
        const errors = handleError(error, this.maskedErrorsOpts, this.logger);
        const result = {
          errors
        };
        return processResult({
          request,
          result,
          fetchAPI: this.fetchAPI,
          onResultProcessHooks: this.onResultProcessHooks,
          serverContext
        });
      }),
      ...options?.plugins ?? [],
      // To make sure those are called at the end
      {
        onPluginInit({ addPlugin }) {
          if (options?.parserAndValidationCache !== false) {
            addPlugin(
              // @ts-expect-error Add plugins has context but this hook doesn't care
              useParserAndValidationCache(!options?.parserAndValidationCache || options?.parserAndValidationCache === true ? {} : options?.parserAndValidationCache)
            );
          }
          addPlugin(useLimitBatching(batchingLimit));
          addPlugin(useCheckGraphQLQueryParams(options?.extraParamNames));
          const showLandingPage = !!(options?.landingPage ?? true);
          addPlugin(
            // @ts-expect-error Add plugins has context but this hook doesn't care
            useUnhandledRoute({
              graphqlEndpoint,
              showLandingPage,
              landingPageRenderer: typeof options?.landingPage === "function" ? options.landingPage : void 0
            })
          );
          addPlugin(useCheckMethodForGraphQL());
          addPlugin(usePreventMutationViaGET());
          if (maskedErrors) {
            addPlugin({
              onSubscribe() {
                return {
                  onSubscribeError({ error }) {
                    if (isAbortError(error)) {
                      throw error;
                    }
                  }
                };
              }
            });
            addPlugin(useMaskedErrors(maskedErrors));
          }
          addPlugin(
            // We handle validation errors at the end
            useHTTPValidationError()
          );
        }
      }
    ];
    this.getEnveloped = envelop({
      plugins: this.plugins
    });
    this.plugins = this.getEnveloped._plugins;
    this.onRequestParseHooks = [];
    this.onParamsHooks = [];
    this.onExecutionResultHooks = [];
    this.onResultProcessHooks = [];
    for (const plugin of this.plugins) {
      if (plugin) {
        if (plugin.onYogaInit) {
          plugin.onYogaInit({
            yoga: this
          });
        }
        if (plugin.onRequestParse) {
          this.onRequestParseHooks.push(plugin.onRequestParse);
        }
        if (plugin.onParams) {
          this.onParamsHooks.push(plugin.onParams);
        }
        if (plugin.onExecutionResult) {
          this.onExecutionResultHooks.push(plugin.onExecutionResult);
        }
        if (plugin.onResultProcess) {
          this.onResultProcessHooks.push(plugin.onResultProcess);
        }
      }
    }
  }
  async getResultForParams({ params, request, batched }, serverContext) {
    let result;
    let context = serverContext;
    try {
      for (const onParamsHook of this.onParamsHooks) {
        await onParamsHook({
          params,
          request,
          setParams(newParams) {
            params = newParams;
          },
          setResult(newResult) {
            result = newResult;
          },
          fetchAPI: this.fetchAPI
        });
      }
      if (result == null) {
        const additionalContext = serverContext.request === request ? {
          params
        } : {
          request,
          params
        };
        context = Object.assign(batched ? Object.create(serverContext) : serverContext, additionalContext);
        const enveloped = this.getEnveloped(context);
        this.logger.debug(`Processing GraphQL Parameters`);
        result = await processRequest({
          params,
          enveloped
        });
        this.logger.debug(`Processing GraphQL Parameters done.`);
      }
      if (isAsyncIterable(result)) {
        const iterator = result[Symbol.asyncIterator]();
        result = mapAsyncIterator3(iterator, (v) => v, (err) => {
          if (err.name === "AbortError") {
            this.logger.debug(`Request aborted`);
            throw err;
          }
          const errors = handleError(err, this.maskedErrorsOpts, this.logger);
          return {
            errors
          };
        });
      }
    } catch (error) {
      const errors = handleError(error, this.maskedErrorsOpts, this.logger);
      result = {
        errors
      };
    }
    for (const onExecutionResult of this.onExecutionResultHooks) {
      await onExecutionResult({
        result,
        setResult(newResult) {
          result = newResult;
        },
        request,
        context
      });
    }
    return result;
  }
  handle = async (request, serverContext) => {
    let url = new Proxy({}, {
      get: (_target, prop, _receiver) => {
        url = new this.fetchAPI.URL(request.url, "http://localhost");
        return Reflect.get(url, prop, url);
      }
    });
    let requestParser;
    const onRequestParseDoneList = [];
    for (const onRequestParse of this.onRequestParseHooks) {
      const onRequestParseResult = await onRequestParse({
        request,
        url,
        requestParser,
        serverContext,
        setRequestParser(parser) {
          requestParser = parser;
        }
      });
      if (onRequestParseResult?.onRequestParseDone != null) {
        onRequestParseDoneList.push(onRequestParseResult.onRequestParseDone);
      }
    }
    this.logger.debug(`Parsing request to extract GraphQL parameters`);
    if (!requestParser) {
      return new this.fetchAPI.Response(null, {
        status: 415,
        statusText: "Unsupported Media Type"
      });
    }
    let requestParserResult = await requestParser(request);
    for (const onRequestParseDone of onRequestParseDoneList) {
      await onRequestParseDone({
        requestParserResult,
        setRequestParserResult(newParams) {
          requestParserResult = newParams;
        }
      });
    }
    const result = await (Array.isArray(requestParserResult) ? Promise.all(requestParserResult.map((params) => this.getResultForParams({
      params,
      request,
      batched: true
    }, serverContext))) : this.getResultForParams({
      params: requestParserResult,
      request,
      batched: false
    }, serverContext));
    return processResult({
      request,
      result,
      fetchAPI: this.fetchAPI,
      onResultProcessHooks: this.onResultProcessHooks,
      serverContext
    });
  };
};
function createYoga(options) {
  const server = new YogaServer(options);
  return createServerAdapter(server, {
    fetchAPI: server.fetchAPI,
    plugins: server["plugins"]
  });
}

// ../../../node_modules/.pnpm/@repeaterjs+repeater@3.0.6/node_modules/@repeaterjs/repeater/repeater.js
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n]) i[n] = function(v) {
      return new Promise(function(a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject2) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject2(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
var RepeaterOverflowError = (
  /** @class */
  function(_super) {
    __extends(RepeaterOverflowError2, _super);
    function RepeaterOverflowError2(message) {
      var _this = _super.call(this, message) || this;
      Object.defineProperty(_this, "name", {
        value: "RepeaterOverflowError",
        enumerable: false
      });
      if (typeof Object.setPrototypeOf === "function") {
        Object.setPrototypeOf(_this, _this.constructor.prototype);
      } else {
        _this.__proto__ = _this.constructor.prototype;
      }
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(_this, _this.constructor);
      }
      return _this;
    }
    return RepeaterOverflowError2;
  }(Error)
);
var FixedBuffer = (
  /** @class */
  function() {
    function FixedBuffer2(capacity) {
      if (capacity < 0) {
        throw new RangeError("Capacity may not be less than 0");
      }
      this._c = capacity;
      this._q = [];
    }
    Object.defineProperty(FixedBuffer2.prototype, "empty", {
      get: function() {
        return this._q.length === 0;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(FixedBuffer2.prototype, "full", {
      get: function() {
        return this._q.length >= this._c;
      },
      enumerable: false,
      configurable: true
    });
    FixedBuffer2.prototype.add = function(value) {
      if (this.full) {
        throw new Error("Buffer full");
      } else {
        this._q.push(value);
      }
    };
    FixedBuffer2.prototype.remove = function() {
      if (this.empty) {
        throw new Error("Buffer empty");
      }
      return this._q.shift();
    };
    return FixedBuffer2;
  }()
);
var SlidingBuffer = (
  /** @class */
  function() {
    function SlidingBuffer2(capacity) {
      if (capacity < 1) {
        throw new RangeError("Capacity may not be less than 1");
      }
      this._c = capacity;
      this._q = [];
    }
    Object.defineProperty(SlidingBuffer2.prototype, "empty", {
      get: function() {
        return this._q.length === 0;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(SlidingBuffer2.prototype, "full", {
      get: function() {
        return false;
      },
      enumerable: false,
      configurable: true
    });
    SlidingBuffer2.prototype.add = function(value) {
      while (this._q.length >= this._c) {
        this._q.shift();
      }
      this._q.push(value);
    };
    SlidingBuffer2.prototype.remove = function() {
      if (this.empty) {
        throw new Error("Buffer empty");
      }
      return this._q.shift();
    };
    return SlidingBuffer2;
  }()
);
var DroppingBuffer = (
  /** @class */
  function() {
    function DroppingBuffer2(capacity) {
      if (capacity < 1) {
        throw new RangeError("Capacity may not be less than 1");
      }
      this._c = capacity;
      this._q = [];
    }
    Object.defineProperty(DroppingBuffer2.prototype, "empty", {
      get: function() {
        return this._q.length === 0;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DroppingBuffer2.prototype, "full", {
      get: function() {
        return false;
      },
      enumerable: false,
      configurable: true
    });
    DroppingBuffer2.prototype.add = function(value) {
      if (this._q.length < this._c) {
        this._q.push(value);
      }
    };
    DroppingBuffer2.prototype.remove = function() {
      if (this.empty) {
        throw new Error("Buffer empty");
      }
      return this._q.shift();
    };
    return DroppingBuffer2;
  }()
);
function swallow(value) {
  if (value != null && typeof value.then === "function") {
    value.then(NOOP, NOOP);
  }
}
var Initial = 0;
var Started = 1;
var Stopped = 2;
var Done = 3;
var Rejected = 4;
var MAX_QUEUE_LENGTH = 1024;
var NOOP = function() {
};
function consumeExecution(r) {
  var err = r.err;
  var execution = Promise.resolve(r.execution).then(function(value) {
    if (err != null) {
      throw err;
    }
    return value;
  });
  r.err = void 0;
  r.execution = execution.then(function() {
    return void 0;
  }, function() {
    return void 0;
  });
  return r.pending === void 0 ? execution : r.pending.then(function() {
    return execution;
  });
}
function createIteration(r, value) {
  var done = r.state >= Done;
  return Promise.resolve(value).then(function(value2) {
    if (!done && r.state >= Rejected) {
      return consumeExecution(r).then(function(value3) {
        return {
          value: value3,
          done: true
        };
      });
    }
    return { value: value2, done };
  });
}
function stop(r, err) {
  var e_1, _a;
  if (r.state >= Stopped) {
    return;
  }
  r.state = Stopped;
  r.onnext();
  r.onstop();
  if (r.err == null) {
    r.err = err;
  }
  if (r.pushes.length === 0 && (typeof r.buffer === "undefined" || r.buffer.empty)) {
    finish(r);
  } else {
    try {
      for (var _b = __values(r.pushes), _d = _b.next(); !_d.done; _d = _b.next()) {
        var push_1 = _d.value;
        push_1.resolve();
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }
}
function finish(r) {
  var e_2, _a;
  if (r.state >= Done) {
    return;
  }
  if (r.state < Stopped) {
    stop(r);
  }
  r.state = Done;
  r.buffer = void 0;
  try {
    for (var _b = __values(r.nexts), _d = _b.next(); !_d.done; _d = _b.next()) {
      var next = _d.value;
      var execution = r.pending === void 0 ? consumeExecution(r) : r.pending.then(function() {
        return consumeExecution(r);
      });
      next.resolve(createIteration(r, execution));
    }
  } catch (e_2_1) {
    e_2 = { error: e_2_1 };
  } finally {
    try {
      if (_d && !_d.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_2) throw e_2.error;
    }
  }
  r.pushes = [];
  r.nexts = [];
}
function reject(r) {
  if (r.state >= Rejected) {
    return;
  }
  if (r.state < Done) {
    finish(r);
  }
  r.state = Rejected;
}
function push(r, value) {
  swallow(value);
  if (r.pushes.length >= MAX_QUEUE_LENGTH) {
    throw new RepeaterOverflowError("No more than " + MAX_QUEUE_LENGTH + " pending calls to push are allowed on a single repeater.");
  } else if (r.state >= Stopped) {
    return Promise.resolve(void 0);
  }
  var valueP = r.pending === void 0 ? Promise.resolve(value) : r.pending.then(function() {
    return value;
  });
  valueP = valueP.catch(function(err) {
    if (r.state < Stopped) {
      r.err = err;
    }
    reject(r);
    return void 0;
  });
  var nextP;
  if (r.nexts.length) {
    var next_1 = r.nexts.shift();
    next_1.resolve(createIteration(r, valueP));
    if (r.nexts.length) {
      nextP = Promise.resolve(r.nexts[0].value);
    } else if (typeof r.buffer !== "undefined" && !r.buffer.full) {
      nextP = Promise.resolve(void 0);
    } else {
      nextP = new Promise(function(resolve) {
        return r.onnext = resolve;
      });
    }
  } else if (typeof r.buffer !== "undefined" && !r.buffer.full) {
    r.buffer.add(valueP);
    nextP = Promise.resolve(void 0);
  } else {
    nextP = new Promise(function(resolve) {
      return r.pushes.push({ resolve, value: valueP });
    });
  }
  var floating = true;
  var next = {};
  var unhandled = nextP.catch(function(err) {
    if (floating) {
      throw err;
    }
    return void 0;
  });
  next.then = function(onfulfilled, onrejected) {
    floating = false;
    return Promise.prototype.then.call(nextP, onfulfilled, onrejected);
  };
  next.catch = function(onrejected) {
    floating = false;
    return Promise.prototype.catch.call(nextP, onrejected);
  };
  next.finally = nextP.finally.bind(nextP);
  r.pending = valueP.then(function() {
    return unhandled;
  }).catch(function(err) {
    r.err = err;
    reject(r);
  });
  return next;
}
function createStop(r) {
  var stop1 = stop.bind(null, r);
  var stopP = new Promise(function(resolve) {
    return r.onstop = resolve;
  });
  stop1.then = stopP.then.bind(stopP);
  stop1.catch = stopP.catch.bind(stopP);
  stop1.finally = stopP.finally.bind(stopP);
  return stop1;
}
function execute2(r) {
  if (r.state >= Started) {
    return;
  }
  r.state = Started;
  var push1 = push.bind(null, r);
  var stop1 = createStop(r);
  r.execution = new Promise(function(resolve) {
    return resolve(r.executor(push1, stop1));
  });
  r.execution.catch(function() {
    return stop(r);
  });
}
var records = /* @__PURE__ */ new WeakMap();
var Repeater = (
  /** @class */
  function() {
    function Repeater2(executor, buffer) {
      records.set(this, {
        executor,
        buffer,
        err: void 0,
        state: Initial,
        pushes: [],
        nexts: [],
        pending: void 0,
        execution: void 0,
        onnext: NOOP,
        onstop: NOOP
      });
    }
    Repeater2.prototype.next = function(value) {
      swallow(value);
      var r = records.get(this);
      if (r === void 0) {
        throw new Error("WeakMap error");
      }
      if (r.nexts.length >= MAX_QUEUE_LENGTH) {
        throw new RepeaterOverflowError("No more than " + MAX_QUEUE_LENGTH + " pending calls to next are allowed on a single repeater.");
      }
      if (r.state <= Initial) {
        execute2(r);
      }
      r.onnext(value);
      if (typeof r.buffer !== "undefined" && !r.buffer.empty) {
        var result = createIteration(r, r.buffer.remove());
        if (r.pushes.length) {
          var push_2 = r.pushes.shift();
          r.buffer.add(push_2.value);
          r.onnext = push_2.resolve;
        }
        return result;
      } else if (r.pushes.length) {
        var push_3 = r.pushes.shift();
        r.onnext = push_3.resolve;
        return createIteration(r, push_3.value);
      } else if (r.state >= Stopped) {
        finish(r);
        return createIteration(r, consumeExecution(r));
      }
      return new Promise(function(resolve) {
        return r.nexts.push({ resolve, value });
      });
    };
    Repeater2.prototype.return = function(value) {
      swallow(value);
      var r = records.get(this);
      if (r === void 0) {
        throw new Error("WeakMap error");
      }
      finish(r);
      r.execution = Promise.resolve(r.execution).then(function() {
        return value;
      });
      return createIteration(r, consumeExecution(r));
    };
    Repeater2.prototype.throw = function(err) {
      var r = records.get(this);
      if (r === void 0) {
        throw new Error("WeakMap error");
      }
      if (r.state <= Initial || r.state >= Stopped || typeof r.buffer !== "undefined" && !r.buffer.empty) {
        finish(r);
        if (r.err == null) {
          r.err = err;
        }
        return createIteration(r, consumeExecution(r));
      }
      return this.next(Promise.reject(err));
    };
    Repeater2.prototype[Symbol.asyncIterator] = function() {
      return this;
    };
    Repeater2.race = race;
    Repeater2.merge = merge;
    Repeater2.zip = zip;
    Repeater2.latest = latest;
    return Repeater2;
  }()
);
function getIterators(values, options) {
  var e_3, _a;
  var iters = [];
  var _loop_1 = function(value2) {
    if (value2 != null && typeof value2[Symbol.asyncIterator] === "function") {
      iters.push(value2[Symbol.asyncIterator]());
    } else if (value2 != null && typeof value2[Symbol.iterator] === "function") {
      iters.push(value2[Symbol.iterator]());
    } else {
      iters.push(function valueToAsyncIterator() {
        return __asyncGenerator(this, arguments, function valueToAsyncIterator_1() {
          return __generator(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (!options.yieldValues) return [3, 3];
                return [4, __await(value2)];
              case 1:
                return [4, _a2.sent()];
              case 2:
                _a2.sent();
                _a2.label = 3;
              case 3:
                if (!options.returnValues) return [3, 5];
                return [4, __await(value2)];
              case 4:
                return [2, _a2.sent()];
              case 5:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      }());
    }
  };
  try {
    for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
      var value = values_1_1.value;
      _loop_1(value);
    }
  } catch (e_3_1) {
    e_3 = { error: e_3_1 };
  } finally {
    try {
      if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
    } finally {
      if (e_3) throw e_3.error;
    }
  }
  return iters;
}
function race(contenders) {
  var _this = this;
  var iters = getIterators(contenders, { returnValues: true });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advance, stopped, finalIteration, iteration, i_1, _loop_2;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [
                2
                /*return*/
              ];
            }
            stopped = false;
            stop2.then(function() {
              advance();
              stopped = true;
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 5, 7]);
            iteration = void 0;
            i_1 = 0;
            _loop_2 = function() {
              var j, iters_1, iters_1_1, iter;
              var e_4, _a2;
              return __generator(this, function(_b) {
                switch (_b.label) {
                  case 0:
                    j = i_1;
                    try {
                      for (iters_1 = (e_4 = void 0, __values(iters)), iters_1_1 = iters_1.next(); !iters_1_1.done; iters_1_1 = iters_1.next()) {
                        iter = iters_1_1.value;
                        Promise.resolve(iter.next()).then(function(iteration2) {
                          if (iteration2.done) {
                            stop2();
                            if (finalIteration === void 0) {
                              finalIteration = iteration2;
                            }
                          } else if (i_1 === j) {
                            i_1++;
                            advance(iteration2);
                          }
                        }, function(err) {
                          return stop2(err);
                        });
                      }
                    } catch (e_4_1) {
                      e_4 = { error: e_4_1 };
                    } finally {
                      try {
                        if (iters_1_1 && !iters_1_1.done && (_a2 = iters_1.return)) _a2.call(iters_1);
                      } finally {
                        if (e_4) throw e_4.error;
                      }
                    }
                    return [4, new Promise(function(resolve) {
                      return advance = resolve;
                    })];
                  case 1:
                    iteration = _b.sent();
                    if (!(iteration !== void 0)) return [3, 3];
                    return [4, push2(iteration.value)];
                  case 2:
                    _b.sent();
                    _b.label = 3;
                  case 3:
                    return [
                      2
                      /*return*/
                    ];
                }
              });
            };
            _a.label = 2;
          case 2:
            if (!!stopped) return [3, 4];
            return [5, _loop_2()];
          case 3:
            _a.sent();
            return [3, 2];
          case 4:
            return [2, finalIteration && finalIteration.value];
          case 5:
            stop2();
            return [4, Promise.race(iters.map(function(iter) {
              return iter.return && iter.return();
            }))];
          case 6:
            _a.sent();
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  });
}
function merge(contenders) {
  var _this = this;
  var iters = getIterators(contenders, { yieldValues: true });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advances, stopped, finalIteration;
      var _this2 = this;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [
                2
                /*return*/
              ];
            }
            advances = [];
            stopped = false;
            stop2.then(function() {
              var e_5, _a2;
              stopped = true;
              try {
                for (var advances_1 = __values(advances), advances_1_1 = advances_1.next(); !advances_1_1.done; advances_1_1 = advances_1.next()) {
                  var advance = advances_1_1.value;
                  advance();
                }
              } catch (e_5_1) {
                e_5 = { error: e_5_1 };
              } finally {
                try {
                  if (advances_1_1 && !advances_1_1.done && (_a2 = advances_1.return)) _a2.call(advances_1);
                } finally {
                  if (e_5) throw e_5.error;
                }
              }
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 3, 4]);
            return [4, Promise.all(iters.map(function(iter, i) {
              return __awaiter(_this2, void 0, void 0, function() {
                var iteration, _a2;
                return __generator(this, function(_b) {
                  switch (_b.label) {
                    case 0:
                      _b.trys.push([0, , 6, 9]);
                      _b.label = 1;
                    case 1:
                      if (!!stopped) return [3, 5];
                      Promise.resolve(iter.next()).then(function(iteration2) {
                        return advances[i](iteration2);
                      }, function(err) {
                        return stop2(err);
                      });
                      return [4, new Promise(function(resolve) {
                        advances[i] = resolve;
                      })];
                    case 2:
                      iteration = _b.sent();
                      if (!(iteration !== void 0)) return [3, 4];
                      if (iteration.done) {
                        finalIteration = iteration;
                        return [
                          2
                          /*return*/
                        ];
                      }
                      return [4, push2(iteration.value)];
                    case 3:
                      _b.sent();
                      _b.label = 4;
                    case 4:
                      return [3, 1];
                    case 5:
                      return [3, 9];
                    case 6:
                      _a2 = iter.return;
                      if (!_a2) return [3, 8];
                      return [4, iter.return()];
                    case 7:
                      _a2 = _b.sent();
                      _b.label = 8;
                    case 8:
                      return [
                        7
                        /*endfinally*/
                      ];
                    case 9:
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              });
            }))];
          case 2:
            _a.sent();
            return [2, finalIteration && finalIteration.value];
          case 3:
            stop2();
            return [
              7
              /*endfinally*/
            ];
          case 4:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  });
}
function zip(contenders) {
  var _this = this;
  var iters = getIterators(contenders, { returnValues: true });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advance, stopped, iterations, values;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [2, []];
            }
            stopped = false;
            stop2.then(function() {
              advance();
              stopped = true;
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 6, 8]);
            _a.label = 2;
          case 2:
            if (!!stopped) return [3, 5];
            Promise.all(iters.map(function(iter) {
              return iter.next();
            })).then(function(iterations2) {
              return advance(iterations2);
            }, function(err) {
              return stop2(err);
            });
            return [4, new Promise(function(resolve) {
              return advance = resolve;
            })];
          case 3:
            iterations = _a.sent();
            if (iterations === void 0) {
              return [
                2
                /*return*/
              ];
            }
            values = iterations.map(function(iteration) {
              return iteration.value;
            });
            if (iterations.some(function(iteration) {
              return iteration.done;
            })) {
              return [2, values];
            }
            return [4, push2(values)];
          case 4:
            _a.sent();
            return [3, 2];
          case 5:
            return [3, 8];
          case 6:
            stop2();
            return [4, Promise.all(iters.map(function(iter) {
              return iter.return && iter.return();
            }))];
          case 7:
            _a.sent();
            return [
              7
              /*endfinally*/
            ];
          case 8:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  });
}
function latest(contenders) {
  var _this = this;
  var iters = getIterators(contenders, {
    yieldValues: true,
    returnValues: true
  });
  return new Repeater(function(push2, stop2) {
    return __awaiter(_this, void 0, void 0, function() {
      var advance, advances, stopped, iterations_1, values_2;
      var _this2 = this;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!iters.length) {
              stop2();
              return [2, []];
            }
            advances = [];
            stopped = false;
            stop2.then(function() {
              var e_6, _a2;
              advance();
              try {
                for (var advances_2 = __values(advances), advances_2_1 = advances_2.next(); !advances_2_1.done; advances_2_1 = advances_2.next()) {
                  var advance1 = advances_2_1.value;
                  advance1();
                }
              } catch (e_6_1) {
                e_6 = { error: e_6_1 };
              } finally {
                try {
                  if (advances_2_1 && !advances_2_1.done && (_a2 = advances_2.return)) _a2.call(advances_2);
                } finally {
                  if (e_6) throw e_6.error;
                }
              }
              stopped = true;
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, , 5, 7]);
            Promise.all(iters.map(function(iter) {
              return iter.next();
            })).then(function(iterations) {
              return advance(iterations);
            }, function(err) {
              return stop2(err);
            });
            return [4, new Promise(function(resolve) {
              return advance = resolve;
            })];
          case 2:
            iterations_1 = _a.sent();
            if (iterations_1 === void 0) {
              return [
                2
                /*return*/
              ];
            }
            values_2 = iterations_1.map(function(iteration) {
              return iteration.value;
            });
            if (iterations_1.every(function(iteration) {
              return iteration.done;
            })) {
              return [2, values_2];
            }
            return [4, push2(values_2.slice())];
          case 3:
            _a.sent();
            return [4, Promise.all(iters.map(function(iter, i) {
              return __awaiter(_this2, void 0, void 0, function() {
                var iteration;
                return __generator(this, function(_a2) {
                  switch (_a2.label) {
                    case 0:
                      if (iterations_1[i].done) {
                        return [2, iterations_1[i].value];
                      }
                      _a2.label = 1;
                    case 1:
                      if (!!stopped) return [3, 4];
                      Promise.resolve(iter.next()).then(function(iteration2) {
                        return advances[i](iteration2);
                      }, function(err) {
                        return stop2(err);
                      });
                      return [4, new Promise(function(resolve) {
                        return advances[i] = resolve;
                      })];
                    case 2:
                      iteration = _a2.sent();
                      if (iteration === void 0) {
                        return [2, iterations_1[i].value];
                      } else if (iteration.done) {
                        return [2, iteration.value];
                      }
                      values_2[i] = iteration.value;
                      return [4, push2(values_2.slice())];
                    case 3:
                      _a2.sent();
                      return [3, 1];
                    case 4:
                      return [
                        2
                        /*return*/
                      ];
                  }
                });
              });
            }))];
          case 4:
            return [2, _a.sent()];
          case 5:
            stop2();
            return [4, Promise.all(iters.map(function(iter) {
              return iter.return && iter.return();
            }))];
          case 6:
            _a.sent();
            return [
              7
              /*endfinally*/
            ];
          case 7:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  });
}

// ../../../node_modules/.pnpm/@graphql-yoga+subscription@5.0.1/node_modules/@graphql-yoga/subscription/esm/create-pub-sub.js
var import_events = __toESM(require_node_ponyfill(), 1);
var createPubSub = (config) => {
  const target = config?.eventTarget ?? new EventTarget();
  return {
    publish(routingKey, ...args) {
      const payload = args[1] ?? args[0] ?? null;
      const topic = args[1] === void 0 ? routingKey : `${routingKey}:${args[0]}`;
      const event = new import_events.CustomEvent(topic, {
        detail: payload
      });
      target.dispatchEvent(event);
    },
    subscribe(...[routingKey, id]) {
      const topic = id === void 0 ? routingKey : `${routingKey}:${id}`;
      return new Repeater(function subscriptionRepeater(next, stop2) {
        stop2.then(function subscriptionRepeaterStopHandler() {
          target.removeEventListener(topic, pubsubEventListener);
        });
        target.addEventListener(topic, pubsubEventListener);
        function pubsubEventListener(event) {
          next(event.detail);
        }
      });
    }
  };
};

// ../../../node_modules/.pnpm/@graphql-yoga+subscription@5.0.1/node_modules/@graphql-yoga/subscription/esm/operator/filter.js
function filter(filter2) {
  return (source) => new Repeater(async (push2, stop2) => {
    const iterable = source[Symbol.asyncIterator]();
    stop2.then(() => {
      iterable.return?.();
    });
    let latest2;
    while ((latest2 = await iterable.next()).done === false) {
      if (await filter2(latest2.value)) {
        await push2(latest2.value);
      }
    }
    stop2();
  });
}

// ../../../node_modules/.pnpm/@graphql-yoga+subscription@5.0.1/node_modules/@graphql-yoga/subscription/esm/operator/map.js
var map = (mapper) => (source) => new Repeater(async (push2, stop2) => {
  const iterable = source[Symbol.asyncIterator]();
  stop2.then(() => {
    iterable.return?.();
  });
  let latest2;
  while ((latest2 = await iterable.next()).done === false) {
    await push2(await mapper(latest2.value));
  }
  stop2();
});

// ../../../node_modules/.pnpm/@graphql-yoga+subscription@5.0.1/node_modules/@graphql-yoga/subscription/esm/utils/pipe.js
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default:
      let ret = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
  }
}

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/index.js
import { mergeSchemas } from "https://esm.sh/@graphql-tools/schema@10.0.6";

// ../../../node_modules/.pnpm/graphql-yoga@5.7.0_graphql@16.9.0/node_modules/graphql-yoga/esm/plugins/use-execution-cancellation.js
function useExecutionCancellation() {
  return {
    onExecute({ args }) {
      args.signal = args.contextValue?.request?.signal ?? void 0;
    },
    onSubscribe({ args }) {
      args.signal = args.contextValue?.request?.signal ?? void 0;
    }
  };
}

export {
  createGraphQLError,
  warnPrefix,
  infoPrefix,
  errorPrefix,
  debugPrefix,
  createLogger,
  shouldRenderGraphiQL,
  renderGraphiQL,
  useReadinessCheck,
  useSchema,
  createSchema,
  isIntrospectionOperationString,
  makeSubscribe,
  mapAsyncIterator,
  makeExecute,
  isAsyncIterable,
  handleStreamOrSingleExecutionResult,
  finalAsyncIterator,
  errorAsyncIterator,
  envelop,
  useEnvelop,
  useLogger,
  useErrorHandler,
  useExtendContext,
  usePayloadFormatter,
  createLRUCache,
  getSSEProcessor,
  maskError,
  YogaServer,
  createYoga,
  Repeater,
  createPubSub,
  filter,
  map,
  pipe,
  useExecutionCancellation,
  mergeSchemas
};
/*! Bundled license information:

@repeaterjs/repeater/repeater.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
