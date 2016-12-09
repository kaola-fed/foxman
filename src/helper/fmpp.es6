import path from 'path';
import Fmpp from '../../lib/node-fmpp';

let renderUtil;
class RenderUtil {
    constructor({viewRoot}) {
        this.freemarker = Fmpp();
        this.viewRoot = viewRoot;
    }
    parse(p1, dataModel) {
        return new Promise((resolve, reject) => {
            this.freemarker(p1,
                Object.assign({
                    fmppConfig: {},
                    settings: {
                        views: this.viewRoot
                    }
                }, {
                    json: dataModel
                }), (error, content) => {
                    resolve({
                        error, content
                    });
                });
        });
    }
}
export default RenderUtil;