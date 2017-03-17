/**
 * Created by june on 2017/3/17.
 */
class CommandInterceptor {
    constructor({argv}) {
        this.list = [];
    }

    intercept(argv = this.argv) {
        this.list.some(commandInterceptor => {
            const res = commandInterceptor(argv);
            argv = res.argv;

            // {argv, isContinue = true}
            return res.isContinue;
        });
    }

    add(commandInterceptor) {
        this.list.push(commandInterceptor);
    }
}