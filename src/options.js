// options.js

import storage from './storage.js';
import colors from './colors.js';

var op = {
  grid: 96 / 1,
  divisions: 8,
  tooltip: "1",
  fractions: "0",
  gridsnap: 1,
  lengthsnap: 1,
  anglesnap: 15,
  endsnap: 1,
  lensnap: 12,
  snap: 12,
  colortheme: 'light',

  change(option, value, sync = true) {
    this[option] = value;
    if (sync) {
      this.sync();
    }
  },

  sync() {
    // recalc dependent values
    this.lensnap = this.grid / this.divisions * this.lengthsnap;
    this.snap = this.grid / this.divisions * this.gridsnap;

    // update dom to match
    document.getElementById("grid").value = Math.round(96 * 100 / this.grid) / 100;
    document.getElementById("divisions").value = this.divisions;
    document.getElementById("tooltip").value = this.tooltip;
    document.getElementById("fractions").value = this.fractions;
    document.getElementById("gridsnap").value = this.gridsnap;
    document.getElementById("lengthsnap").value = this.lengthsnap;
    document.getElementById("anglesnap").value = this.anglesnap;
    document.getElementById("endsnap").value = this.endsnap;
    document.getElementById("colortheme").value = this.colortheme;
    document.body.className = this.colortheme;

    // update canvas colors
    colors.theme(this.colortheme);

    // store in localstorage
    storage.set('options', this);
  }
};

window.addEventListener("load", function() {
  // handle the old theme value
  var current = storage.get('theme');
  if (current) {
    op.change('colortheme', current, false);
    storage.remove('theme');
  }

  // set dark if prefers dark and never changed it before
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches &&
    op.colortheme === 'light'
  ) {
    op.change('colortheme', 'dark', false);
  }

  // get any values from storage
  var stored = storage.get('options');
  if (stored) {
    for (var prop in stored) {
      op.change(prop, stored[prop], false);
    }
  }

  // sync once at the end
  op.sync();
});

export default op;
