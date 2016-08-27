import Nei from 'nei';

module.exports = function (config) {
	if( config.isUpdate && config.neiPid){
		Nei.build({id: config.neiPid});
	}
}