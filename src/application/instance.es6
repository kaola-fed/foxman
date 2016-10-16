/**
 * Created by hzxujunyu on 2016/9/19.
 */

export default {
    /**
     * plugin的方法，作用是挂起application的加载plugin
     * @param fn
     * @returns {Number}
     */
    pending(fn) {
        let pending = new Promise((resolve) => {
            let result = fn(resolve);
            if( result && result.value && result.value.then ) {
                return result;
            } 
            return new Promise((resolve)=>{
                resolve(result);
            });
        });
        if (this.pendings) {
            return this.pendings.push(pending);
        }
        this.pendings = [pending];
    }
}