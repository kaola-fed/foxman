class Event{
	constructor(desc, subscriber){
		this.desc = desc;
		this.subscriber = subscriber;
	}
	getDesc(){
		return {
			desc: this.desc,
			subscriber: this.subscriber
		}
	}
}
export default Event;