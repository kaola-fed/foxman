/**
 * Created by hzxujunyu on 2016/9/21.
 */
import contentType from 'content-type';
import getRawBody from 'raw-body';

export default () =>{
    return function * (next) {
        if(this.request.method.toUpperCase() == 'GET'){
            this.request.body = new Buffer('');
            return yield next;
        }
        this.request.body = yield getRawBody(this.req, {
            length: this.req.headers['content-length'],
            limit: '1mb',
            encoding: contentType.parse(this.req).parameters.charset
        });
        yield next;
    }
}