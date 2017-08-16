const path = require('path');
const pathToRegexp = require('path-to-regexp');
const co = require('co');
const { fs, system, encrypt } = require('@foxman/helpers');
const logger = require('./logger');
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
                    pattern: processor.match,
                    reqPath
                })
            ) {
                return yield next;
            }

            if (resourcesManager.has(reqPath)) {
                logger.info(`Served by resourcesManager - ${reqPath}`);

                const ifNoneMatch = this.req.headers['if-none-match'];
                const content = resourcesManager.get(reqPath);
                const eTag = encrypt.md5(content);

                this.type = extname(reqPath);

                if (ifNoneMatch && ifNoneMatch === eTag) {
                    this.status = 304;
                    this.body = '';
                } else {
                    this.status = 200;
                    this.body = content;
                }

                this.set('ETag', eTag);
                return;
            }

            const { pipeline = [], lockTask = false } = processor;
            const processdFilenameStack = getSemiFinished({
                pipeline: [
                    ...pipeline,
                    processor // 从右往左
                ],
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

                this.set('ETag', encrypt.md5(processed));

                logger.success(`Served by processor - ${reqPath}`);

                return processed;
            } catch (e) {
                console.log(e)
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

function isPathMatched({ pattern, reqPath }) {
    return pathToRegexp(pattern).test(reqPath);
}

function reqUrl2FilePath(url = '') {
    return url.replace(/\//g, path.sep);
}

function getSemiFinished({ pipeline, reqPath }) {
    const rawReqPath = pipeline.reduceRight(
        function(prev, item) {
            const { locate = noop } = item;
            const raw = stackTop(prev);
            return [...prev, locate.call(item, raw)];
        },
        [reqPath]
    );
    return rawReqPath.map(item => reqUrl2FilePath(item));
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
