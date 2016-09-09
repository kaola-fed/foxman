"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 通用事件模型
 * source -- 事件源
 * data   -- 数据
 */
var Event = function Event(source, data) {
  _classCallCheck(this, Event);

  this.source = source;
  this.data = data;
};

exports.default = Event;