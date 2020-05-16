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
      tool.a = new Line();
    },
    "arc-button": function() {
      tool.a = new Arc();
    },
    "text-button": function() {
      tool.a = new Text();
    },
    "eraser-button": function() {
      tool.a = new Eraser();
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
    "info": function() {
      // var dpi = "<table><tr><td width=\"60%\">Window Width:</td><td>" + document.body.clientWidth;
      // dpi += "</td></tr><tr><td>Device Pixel Ratio:</td><td>" + window.devicePixelRatio;
      // dpi += "</td></tr><tr><td>Touch Screen:</td><td>" + interaction.touch;
      // dpi += "</td></tr></table>";
      // document.getElementById("dpi").innerHTML = dpi;

      document.getElementById("drawingOptions").style.display = 'none';
      document.getElementById("appInfo").style.display = 'block';
    },
    "ok": function() {
      document.getElementById("appInfo").style.display = 'none';
    },
    "clear": function() {
      drawing.clear();
    },
    "save": function() {
      drawing.save();
    },
    "export": function() {
      drawing.xport();
    },
    "import": function() {
      drawing.import();
    }
  };
  youClicked[e.currentTarget.id]();
}
