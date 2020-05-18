// functions/selectChange.js

import drawing from './../drawing.js';
import options from './../options.js';

window.addEventListener("load", function() {
  var selects = document.getElementById('options').getElementsByTagName("select");
  Array.prototype.forEach.call(selects, selectHandler);

  // this maybe should go in drawing, but it is a class so not sure how
  document.getElementById("name").addEventListener("change", e => {
    var desired = e.target.value.replace(/[^a-z0-9_\-\s.'()]/gi, '');
    if (desired === "") {
      desired = "Drawing";
    }
    drawing.drawing.name = desired;
    document.getElementById("name").value = desired;
  });
});

function selectHandler(select) {
  select.addEventListener("change", selectChange);
}

export default function selectChange(e) {
  var youChanged = {
    "colortheme": function() {
      options.change('colortheme', e.target.value);
      drawing.refresh();
    },
    "grid": function() {
      options.change('grid', 96 / e.target.value);
      drawing.refresh();
    },
    "divisions": function() {
      options.change('divisions', e.target.value);
      drawing.refresh();
    },
    "tooltip": function() {
      options.change('tooltip', e.target.value);
    },
    "fractions": function() {
      options.change('fractions', e.target.value);
    },
    "gridsnap": function() {
      options.change('gridsnap', e.target.value);
    },
    "lengthsnap": function() {
      options.change('lengthsnap', e.target.value);
    },
    "anglesnap": function() {
      options.change('anglesnap', e.target.value);
    },
    "endsnap": function() {
      options.change('endsnap', e.target.value);
    }
  };

  youChanged[e.target.id]();
}
