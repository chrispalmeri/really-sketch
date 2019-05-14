import help from './../help.js';
import interaction from './../interaction.js';
import snap from './../snap.js';
import canvas from './../canvas.js';
import drawing from './../drawing.js';
import mouse from './../mouse.js';
import tool from './../tool.js';

export default function Line() {
  help(interaction.text + " to set new line start point");

  this.points = 0;
  this.coords = {};
  this.coords.type = "line";

  this.click = function(x, y) {
    this.points = this.points + 1;
    if(this.points === 1) {
      help(interaction.text + " to set line end point");
    } else if(this.points === 2) {
      this.save();
      this.reset();
    }
  };

  this.reset = function() {
    tool.a = new Line();
    drawing.refresh();
    tool.a.move(mouse.x, mouse.y);
  };

  this.move = function(x, y) {
    var snapped;
    if(this.points === 0) {
      snapped = snap(x, y);
      this.coords.x = snapped.x;
      this.coords.y = snapped.y;
    } else if(this.points === 1) {
      snapped = snap(x, y, this.coords.x, this.coords.y);
      
      this.coords.u = snapped.x;
      this.coords.v = snapped.y;
      canvas.f.beginPath();
      canvas.f.moveTo(this.coords.x, this.coords.y);
      canvas.f.lineTo(this.coords.u, this.coords.v);
      canvas.f.stroke();
    }
    canvas.f.beginPath();
    canvas.f.arc(snapped.x, snapped.y, 2.5, 0, 2 * Math.PI, true);
    canvas.f.fill();
  };

  this.save = function() {
    this.coords.colour = document.getElementById('line_colour').value;
    this.coords.width = document.getElementById('line_width').value;
    drawing.drawing.objects.push(this.coords);
    drawing.drawing.points.push([this.coords.x, this.coords.y]);
    drawing.drawing.points.push([this.coords.u, this.coords.v]);
    mouse.hide();
  };
}