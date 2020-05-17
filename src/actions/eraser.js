// actions/eraser.js

import help from './../help.js';
import interaction from './../interaction.js';
import canvas from './../canvas.js';
import drawing from './../drawing.js';
import mouse from './../mouse.js';
import tool from './../tool.js';
import options from './../options.js';

export default function Eraser() {
  help(interaction.text + " to position eraser");

  this.points = 0;
  this.coords = {};
  this.coords.type = "eraser";

  this.click = function(x, y) {
    this.save();
    this.reset();
  };

  this.reset = function() {
    tool.change(new Eraser());
    drawing.refresh();
    tool.move(mouse.x, mouse.y);
  };

  this.move = function(x, y) {
    if (this.points === 0) {
      this.coords.x = x;
      this.coords.y = y;
      if (options.snap === 0) {
        this.coords.r = 16;
      } else {
        this.coords.r = options.snap - 1;
      }

      canvas.f.beginPath();
      canvas.f.arc(this.coords.x, this.coords.y, this.coords.r, 0, 2 * Math.PI, true);
      canvas.f.stroke();
    }
    canvas.f.beginPath();
    canvas.f.arc(x, y, 2.5, 0, 2 * Math.PI, true);
    canvas.f.fill();
  };

  this.save = function() {
    drawing.drawing.objects.push(this.coords);
    mouse.hide();
  };
}
