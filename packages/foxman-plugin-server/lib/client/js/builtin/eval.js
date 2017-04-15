(function() {
    var __FOXMAN_EVENT_BUS__ = window.__FOXMAN_EVENT_BUS__;

    __FOXMAN_EVENT_BUS__.on('eval', function(code) {
        eval(code);
    });
})();
