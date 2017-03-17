/**
 * Created by june on 2017/2/21.
 */
import Render from 'fast-ftl';
import {values} from './util';

class RenderUtil {
    /**
     * @property {string} viewRoot
     */
    constructor({
        viewRoot,
        templatePaths = {}
    }) {
        this.freemarker = Render({
            root: viewRoot,
            paths: values(templatePaths) //common 权重高
        });
    }

    /**
     * @param {string} p1
     * @param {object} data
     * @returns {*|!Array}
     */
    parse(p1, data) {
        return this.freemarker.parse(p1, data);
    }
}

export default RenderUtil;