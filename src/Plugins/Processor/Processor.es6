import path from 'path';
import pathToRegexp from 'path-to-regexp';
import {fileUtil, util} from '../../helper';
import ReloaderService from './ReloaderService';

const {getFileStat, readFile} = fileUtil;
const {warnLog} = util;
let reloaderService;

function noop(p) { return p;}

export function dispatcher ({processors}) {
    reloaderService = ReloaderService();

    return function (ctx) {
        return function*(next) {
            const request = this.request;
            const [processor] = processors.filter(processor => {
                return (pathToRegexp(processor.publicPath).test(this.request.path));
            });

            if (!processor) {
                return yield next;
            }
            const reqPath = this.request.path;
            const rawPath = reqUrl2FilePath(this.request.path);
            const targetFile = combineBase({
                base: processor.base,
                rawPath: rawPath 
            });
            const {pipeline = []} = processor;
            const semiFinishedStack = getSemiFinished({
                pipeline: [
                    ...pipeline, processor // 从右往左
                ], 
                targetFile
            });
            const sourceFile = stackTop(semiFinishedStack);
            let raw;
            try {
                const stats = yield getFileStat(sourceFile);
                raw = yield readFile(sourceFile);
            } catch (e) {
                warnLog(e);
                return yield next;
            }

            this.body = yield workflow({
                raw, semiFinishedStack, reqPath,
                pipeline
            })
        };
    }
}

function * workflow ({
    raw, semiFinishedStack, reqPath,
    pipeline
}) {
    let processed = raw;
    
    for (let item of pipeline) {
        const {handler} = item;
        const filename = semiFinishedStack.pop();
        try {
            processed = yield new Promise((resolve, reject) => {
                handler.call(item, {
                    raw: processed, filename,
                    resolve: resolveWrapper({
                        resolve, 
                        filename, reqPath
                    }), reject
                });
            });
        } catch (e) {
            warnLog(e); 
        }
    }

    return processed;
}

function resolveWrapper({
    resolve,
    filename, reqPath
}) {
    return function ({
        processed, dependencies = []
    }) {
        const map = {
            reqPath: reqPath,
            dependencies: [...dependencies, filename]
        };
        reloaderService.register(map);
        resolve(processed);
    }
}

function combineBase({base, rawPath}) {
    return path.join(base, rawPath);
}

function reqUrl2FilePath(url) {
    return path.join(... url.split('/'));
}

function getSemiFinished({
    pipeline,
    targetFile
}) {
    return pipeline.reduceRight(function(prev, item) {
        const {toSource = noop} = item;
        const raw = stackTop(prev);
        return [...prev, toSource.call(item, raw)];
    }, [targetFile]);
}

function stackTop(stack) {
    return stack.slice(-1)[0];
}