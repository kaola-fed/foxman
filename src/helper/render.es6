/**
 * Created by june on 2017/2/21.
 */
import FastFtl from 'fast-ftl';
import path from 'path';

class RenderUtil {
    /**
     * @property {string} viewRoot
     */
    constructor({viewRoot}) {
        this.freemarker = FastFtl({
            root: viewRoot
        });
        this.viewRoot = viewRoot;
    }

    /**
     * @param {string} p1
     * @param {object} data
     * @returns {*|!Array}
     */
    parse(p1, data) {
        const tpl = path.relative(this.viewRoot, p1);
        return this.freemarker.parse(tpl, data);
    }
}

export default RenderUtil;