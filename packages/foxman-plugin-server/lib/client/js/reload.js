/* eslint-disable */

(function() {
    var __FOXMAN_EVENT_BUS__ = window.__FOXMAN_EVENT_BUS__;

    __FOXMAN_EVENT_BUS__.on('livereload', function(filename) {
        if (/\.css/.test(filename)) {
            updateStyle(filename);
        } else {
            location.reload();
        }
    });

    function updateStyle(filename) {
        var sheets = document.getElementsByTagName('link');
        var sheet;
        for (var i = 0; i < sheets.length; i++) {
            sheet = sheets[i];

            if (
                sheet.rel == 'stylesheet' && sheet.href.indexOf(filename) !== -1
            ) {
                if (sheet.href.indexOf('styleVersion') === -1) {
                    sheet.href += (sheet.href.indexOf('?') === -1 ? '?' : '&') +
                        'styleVersion' +
                        '=' +
                        new Date().getTime();
                } else {
                    sheet.href = sheet.href.replace(
                        /styleVersion=\d+/,
                        'styleVersion=' + new Date().getTime()
                    );
                }
                return;
            }
        }
    }
})();
