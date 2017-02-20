import FastFtl from 'fast-ftl';
import path from 'path';

class RenderUtil {
    /**
     * @param  {} {viewRoot}
     */
    constructor({viewRoot}) {
        this.freemarker = FastFtl({
            root: viewRoot
        });
        this.viewRoot = viewRoot;
    }
    /**
     * @param  {} p1
     * @param  {} data
     * @returns Promise
     */
    parse(p1, data) {
        const tpl = path.relative(this.viewRoot, p1);
        return this.freemarker.parse(tpl, data);
    }
}

export default RenderUtil;
