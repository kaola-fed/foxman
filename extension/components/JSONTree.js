const JSONTree = Regular.extend({
    template: `
        <div class='json-tree'>
            {#list Object.keys(source) as k}
                <JSONTreeProp path={k} key={k} value={source[k]} />
            {/list}
        </div>
    `,
    config: function() {
        var self = this;

        function onClick(e) {
            self.$emit('checkClickOutside', e.target);
        }
        document.addEventListener('click', onClick, false);
        this.$on('$destroy', function() {
            document.removeEventListener('click', onClick, false);
        });
    },
    isJsonTree() {
        return true;
    }
});

JSONTree.component('JSONTreeProp', JSONTreeProp);
