"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWatcher = void 0;
const tslib_1 = require("tslib");
const promises_1 = require("node:fs/promises");
const path_1 = require("path");
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const utils_1 = require("@graphql-tools/utils");
const debounce_1 = tslib_1.__importDefault(require("debounce"));
const is_glob_1 = tslib_1.__importDefault(require("is-glob"));
const micromatch_1 = tslib_1.__importDefault(require("micromatch"));
const log_symbols_1 = tslib_1.__importDefault(require("log-symbols"));
const codegen_js_1 = require("../codegen.js");
const config_js_1 = require("../config.js");
const hooks_js_1 = require("../hooks.js");
const debugging_js_1 = require("./debugging.js");
const logger_js_1 = require("./logger.js");
function log(msg) {
    // double spaces to inline the message with Listr
    (0, logger_js_1.getLogger)().info(`  ${msg}`);
}
function emitWatching(watchDir) {
    log(`${log_symbols_1.default.info} Watching for changes in ${watchDir}...`);
}
const createWatcher = (initalContext, onNext) => {
    (0, debugging_js_1.debugLog)(`[Watcher] Starting watcher...`);
    let config = initalContext.getConfig();
    const files = [initalContext.filepath].filter(a => a);
    const documents = (0, plugin_helpers_1.normalizeInstanceOrArray)(config.documents);
    const schemas = (0, plugin_helpers_1.normalizeInstanceOrArray)(config.schema);
    // Add schemas and documents from "generates"
    for (const conf of Object.keys(config.generates).map(filename => (0, plugin_helpers_1.normalizeOutputParam)(config.generates[filename]))) {
        schemas.push(...(0, plugin_helpers_1.normalizeInstanceOrArray)(conf.schema));
        documents.push(...(0, plugin_helpers_1.normalizeInstanceOrArray)(conf.documents));
        files.push(...(0, plugin_helpers_1.normalizeInstanceOrArray)(conf.watchPattern));
    }
    if (documents) {
        for (const doc of documents) {
            if (typeof doc === 'string') {
                files.push(doc);
            }
            else {
                files.push(...Object.keys(doc));
            }
        }
    }
    for (const s of schemas) {
        const schema = s;
        if ((0, is_glob_1.default)(schema) || (0, utils_1.isValidPath)(schema)) {
            files.push(schema);
        }
    }
    if (typeof config.watch !== 'boolean') {
        files.push(...(0, plugin_helpers_1.normalizeInstanceOrArray)(config.watch));
    }
    let watcherSubscription;
    const runWatcher = async () => {
        var _a;
        const watchDirectory = await findHighestCommonDirectory(files);
        const parcelWatcher = await Promise.resolve().then(() => tslib_1.__importStar(require('@parcel/watcher')));
        (0, debugging_js_1.debugLog)(`[Watcher] Parcel watcher loaded...`);
        let isShutdown = false;
        const debouncedExec = (0, debounce_1.default)(() => {
            if (!isShutdown) {
                (0, codegen_js_1.executeCodegen)(initalContext)
                    .then(onNext, () => Promise.resolve())
                    .then(() => emitWatching(watchDirectory));
            }
        }, 100);
        emitWatching(watchDirectory);
        const ignored = [];
        for (const entry of Object.keys(config.generates).map(filename => ({
            filename,
            config: (0, plugin_helpers_1.normalizeOutputParam)(config.generates[filename]),
        }))) {
            if (entry.config.preset) {
                const extension = (_a = entry.config.presetConfig) === null || _a === void 0 ? void 0 : _a.extension;
                if (extension) {
                    ignored.push((0, path_1.join)(entry.filename, '**', '*' + extension));
                }
            }
            else {
                ignored.push(entry.filename);
            }
        }
        watcherSubscription = await parcelWatcher.subscribe(watchDirectory, async (_, events) => {
            // it doesn't matter what has changed, need to run whole process anyway
            await Promise.all(events.map(async ({ type: eventName, path }) => {
                /**
                 * @parcel/watcher has no way to run watcher on specific files (https://github.com/parcel-bundler/watcher/issues/42)
                 * But we can use micromatch to filter out events that we don't care about
                 */
                if (!micromatch_1.default.contains(path, files))
                    return;
                (0, hooks_js_1.lifecycleHooks)(config.hooks).onWatchTriggered(eventName, path);
                (0, debugging_js_1.debugLog)(`[Watcher] triggered due to a file ${eventName} event: ${path}`);
                const fullPath = (0, path_1.join)(watchDirectory, path);
                // In ESM require is not defined
                try {
                    delete require.cache[fullPath];
                }
                catch (err) { }
                if (eventName === 'update' && config.configFilePath && fullPath === config.configFilePath) {
                    log(`${log_symbols_1.default.info} Config file has changed, reloading...`);
                    const context = await (0, config_js_1.loadContext)(config.configFilePath);
                    const newParsedConfig = context.getConfig();
                    newParsedConfig.watch = config.watch;
                    newParsedConfig.silent = config.silent;
                    newParsedConfig.overwrite = config.overwrite;
                    newParsedConfig.configFilePath = config.configFilePath;
                    config = newParsedConfig;
                    initalContext.updateConfig(config);
                }
                debouncedExec();
            }));
        }, { ignore: ignored });
        (0, debugging_js_1.debugLog)(`[Watcher] Started`);
        const shutdown = () => {
            isShutdown = true;
            (0, debugging_js_1.debugLog)(`[Watcher] Shutting down`);
            log(`Shutting down watch...`);
            watcherSubscription.unsubscribe();
            (0, hooks_js_1.lifecycleHooks)(config.hooks).beforeDone();
        };
        process.once('SIGINT', shutdown);
        process.once('SIGTERM', shutdown);
    };
    // the promise never resolves to keep process running
    return new Promise((resolve, reject) => {
        (0, codegen_js_1.executeCodegen)(initalContext)
            .then(onNext, () => Promise.resolve())
            .then(runWatcher)
            .catch(err => {
            watcherSubscription.unsubscribe();
            reject(err);
        });
    });
};
exports.createWatcher = createWatcher;
/**
 * Given a list of file paths (each of which may be absolute, or relative to
 * `process.cwd()`), find absolute path of the "highest" common directory,
 * i.e. the directory that contains all the files in the list.
 *
 * @param files List of relative and/or absolute file paths (or micromatch patterns)
 */
