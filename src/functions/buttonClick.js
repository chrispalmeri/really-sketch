// functions/buttonClick.js

import tool from './../tool.js';
import { Line, Arc, Text, Eraser } from './../actions/index.js';
import drawing from './../drawing.js';

window.addEventListener("load", function() {
  var buttons = document.getElementsByTagName("button");
  Array.prototype.forEach.call(buttons, buttonHandler);
});

function buttonHandler(button) {
  button.addEventListener("click", buttonClick);
}

export default function buttonClick(e) {
  var youClicked = {
    "line-button": function() {
      tool.change(new Line());
    },
    "arc-button": function() {
      tool.change(new Arc());
    },
    "text-button": function() {
      tool.change(new Text());
    },
    "eraser-button": function() {
      tool.change(new Eraser());
    },
    "undo-button": function() {
      drawing.undo();
    },
    "options-button": function() {
      document.getElementById("options").style.display = "block";
    },
    "options-close": function() {
      document.getElementById("options").style.display = "none";
    },
    "save": function() {
      drawing.save();
    },
    "export": function() {
      drawing.xport();
    },
    "import": function() {
      drawing.import();
    },
    "clear": function() {
      drawing.clear();
    }
  };

  youClicked[e.currentTarget.id]();
}
