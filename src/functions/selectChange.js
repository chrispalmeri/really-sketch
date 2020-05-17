// functions/selectChange.js

import drawing from './../drawing.js';
import colors from './../colors.js';
import options from './../options.js';

window.addEventListener("load", function() {
  var selects = document.getElementById('options').getElementsByTagName("select");
  Array.prototype.forEach.call(selects, selectHandler);
});

function selectHandler(select) {
  select.addEventListener("change", selectChange);
}

export default function selectChange(e) {
  var youClicked = {
    "colortheme": function() {
      colors.theme(e.target.value);
      //options.change('colortheme', e.target.value);
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
  youClicked[e.target.id]();
}
