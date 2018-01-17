;(function() {
  var Storage = function() {
    this.length = 0;

    // For older IE
    if (!window.location.origin) {
      window.location.origin =
        window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
  };

  Storage.prototype.storage = {};

  /**
   * Dispatch storage event
   *
   * @param {string} key
   * @param {string} newValue
   */
  Storage.prototype.dispatchStorageEvent = function(key, newValue) {
    var oldValue = (!key) ? null : this.getItem(key); // `==` to match both null and undefined
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
  Storage.prototype.key = function(i) {
    var key = Object.keys(this.storage)[i];
    return typeof key === 'string' ? key : null;
  };

  /**
   * Fake local storage getItem method
   *
   * @param {string} key
   * @returns {string||null}
   */
  Storage.prototype.getItem = function(key) {
    return typeof this.storage[key] === 'string' ? this.storage[key] : null;
  };

  /**
   * Fake local storage setItem method
   *
   * @param {string} key
   * @param {string} value
   */
  Storage.prototype.setItem = function(key, value) {
    this.dispatchStorageEvent(key, value);
    this.storage[key] = String(value);
    this.calcLength();
  };

  /**
   * Fake local storage removeItem method
   *
   * @param {string} key
   */
  Storage.prototype.removeItem = function(key) {
    this.dispatchStorageEvent(key, null);
    delete this.storage[key];
    this.calcLength();
  };

  /**
   * Fake local storage clear method
   */
  Storage.prototype.clear = function() {
    this.dispatchStorageEvent(null, null);
    this.storage = {};
    this.calcLength();
  };

  /**
   * Calculate length of localStorage
   * @returns {number}
   */
  Storage.prototype.calcLength = function() {
    var length = 0, key;
    for (key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {
        length++;
      }
    }
    this.length = length;
  };

  /**
   * Fire fallback if local storage not implemented or Safari Private Tab used
   */
  if (typeof window.localStorage === 'object') {
    // Safari will throw a fit if we try to use localStorage.setItem in private browsing mode.
    try {
      localStorage.setItem('local-storage-fallback-test', 1);
      localStorage.removeItem('local-storage-fallback-test');
    } catch (e) {
      window.localStorage = new Storage();
    }
  } else {
    window.localStorage = new Storage();
  }

  /**
   * Fire fallback if session storage not implemented or Safari Private Tab used
   */
  if (typeof window.sessionStorage === 'object') {
    // Safari will throw a fit if we try to use localStorage.setItem in private browsing mode.
    try {
      sessionStorage.setItem('local-storage-fallback-test', 1);
      sessionStorage.removeItem('local-storage-fallback-test');
    } catch (e) {
      window.sessionStorage = new Storage();
    }
  } else {
    window.sessionStorage = new Storage();
  }
})();
