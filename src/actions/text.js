import help from './../help.js';
import interaction from './../interaction.js';
import snap from './../snap.js';
import canvas from './../canvas.js';
import drawing from './../drawing.js';
import mouse from './../mouse.js';
import tool from './../tool.js';

export default function Text() {
  help(interaction.text + " to set text start point");

  this.points = 0;
  this.coords = {};
  this.coords.type = "text";
  this.coords.text = "";

  this.click = function(x, y) {
    this.points = this.points + 1;
    if(this.points === 1) {
      help("Type some text and " + interaction.text + " to stop");
      document.addEventListener('keypress', tool.a.keypress);

      document.getElementById("coords").style.display = "none";
      drawing.refresh();
      this.move();
    } else if(this.points === 2) {
      // remove event listener
      this.save();
      this.reset();
    }
  };

  this.keypress = function(e) {
    var char = String.fromCharCode(e.charCode);
    tool.a.coords.text += char;

    drawing.refresh();
    tool.a.move();
  };

  this.reset = function() {
    document.removeEventListener('keypress', tool.a.keypress);
    tool.a = new Text();
    drawing.refresh();
    tool.a.move(mouse.x, mouse.y);
  };

  this.move = function(x, y) {
    if(this.points === 0) {
      var snapped = snap(x, y);
      this.coords.x = snapped.x;
      this.coords.y = snapped.y;

      canvas.f.beginPath();
      canvas.f.arc(snapped.x, snapped.y, 2.5, 0, 2 * Math.PI, true);
      canvas.f.fill();
    } else if(this.points === 1) {
      canvas.f.beginPath();
      canvas.f.moveTo(this.coords.x, this.coords.y);
      canvas.f.lineTo(this.coords.x, this.coords.y - 16); // this should not be in move, click maybe
      canvas.f.stroke();
      
      canvas.f.font = "16px Arial";
      canvas.f.fillStyle = "#D6D6D6";
      canvas.f.fillText(this.coords.text, this.coords.x, this.coords.y);
    }
  };

  this.save = function() {
    this.coords.colour = document.getElementById('line_colour').value;
    drawing.drawing.objects.push(this.coords);
    mouse.hide();
  };
}