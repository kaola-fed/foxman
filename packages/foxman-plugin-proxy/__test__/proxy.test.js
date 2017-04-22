const doProxy = require('../lib/proxy');

doProxy.call(
    {
        request: {
            url: '1'
        }
    }, { 
        proxy, 
        service: url => {
            return url;
        } 
    })