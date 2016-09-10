(function() {
    var not_support =  document.createElement('div');
    not_support.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:white;line-height:30px;text-align:center;'
    not_support.innerHTML = '您的浏览器不支持livereload';
    if (!window.WebSocket) {
        document.body.appendChild(not_support);
        setTimeout(function() {document.body.removeChild(not_support); } , 3000);
        return;
    }

    function openSocket() {
        try {
            var socket = new WebSocket((location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host);
            bindEventSocket(socket);
        } catch (e) {}
    }

    function bindEventSocket(socket) {
        socket.onmessage = function(event) {
            var filename = event.data;
            if (/\.css$/.test(filename)) {
                updateStyle(filename);
            } else {
                location.reload();
            }
        };

        socket.onopen = function() {
            console.log('[live]:connected');
        }

        socket.onclose = function() {
            console.log('[live]:closed');
            setTimeout(openSocket, 1000);
        };
    }

    function updateStyle(filename) {
        var sheets = document.getElementsByTagName('link');
        var sheet;
        for (var i = 0; i < sheets.length; i++) {
            sheet = sheets[i];
            if (sheet.rel == 'stylesheet' && sheet.href.indexOf(filename) !== -1) {
                if (sheet.href.indexOf('ftlStyleVersion') === -1) {
                    sheet.href += ((sheet.href.indexOf('?') === -1 ? '?' : '&') +  'ftlStyleVersion' + '=' + new Date().getTime());
                } else {
                    sheet.href = sheet.href.replace(/(&|\?)ftlStyleVersion=\d+/, '$1ftlStyleVersion=' + new Date().getTime());
                }
                return;
            }
        };
    }

    openSocket();
})();
