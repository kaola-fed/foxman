'use strict';
const subMain = require( './submain' );
const Application = require( 'nei/lib/util/args' );
const { fileUtil } = require( '../../helper' );

const options = {
    package: require('nei/package.json'),
    message: require('nei/bin/config.js'),
    build(event) {
        var action = 'build';
        var config = event.options || {};
        config = this.format(action, config);
        config.key = event.options.key;

        if (!config.key) {
            this.log('错误: 缺少项目的唯一标识 key, 请到 NEI 网站上的相应项目的"工具设置"中查看该 key 值');
            this.show(action);
        } else {
            subMain.build(this, action, config);
            subMain.on('buildSuccess', (arg0) => {
                this.emit('buildSuccess', arg0);
            });
        }
    },
    update(event) {
        var action = 'update';
        var config = event.options || {};
        config = this.format(action, config);
        subMain.update(this, action, config);
        subMain.on('buildSuccess', (arg0) => {
            this.emit('buildSuccess', arg0);
        });
    }
};

const nei = new Application(options);
const neiTools = {
        build(opt) {
            nei.exec(['build -key', opt.key, '-basedir', opt.basedir]);
        },
        update(opt) {
            nei.exec(['update -basedir', opt.basedir]);
        },
        run(opt) {
            try {
                fileUtil.delDir(opt.basedir);
            } catch (e) {
                // console.log(e);
            }

            this.build(opt);

            return new Promise(resolve => {
                nei.on('buildSuccess', v => resolve(v));
            });
        }
    };

module.exports = neiTools;
