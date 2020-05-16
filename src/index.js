// index.js

import drawing from './drawing.js';
import tool from './tool.js';
import mouse from './mouse.js';

// hmm, need them to execute but not using after that
import buttonClick from './functions/buttonClick.js';
import dialogClick from './functions/dialogClick.js';
import linkClick from './functions/linkClick.js';
import selectChange from './functions/selectChange.js';

import Line from './actions/line.js';

window.addEventListener("load", function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/worker.js');
  }

  document.getElementById("file-link").className = "active";
  document.getElementById("file").className = "active";

  document.getElementById("dynamic").setAttribute("href", "mail" + decodeURIComponent("to" + ":" + "chrispalmeri" + "%40%67%6d%61%69") + "l.com");

  mouse.load();

  tool.a = new Line();
  drawing.refresh();
});

window.addEventListener("resize", function() {
  drawing.refresh();
});

window.addEventListener("keydown", function(e) {
  var elem = e.target.tagName.toLowerCase();
  // anything not on a text input
  if (elem !== 'input' && elem !== 'select') {
    if (e.ctrlKey && e.keyCode === 90) {
      drawing.undo();
    }
    if (e.keyCode === 27) {
      tool.a.reset();
      // also make sure options closes
      document.getElementById("options").style.display = "none";
    }
    if (e.shiftKey && e.keyCode === 191) {
      var old = document.getElementsByClassName("active");
      var i;
      for (i = old.length; i > 0; i--) {
        old[i - 1].className = "";
      }
      document.getElementById("shortcuts-link").className = "active";
      document.getElementById("shortcuts").className = "active";
      document.getElementById("options").style.display = "block";
    }
  }
});
