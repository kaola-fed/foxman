import path from 'path';
import pathToRegexp from 'path-to-regexp';
// import send from 'koa-send';
import {fileUtil, util} from '../../helper';
 
const {getFileStat, readFile} = fileUtil;
const {warnLog} = util;

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
            const {pipeline = []} = processor;
            const semiFinished = pipeline.reverse().reduce(function(prev, {toSource}) {
                if (!toSource) {
                    return prev;
                }

                return toSource(prev);
            }, rawPath);

            const relativePath = processor.toSource(rawPath);
            const sourceFile = combineBase({
                base: processor.base,
                relativePath
            });

            let raw;
            try {
                const stats = yield getFileStat(sourceFile);
                raw = yield readFile(sourceFile);
            } catch (e) {
                warnLog(e);
                return yield next;
            }

            let rawed = raw, handler;
            for (let {handler} of pipeline) {
                try {
                    rawed = yield new Promise((resolve, reject) => {
                        handler(rawed, resolve);
                    });
                } catch (e) {
                    warnLog(e); 
                }
            }

            this.body = rawed;
        };
    }
}

function combineBase({base, relativePath}) {
    return path.join(base, relativePath);
}

function reqUrl2FilePath(url) {
    return path.join(... url.split('/'));
}