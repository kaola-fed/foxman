module.exports = function() {
    const stash = {};
    return {
        $: stash,
        all() {
            return stash;
        },
        register(name, stuff) {
            stash[name] = stuff;
        },
        unregister(name) {
            delete stash[name];
        },
        lookup(name) {
            return stash[name];
        }
    };
};
