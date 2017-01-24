import FastFtl from 'fast-ftl';
import path from 'path';

class RenderUtil {
    constructor({viewRoot}) {
        this.freemarker = FastFtl({
            root: viewRoot
        });
        this.viewRoot = viewRoot;
    }

    parse(p1, data) {
        const tpl = path.relative(this.viewRoot, p1);
        return this.freemarker.parse(tpl, data);
    }
}

export default RenderUtil;
