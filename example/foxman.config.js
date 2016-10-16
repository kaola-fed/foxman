'use strict';
const path = require('path');
const mcss = require('foxman-mcss');
const autoprefix = require('gulp-autoprefixer');
const routers = [
    {method: 'GET', url: '/index.html', sync: true, filePath: 'page/list'},
    {method: 'GET', url: '/index2.html', sync: false, filePath: 'index'},
    {method: 'GET', url: '/home/:id', sync: true, filePath: 'page/list'},
    {method: 'POST', url: '/wxConfig.html', sync: true, filePath: 'page/wxConfig'}
];
let r = path.resolve;
let alias = {
    r: r(__dirname, 'src', 'main', 'webapp')
};

module.exports = {
    /**
     * 如有需要，填写nei 的kei 然后执行 foxman -u 初始化工程目录。
     **/
    /**
     * task集合(基于gulp文件处理，故所有gulp插件都可用)
     * test -- String or Array<String> 需要进行转换的文件规则
     * handler -- Function 类型，需返回一个数组
     */
    nei: {
        key: 'xxxxxxx'
    },
    preCompilers: [
        {
            test: [r(alias.r, 'src/mcss/**/*.mcss')],
            handler: (dest) => {
                
                return [
                    mcss({
                        "include": [],
                        "exclude": "(\\\\|\\/)_",
                        "format": 1
                    }),
                    autoprefix({
                        browsers: ['Android >= 2.3'],
                        cascade: false
                    }),
                    dest(r(alias.r, 'src/css'))
                ]
            }
        }
    ],
    /**
     * 需要watch的根目录，缺省值为 foxman.config.js 所在目录的所有文件
     */
    // watch: {
    //     root: alias.r
    // },
    /**
     * 代理配置
     * host -- request headers 上携带过去的 Host信息
     * service -- url处理器 foxman -p test 选中 test
     */
    proxy: {
        host: 'm.kaola.com',
        service: {
            /**
             *
             * @param url -- request.url （http://m.kaola.com/(index.html?hello=world)）
             * @returns 完整的请求路径
             */
            test(url){
                let devMark = 'isDev=1000';
                let result = (-1 === url.indexOf('?') ? `?${devMark}` : `&${devMark}`);
                return 'http://m.kaola.com/' + url.replace(/^\//, '') + result;
            }
        }
    },
    /**
     * mock服务器配置
     */
    server: {
        /**
         * 路由表 格式参见 @routers
         */
        routers,
        /**
         * 端口
         */
        port: 9000,
        /**
         * 是否区分方法
         */
        divideMethod: false,
        /**
         * router type 为 sync 的filePath的ftl相对目录
         */
        viewRoot: r(alias.r, 'WEB-INF/template'),
        /**
         * router type 为 sync 的filePath的data相对目录
         */
        syncData: r(__dirname, 'mock/fakeData'),
        /**
         * router type 为 async 的filepath的data相对目录
         */
        asyncData: r(__dirname, 'mock/json'),
        /**
         * 静态资源目录
         */
        static: [
            r(alias.r, 'src'),
            r(alias.r, 'res')
        ]
    }
};
