"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.error = error;
/**
 * Created by hzxujunyu on 2016/8/15.
 */
function error(msg) {
    console.log("Error:\n \n        " + msg + "\n    ");
    process.exit(1);
}