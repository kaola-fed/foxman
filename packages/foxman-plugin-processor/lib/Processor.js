const path = require('path');
const pathToRegexp = require('path-to-regexp');
const {fileUtil, util} = require('@foxman/helpers');
const ResourcesManager = require('./ResourcesManager');
const TaskLock = require('@foxman/helpers/lib/TaskLock');
const co = require('co');

exports.dispatcher = dispatcher;

const extname = path.extname;

const {getFileStat, readFile} = fileUtil;
const {log, warnLog, notify} = util;

function noop(p) {
    return p;
}

function dispatcher(
    {
        processors,
        reloaderService
    }
) {
    const resourcesManager = new ResourcesManager();
    const taskLock = new TaskLock();
    return function() {
        return function*(next) {
            const reqPath = this.request.path;
            const processor = matchProcessor({processors, reqPath});

            if (!processor) {
                return yield next;
            }

            if (resourcesManager.has(reqPath)) {
                this.body = resourcesManager.get(reqPath);
                this.type = extname(reqPath);
                return false;
            }

            const {pipeline = [], lockTask = false} = processor;
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
                yield getFileStat(sourceFile);
                raw = yield readFile(sourceFile);
            } catch (e) {
                warnLog(e);
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

                resourcesManager.set({reqPath, processed});
                this.body = processed;
                this.type = extname(reqPath);

                log(`Served by processor - ${reqPath}`);
            } catch (e) {
                return yield next;
            }
        };
    };
}

function* workflow(
    {
        raw,
        processdFilenameStack,
        reqPath,
        pipeline,
        resourcesManager,
        reloaderService
    }
) {
    let processed = raw;
    for (let item of pipeline) {
        const {handler} = item;
        const filename = processdFilenameStack.pop();
        try {
            processed = yield new Promise((resolve, reject) => {
                handler.call(item, {
                    raw: processed,
                    filename,
                    resolve,
                    reject,
                    updateDependencies: updateDependencies({
                        filename,
                        reqPath,
                        reloaderService,
                        resourcesManager
                    })
                });
            });
        } catch (e) {
            const errorTitle = `File ${filename} compile failed!`;
            warnLog(errorTitle);
            warnLog(e);
            notify({
                title: errorTitle,
                msg: e.stack || e
            });
            throw e;
        }
    }

    return processed;
}

function matchProcessor(
    {
        processors,
        reqPath
    }
) {
    const [processor] = processors.filter(processor => {
        return pathToRegexp(processor.publicPath).test(reqPath);
    });
    return processor;
}

function updateDependencies({reqPath, reloaderService, resourcesManager}) {
    return function(dependencies) {
        reloaderService.register({
            reqPath,
            dependencies,
            resourcesManager
        });
    };
}

function combineBase({base, rawPath}) {
    return path.join(base, rawPath);
}

function reqUrl2FilePath(url) {
    return path.join(...url.split('/'));
}

function getSemiFinished(
    {
        pipeline,
        base,
        reqPath
    }
) {
    const rawPath = reqUrl2FilePath(reqPath);

    const targetFile = combineBase({
        base,
        rawPath
    });

    return pipeline.reduceRight(
        function(prev, item) {
            const {toSource = noop} = item;
            const raw = stackTop(prev);
            return [...prev, toSource.call(item, raw)];
        },
        [targetFile]
    );
}

function stackTop(stack) {
    return stack.slice(-1)[0];
}
