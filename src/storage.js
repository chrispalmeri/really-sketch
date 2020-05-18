// storage.js

export default {
  get(x) {
    if (typeof localStorage === 'object') { // why bother? I think this has support back to IE8
      var raw = localStorage.getItem(x);
      var output = null;
      try {
        output = JSON.parse(raw);
      } catch (e) {
        output = raw;
      }
      return output;
    } else {
      return this[x];
    }
  },
  set(x, y) {
    if (typeof y !== 'string') {
      y = JSON.stringify(y);
    }
    if (typeof localStorage === 'object') {
      localStorage.setItem(x, y);
    } else {
      this[x] = y;
    }
  },
  remove(x) {
    if (typeof localStorage === 'object') {
      localStorage.removeItem(x);
    } else {
      delete this[x];
    }
  }
};
