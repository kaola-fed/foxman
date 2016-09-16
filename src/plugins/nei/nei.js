'use strict';
import util from 'nei/lib/util/util';
util.checkNodeVersion();

import subMain from './submain';
import Application from 'nei/lib/util/args';

const options = {
    package: require('nei/package.json'),
    message: require('nei/bin/config.js'),
    update: function (event) {
        var action = 'update';
        var config = event.options || {};
        config = this.format(action, config);
        subMain.update(this, action, config);
        /**
         * 往外传递
        */
        subMain.on('updateend', (...args) => { 
          this.emit('updateend',...args); 
        });
    }
};

let nei = new Application(options),
    neiTools = {
      update () {
        nei.exec('update');
        return new Promise((resolve, reject)=>{
          nei.on('updateend', (...args) => {
            resolve(...args);
          });
        });
      }
    }

export default neiTools;
