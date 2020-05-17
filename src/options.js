// options.js

var op = {
  name: 'Drawing',
  grid: 96 / 1,
  divisions: 8,
  tooltip: "1",
  fractions: "0",
  gridsnap: 1,
  lengthsnap: 1,
  anglesnap: 15,
  endsnap: 1,
  //colortheme: 'light',

  lensnap: 12,
  snap: 12,

  change(option, value) {
    this[option] = value;
    this.sync();

    // update storage
  },

  sync() {
    this.lensnap = this.grid / this.divisions * this.lengthsnap;
    this.snap = this.grid / this.divisions * this.gridsnap;

    document.getElementById("name").value = this.name;
    document.getElementById("grid").value = Math.round(96 * 100 / this.grid) / 100;
    document.getElementById("divisions").value = this.divisions;
    document.getElementById("tooltip").value = this.tooltip;
    document.getElementById("fractions").value = this.fractions;
    document.getElementById("gridsnap").value = this.gridsnap;
    document.getElementById("lengthsnap").value = this.lengthsnap;
    document.getElementById("anglesnap").value = this.anglesnap;
    document.getElementById("endsnap").value = this.endsnap;
    //document.getElementById("colortheme").value = this.colortheme;
  }
};

window.addEventListener("load", function() {
  op.sync();

  document.getElementById("name").addEventListener("change", e => {
    var desired = e.target.value.replace(/[^a-z0-9_\-\s.'()]/gi, '');
    if (desired === "") {
      desired = "Drawing";
    }
    op.change('name', desired);
  });
});

export default op;
