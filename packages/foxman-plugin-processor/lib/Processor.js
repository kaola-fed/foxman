const path = require('path');
const pathToRegexp = require('path-to-regexp');
const co = require('co');
const { fs, logger, system } = require('@foxman/helpers');
const TaskLock = require('task-lock');
const extname = path.extname;
const { lstat, readFile } = fs;
const { notify } = system;

function noop(p) {
    return p;
}

function dispatcher({ processor, reloaderService, resourcesManager }) {
    const taskLock = new TaskLock();
    return function() {
        return function*(next) {
            const reqPath = this.request.path;
            if (
                !isPathMatched({
                    publicPath: processor.publicPath,
                    reqPath
                })
            ) {
                return yield next;
            }

            if (resourcesManager.has(reqPath)) {
                this.body = resourcesManager.get(reqPath);
                this.type = extname(reqPath);
                return;
            }

            const { pipeline = [], lockTask = false } = processor;
            const processdFilenameStack = getSemiFinished({
                pipeline: [
                    ...pipeline,
                    processor // 从右往左
                ],
                base: processor.base,
                reqPath
            });
            const sourceFile = stackTop(processdFilenameStack);

            let raw;
            try {
                yield lstat(sourceFile);
                raw = (yield readFile(sourceFile)).toString();
            } catch (e) {
                logger.warn(e);
                return yield next;
            }

            try {
                const generator = workflow({
                    raw,
                    processdFilenameStack,
                    reqPath,
                    pipeline,
                    resourcesManager,
                    reloaderService
                });

                let processed;
                if (lockTask) {
                    processed = yield taskLock.push({
                        run: () => {
                            return co(generator);
                        }
                    });
                } else {
                    processed = yield generator;
                }

                resourcesManager.set({ reqPath, processed });
                this.body = processed;
                this.type = extname(reqPath);

                logger.info(`Served by processor - ${reqPath}`);

                return processed;
            } catch (e) {
                return yield next;
            }
        };
    };
}

function* workflow({
    raw,
    processdFilenameStack,
    reqPath,
    pipeline,
    resourcesManager,
    reloaderService
}) {
    let processed = raw;
    const filename = processdFilenameStack.pop();
    const recieveDependencies = createDependenciesReciever({
        reloaderService,
        reqPath,
        resourcesManager,
        filename
    });

    for (const item of pipeline) {
        const { handler } = item;

        try {
            const refs = yield handler.call(item, {
                raw: processed,
                filename
            }) || {};

            processed = refs.content || refs;
            recieveDependencies(refs.dependencies);
        } catch (e) {
            const errorTitle = `File ${filename} compile failed!`;
            logger.warn(errorTitle);
            logger.warn(e);
            notify({
                title: errorTitle,
                msg: e.stack || e
            });
            throw e;
        }
    }

    return processed;
}

function createDependenciesReciever({
    reqPath,
    filename,
    reloaderService,
    resourcesManager
}) {
    return files => {
        if (!files || files.length === 0) {
            files = [];
        }

        files = [filename, ...files];
        reloaderService.register({
            reqPath,
            files,
            resourcesManager
        });
    };
}

function isPathMatched({ publicPath, reqPath }) {
    return pathToRegexp(publicPath).test(reqPath);
}

function reqUrl2FilePath(url = '') {
    return url.replace(/\//g, path.sep);
}

function getSemiFinished({ pipeline, base, reqPath }) {
    const rawReqPath = pipeline.reduceRight(
        function(prev, item) {
            const { toSource = noop } = item;
            const raw = stackTop(prev);
            return [...prev, toSource.call(item, raw)];
        },
        [reqPath]
    );
    return rawReqPath.map(item => reqUrl2FilePath(path.join(base, item)));
}

function stackTop(stack) {
    return stack.slice(-1)[0];
}

exports.dispatcher = dispatcher;
exports.stackTop = stackTop;
exports.workflow = workflow;
exports.isPathMatched = isPathMatched;
exports.reqUrl2FilePath = reqUrl2FilePath;
exports.getSemiFinished = getSemiFinished;
exports.createDependenciesReciever = createDependenciesReciever;
