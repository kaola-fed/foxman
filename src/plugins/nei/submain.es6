import main from 'nei/main';
import Builder from 'nei/lib/nei/builder';
import EventEmitter from 'events';
import _fs from 'nei/lib/util/file';
import fs from 'fs';
import path from 'path';
import _util from 'nei/lib/util/util';
import {logger} from 'nei//lib/util/logger';

let subMain = main;
Object.assign(subMain, EventEmitter.prototype);
/**
 * 构建项目
 * @param arg
 * @param action
 * @param args
 */
subMain.build = function (arg, action, args) {
    this.args = args;
    this.config = {
        action: action
    };
    /**
     * 项目nei根路径
     * @type {string}
     */
    this.config.outputRoot = args.basedir;
    this.checkConfig();
    let loadedHandler = (ds) => {
        this.config.pid = ds.project.id;
        this.ds = ds;
        this.fillArgs();
        // 合并完参数后, 需要重新 format 一下, 并且此时需要取默认值
        this.args = arg.format(this.config.action, this.args, true);
        this.config.neiConfigRoot = path.resolve(this.config.outputRoot, `nei.${this.config.pid}.${this.args.key}`) + '/';
        new Builder({
            config: this.config,
            args: this.args,
            ds: this.ds
        });
        this.emit('buildSuccess', this.config);
    };
    this.loadData(loadedHandler);
};
/**
 * 更新 nei 工程规范
 * @param  {object}  arg - 参数类的实例
 * @param  {string}  action - 操作命令
 * @param  {object}  args - 命令行参数对象
 */
subMain.update = function (arg, action, args) {
    let dir = args.basedir;
    let projects = this.findProjects(args);
    let buildProject = (neiProjectDir, exitIfNotExist) => {
        let config = _util.file2json(`${neiProjectDir}/nei.json`, exitIfNotExist);
        let mergedArgs = Object.assign({}, config.args, args);
        this.build(arg, action, mergedArgs);
    };
    if (args.key) {
        if (projects.length == 0) {
            logger.error(`在 ${dir} 中找不到 key 为 ${args.key} 的项目, 请检查`);
            return process.exit(1);
        } else if (projects.length > 1) {
            logger.error(`存在多个 key 为 ${args.key} 的项目, 请检查`);
            return process.exit(1);
        } else {
            buildProject(projects[0], true);
        }
    } else {
        if (projects.length > 1) {
            if (!args.all) {
                logger.error('存在多个 nei 项目, 请通过 key 参数指定需要更新的项目, 或者使用 --all 参数更新所有项目');
                return process.exit(1);
            } else {
                projects.forEach(buildProject);
            }
        } else {
            buildProject(projects[0], true);
        }
    }
};

subMain.findProjects = function (args) {
    let dir = args.basedir;
    if (!_fs.exist(dir)) {
        // 目录不存在, 退出程序
        logger.error(`项目目录 ${dir} 不存在, 请检查`);
        return process.exit(1);
    }
    let files = fs.readdirSync(dir);
    let projects = [];
    files.forEach((file) => {
        if (args.key) {
            if (file.startsWith('nei') && file.endsWith(args.key)) {
                projects.push(`${dir}/${file}`);
            }
        } else if (file.startsWith('nei') && file.length >= 42) {
            // 疑是 nei 项目, 42 是 nei 配置文件的长度, 考虑到项目有可能会超过 5 位, 这里使用 >=
            projects.push(`${dir}/${file}`);
        }
    });
    return projects;
};

export default subMain;
