;(function () {
    /**
     * Fake localStorage implementation.
     *
     * Mimics localStorage, including events.
     * It will work just like localStorage, except for the persistent storage part.
     */
    var localStorageFallback = function () {
        /**
         * Fake local storage
         *
         * @type {object}
         */
        var fakeLocalStorage = {};

        /**
         * Storage
         *
         * @type {object}
         */
        var storage;

        /*
         * If Storage exists we modify it to write to our fakeLocalStorage object instead.
         * If Storage does not exist we create an empty object.
         * */
        if (window.Storage && window.localStorage) {
            storage = window.Storage.prototype;
        } else {
            // We don't bother implementing a fake Storage object
            window.localStorage = {};
            storage = window.localStorage;
        }

        // For older IE
        if (!window.location.origin) {
            window.location.origin =
                window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }

        /**
         * Dispatch storage event
         *
         * @param {string} key
         * @param {string} newValue
         */
        var dispatchStorageEvent = function (key, newValue) {
            var oldValue = (key == null) ? null : storage.getItem(key); // `==` to match both null and undefined
            var url = location.href.substr(location.origin.length);
            var storageEvent = document.createEvent('StorageEvent'); // For IE

            storageEvent.initStorageEvent('storage', false, false, key, oldValue, newValue, url, null);
            window.dispatchEvent(storageEvent);
        };

        /**
         * LocalStorage key fake
         *
         * @param {string} i
         * @returns {*}
         */
        storage.key = function (i) {
            var key = Object.keys(fakeLocalStorage)[i];
            return typeof key === 'string' ? key : null;
        };

        /**
         * Fake local storage getItem method
         *
         * @param {string} key
         * @returns {string||null}
         */
        storage.getItem = function (key) {
            return typeof fakeLocalStorage[key] === 'string' ? fakeLocalStorage[key] : null;
        };

        /**
         * Fake local storage setItem method
         *
         * @param {string} key
         * @param {string} value
         */
        storage.setItem = function (key, value) {
            dispatchStorageEvent(key, value);
            fakeLocalStorage[key] = String(value);
        };

        /**
         * Fake local storage removeItem method
         *
         * @param {string} key
         */
        storage.removeItem = function (key) {
            dispatchStorageEvent(key, null);
            delete fakeLocalStorage[key];
        };

        /**
         * Fake local storage clear method
         */
        storage.clear = function () {
            dispatchStorageEvent(null, null);
            fakeLocalStorage = {};
        };
    };

    /**
     * Fire fallback if local storage not implemented or Safari Private Tab used
     */
    if (typeof window.localStorage === 'object') {
        // Safari will throw a fit if we try to use localStorage.setItem in private browsing mode.
        try {
            localStorage.setItem('localStorageTest', 1);
            localStorage.removeItem('localStorageTest');
        } catch (e) {
            localStorageFallback();
        }
    } else {
        localStorageFallback();
    }
})();