module.exports = function setHtmlAppender({app, ifAppendHtmls}) {
    let html;
    app.use(function*(next) {
        if (/text\/html/ig.test(this.type)) {
            html = ifAppendHtmls.map((item) => {
                return item.condition(this.request) ? item.html : '';
            }).join('');
            this.body = this.body + html;
        }
        yield next;
    });
};
