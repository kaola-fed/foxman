/**
 * 通用事件模型
 * source -- 事件源
 * data   -- 数据
 */
class Event {
	constructor(source, data){
		this.source = source;
		this.data = data;
	}
}
export default Event;
