/* eslint-disable */

(function() {
    var notSupport = document.createElement('div');
    notSupport.style.cssText =
        'position:fixed;top:0;left:0;right:0;background:red;color:white;line-height:30px;text-align:center;';
    notSupport.innerHTML = "Your browser doesn't support WebSocket";
    if (!window.WebSocket) {
        document.body.appendChild(notSupport);
        setTimeout(function() {
            document.body.removeChild(notSupport);
        }, 3000);
        return;
    }

    function createSocket() {
        var socket = new WebSocket(
            (location.protocol === 'https:' ? 'wss:' : 'ws:') +
                '//' +
                location.host
        );
        bindEventSocket(socket);
    }

    function bindEventSocket(socket) {
        socket.onmessage = function(event) {
            var data;
            try {
                data = JSON.parse(event.data);
            } catch (e) {
                data = {};
            }
            var type = data.type || 'default';
            var payload = data.payload || {};
            __FOXMAN_EVENT_BUS__.emit(type, payload);
        };

        socket.onopen = function() {
            console.log('[WebSocket] connected');
        };

        socket.onclose = function() {
            console.log('[WebSocket] closed');
            setTimeout(createSocket, 1000);
        };
    }

    createSocket();
})();
