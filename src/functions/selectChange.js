import drawing from './../drawing.js';

window.addEventListener("load", function () {
  var selects = document.getElementsByTagName("select");
  Array.prototype.forEach.call(selects, selectHandler);
});

function selectHandler(select) {
  select.addEventListener("change", selectChange);
}

export default function selectChange(e) {
  var youClicked = {
    "grid": function () {
      drawing.drawing.grid = 96 / e.target.value;
      drawing.drawing.snap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.gridsnap;
      drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
      drawing.refresh();
    },
    "divisions": function () {
      drawing.drawing.divisions = e.target.value;
      drawing.drawing.snap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.gridsnap;
      drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
      drawing.refresh();
    },
    "gridsnap": function () {
      drawing.drawing.gridsnap = e.target.value;
      drawing.drawing.snap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.gridsnap;
      drawing.refresh();
    },
    "lengthsnap": function () {
      drawing.drawing.lengthsnap = e.target.value;
      drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
      drawing.refresh();
    },
    "anglesnap": function () {
      drawing.drawing.anglesnap = e.target.value;
      drawing.refresh();
    },
    "endsnap": function () {
      drawing.drawing.endsnap = e.target.value;
      drawing.refresh();
    },
    "line_colour": function() {

    },
    "line_width": function() {

    }
  }
  youClicked[e.target.id]();
}