const JSONTreeProp = Regular.extend({
    template: `
        <div class='json-tree-data'>
            <div class='json-tree-data-key'>
                <img
                    src="/media/arrow.svg"
                    alt="arrow"
                    class="arrow item {opened ? 'arrow-down' : null} {hasChildren ? '': 'hide'}"
                    on-click={opened = !opened}
                />
                <span class="key item" on-click={opened = !opened}>{key + ':'}</span>
                <span on-dblclick="{ this.onEdit() }">
                {#if !editing}
                    {#if this.isPrimitive(value)}
                        {#if type === 'String'}
                            <span class='item string'>"{value}"</span>
                        {#else}
                            <span class='item primitive'>{value}</span>
                        {/if}
                    {#elseif type === 'Array'}
                        <span class='item others'>Array[{value.length}]</span>
                    {#else}
                        <span class='item others'>{type}</span>
                    {/if}
                {/if}
                <input
                    r-hide="{ !editing }"
                    class="edit"
                    type="text"
                    spellcheck="false"
                    value="{ type === 'String' ? JSON.stringify(value) : value }"
                    on-blur="{ this.onBlur($event) }"
                    on-keyup="{ this.onEnter($event) }"
                    ref="edit"
                >
                </span>
            </div>
            {#if opened && hasChildren}
            <div class='json-tree-data-props' style='padding-left:20px'>
                {#list Object.keys(value) as k}
                    <JSONTreeProp path={path + '.' + k} key={k} value={value[k]} padding={true} />
                {/list}
            </div>
            {/if}
        </div>
    `,
    data: {
        opened: false
    },
    computed: {
        type() {
            return type(this.data.value);
        },
        hasChildren() {
            var data = this.data;
            return ((type(data.value) === 'Array') || (type(data.value) === 'Object')) &&
                ((data.value.length || Object.keys(data.value).length));
        }
    },
    config: function() {
        var self = this;
        this.$parent.$on('checkClickOutside', function(v) {
            if (self.$refs && self.$refs.edit && !self.$refs.edit.contains(v)) {
                self.data.editing = false;
                self.$update();
            }
            self.$emit('checkClickOutside', v);
        });
    },
    onEdit: function() {
        if (this.data.value === 'function') {
            return;
        }
        if (!isPrimitive(this.data.value)) {
            return;
        }
        this.data.editing = true;
        // focus and selectRange after UI updated
        setTimeout(() => {
            // select all when active
            var $edit = this.$refs.edit;
            $edit.focus();
            if (type(this.data.value) === "String") {
                $edit.setSelectionRange(1, $edit.value.length - 1);
            } else {
                $edit.setSelectionRange(0, $edit.value.length);
            }
        }, 0);
    },
    onBlur: function(e) {
        this.data.editing = false;
        this._sync(e);
    },
    onEnter: function(e) {
        // Enter
        if (e.which === 13) {
            this.$refs.edit.blur();
        }
    },
    // when editing is finished
    _sync: function(e) {
        var tmp;
        try {
            tmp = JSON.parse(e.target.value);
        } catch (error) {
            const value = this.data.value;
            if (type(value)) {
                e.target.value = JSON.stringify(value);
            } else {
                e.target.value = value;
            }
        }

        // if not primitive or new value equals original one, return
        if (!isPrimitive(tmp) || tmp === this.data.value) {
            return;
        }

        var parent = this.$parent;
        while (parent) {
            if (isJsonTree(parent)) {
                parent.$emit('change', {
                    path: this.data.path,
                    value: tmp,
                    oldValue: this.data.value
                });
                break;
            }
            parent = parent.$parent;
        }

        function isJsonTree(context) {
            return typeof context.isJsonTree === 'function' && context.isJsonTree() === true;
        }

        this.data.value = tmp;
        this.$update();
    },
    isPrimitive: isPrimitive
});

function isPrimitive(arg) {
    var type = typeof arg;
    return arg === null || (type !== "object" && type !== "function");
}

function type(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

JSONTreeProp.component('JSONTreeProp', JSONTreeProp);
