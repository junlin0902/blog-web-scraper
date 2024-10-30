var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var graphql_exports = {};
__export(graphql_exports, {
  __rw_graphqlOptions: () => __rw_graphqlOptions,
  handler: () => handler
});
module.exports = __toCommonJS(graphql_exports);
var import_map = __toESM(require("@babel/runtime-corejs3/core-js/map"));
var import_graphql_server = require("@redwoodjs/graphql-server");
var directives_requireAuth_requireAuth = __toESM(require("../directives/requireAuth/requireAuth"));
var directives_skipAuth_skipAuth = __toESM(require("../directives/skipAuth/skipAuth"));
var sdls_blogContents_sdl = __toESM(require("../graphql/blogContents.sdl"));
var sdls_posts_sdl = __toESM(require("../graphql/posts.sdl"));
var services_blogContents_blogContents = __toESM(require("../services/blogContents/blogContents"));
var services_posts_posts = __toESM(require("../services/posts/posts"));
var import_db = require("../lib/db");
var import_logger = require("../lib/logger");
var import_store = require("@redwoodjs/context/dist/store");
let directives = {};
directives.requireAuth_requireAuth = directives_requireAuth_requireAuth;
directives.skipAuth_skipAuth = directives_skipAuth_skipAuth;
let sdls = {};
sdls.blogContents_sdl = sdls_blogContents_sdl;
sdls.posts_sdl = sdls_posts_sdl;
let services = {};
services.blogContents_blogContents = services_blogContents_blogContents;
services.posts_posts = services_posts_posts;
const __rw_graphqlOptions = {
  loggerConfig: {
    logger: import_logger.logger,
    options: {}
  },
  directives,
  sdls,
  services,
  onException: () => {
    import_db.db.$disconnect();
  }
};
const __rw_handler = (0, import_graphql_server.createGraphQLHandler)(__rw_graphqlOptions);
const handler = (__rw_event, __rw__context) => {
  const __rw_contextStore = (0, import_store.getAsyncStoreInstance)().getStore();
  if (__rw_contextStore === void 0) {
    return (0, import_store.getAsyncStoreInstance)().run(new import_map.default(), __rw_handler, __rw_event, __rw__context);
  }
  return __rw_handler(__rw_event, __rw__context);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __rw_graphqlOptions,
  handler
});
//# sourceMappingURL=graphql.js.map
