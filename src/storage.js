// storage.js

export default {
  get: function(x) {
    if (typeof localStorage === 'object') { // why bother? I think this has support back to IE8
      return localStorage.getItem(x);
    } else {
      return this[x];
    }
  },
  set: function(x, y) {
    if (typeof localStorage === 'object') {
      localStorage.setItem(x, y);
    } else {
      this[x] = y;
    }
  }
};
