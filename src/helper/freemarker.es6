import Freemarker from 'freemarker';
import path from 'path';

class RenderUtil {
    constructor({viewRoot}) {
        this.freemarker = new Freemarker({
            root: viewRoot
        });
        this.viewRoot = viewRoot;
    }

    parse(p1, data) {
        return new Promise(resolve => {
            this.freemarker.renderFile(p1, data, (error, content) => {
                resolve({
                    error, content
                });
            });
        });
    }
}

export default RenderUtil;