const findHighestCommonDirectory = async (files) => {
    // Map files to a list of basePaths, where "base" is the result of mm.scan(pathOrPattern)
    // e.g. mm.scan("/**/foo/bar").base -> "/" ; mm.scan("/foo/bar/**/fizz/*.graphql") -> /foo/bar
    const dirPaths = files
        .map(filePath => ((0, path_1.isAbsolute)(filePath) ? filePath : (0, path_1.resolve)(filePath)))
        .map(patterned => micromatch_1.default.scan(patterned).base);
    // Return longest common prefix if it's accessible, otherwise process.cwd()
    return (async (maybeValidPath) => {
        (0, debugging_js_1.debugLog)(`[Watcher] Longest common prefix of all files: ${maybeValidPath}...`);
        try {
            await (0, promises_1.access)(maybeValidPath);
            return maybeValidPath;
        }
        catch (_a) {
            log(`[Watcher] Longest common prefix (${maybeValidPath}) is not accessible`);
            log(`[Watcher] Watching current working directory (${process.cwd()}) instead`);
            return process.cwd();
        }
    })(longestCommonPrefix(dirPaths.map(path => path.split(path_1.sep))).join(path_1.sep));
};
/**
 * Find the longest common prefix of an array of paths, where each item in
 * the array an array of path segments which comprise an absolute path when
 * joined together by a path separator
 *
 * Adapted from:
 * https://duncan-mcardle.medium.com/leetcode-problem-14-longest-common-prefix-javascript-3bc6a2f777c4
 *
 * @param splitPaths An array of arrays, where each item is a path split by its separator
 * @returns An array of path segments representing the longest common prefix of splitPaths
 */
const longestCommonPrefix = (splitPaths) => {
    // Return early on empty input
    if (!splitPaths.length) {
        return [];
    }
    // Loop through the segments of the first path
    for (let i = 0; i <= splitPaths[0].length; i++) {
        // Check if this path segment is present in the same position of every path
        if (!splitPaths.every(string => string[i] === splitPaths[0][i])) {
            // If not, return the path segments up to and including the previous segment
            return splitPaths[0].slice(0, i);
        }
    }
    return splitPaths[0];
};
