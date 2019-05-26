import help from './../help.js';
import interaction from './../interaction.js';
import snap from './../snap.js';
import canvas from './../canvas.js';
import drawing from './../drawing.js';
import mouse from './../mouse.js';
import tool from './../tool.js';

export default function Arc() {
  help(interaction.text + " to set new arc center point");

  this.points = 0;
  this.coords = {};
  this.coords.type = "arc";

  this.click = function(x, y) {
    this.points = this.points + 1;
    if(this.points === 1) {
      help(interaction.text + " to set arc radius and start angle");
    } else if(this.points === 2) {
      help(interaction.text + " to set arc end angle");
    } else if(this.points === 3) {
      this.save();
      this.reset();
    }
  };

  this.reset = function() {
    tool.a = new Arc();
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
      
      this.coords.a = Math.atan2((snapped.y - this.coords.y), (snapped.x - this.coords.x));
      this.coords.r = Math.round(Math.sqrt(Math.pow(snapped.x - this.coords.x, 2) + Math.pow(snapped.y - this.coords.y, 2)) * 1000)/1000;
      canvas.f.beginPath();
      canvas.f.arc(this.coords.x, this.coords.y, this.coords.r, 0, 2 * Math.PI, true);
      canvas.f.moveTo(this.coords.x, this.coords.y);
      canvas.f.lineTo(snapped.x, snapped.y);
      canvas.f.stroke();
      
    } else if(this.points === 2) {
      snapped = snap(x, y, this.coords.x, this.coords.y);
      
      this.coords.b = Math.atan2((snapped.y - this.coords.y), (snapped.x - this.coords.x));
      if(this.coords.b === this.coords.a) {
        this.coords.b = this.coords.a - 2 * Math.PI;
      }
      canvas.f.beginPath();
      canvas.f.arc(this.coords.x, this.coords.y, this.coords.r, this.coords.a, this.coords.b, true);
      canvas.f.moveTo(this.coords.x, this.coords.y);
      canvas.f.lineTo(snapped.x, snapped.y);
      canvas.f.stroke();
      
      // left cause it is prettier than the output of snap function
      var d = this.coords.b - this.coords.a;
      d = Math.round(d * -360 * 1000 / (2 * Math.PI)) / 1000;
      if(d < 0) {
        d = d + 360;
      }
      document.getElementById("coords").innerHTML = d + "&deg;";
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
    drawing.drawing.points.push([this.coords.x + this.coords.r * Math.cos(this.coords.a), this.coords.y + this.coords.r * Math.sin(this.coords.a)]);
    drawing.drawing.points.push([this.coords.x + this.coords.r * Math.cos(this.coords.b), this.coords.y + this.coords.r * Math.sin(this.coords.b)]);
    mouse.hide();
  };
}