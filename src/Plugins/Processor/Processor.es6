import path from 'path';
import pathToRegexp from 'path-to-regexp';
import {fileUtil, util} from '../../helper';
 
const {getFileStat, readFile} = fileUtil;
const {warnLog} = util;

function noop(p) { return p;}
export function dispatcher ({processors}) {
    return function (ctx) {
        return function*(next) {
            const request = this.request;
            const [processor] = processors.filter(processor => {
                return (pathToRegexp(processor.publicPath).test(this.request.path));
            });

            if (!processor) {
                return yield next;
            }

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

            this.body = yield workflow({raw, pipeline, semiFinishedStack})
        };
    }
}

function * workflow ({
    raw, pipeline, semiFinishedStack
}) {
    let processed = raw;
    for (let item of pipeline) {
        const {handler} = item;
        try {
            processed = yield new Promise((resolve, reject) => {
                handler.call(item, {
                    raw: processed, resolve, reject,
                    filename: semiFinishedStack.pop()
                });
            });
        } catch (e) {
            warnLog(e); 
        }
    }
    return processed;
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