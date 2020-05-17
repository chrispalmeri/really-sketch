// drawing.js

import canvas from './canvas.js';
import colors from './colors.js';
import options from './options.js';

class Drawing {
  constructor() {
    this.drawing = {};
    this.drawing.points = [];
    this.drawing.objects = [];
  }

  undo() {
    this.drawing.objects.splice(-1, 1);
    this.refresh();
  }

  clear() {
    this.drawing.objects.length = 0;
    this.refresh();
  }

  refresh() {
    canvas.f.canvas.width = document.body.clientWidth; //window.innerWidth;
    canvas.f.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); //window.innerHeight;
    canvas.f.translate(0.5, 0.5);
    canvas.bg.canvas.width = document.body.clientWidth; //window.innerWidth;
    canvas.bg.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); //window.innerHeight;
    canvas.bg.translate(0.5, 0.5);
    canvas.f.clearRect(0, 0, canvas.f.canvas.width, canvas.f.canvas.height);
    canvas.bg.fillStyle = colors.background;
    canvas.bg.fillRect(-1, -1, canvas.bg.canvas.width + 1, canvas.bg.canvas.height + 1);
    canvas.f.fillStyle = colors.cursor;
    canvas.f.lineCap = "square";

    if (options.grid === 0 || options.divisions === 0) {
      return; // otherwise you crash your browser
    }

    var v, h;
    canvas.bg.beginPath();
    v = options.grid / options.divisions;
    while (v < canvas.bg.canvas.width) {
      canvas.bg.moveTo(Math.round(v), 0);
      canvas.bg.lineTo(Math.round(v), canvas.bg.canvas.height);
      v = v + (options.grid / options.divisions);
    }
    h = options.grid / options.divisions;
    while (Math.round(h) < canvas.bg.canvas.height) {
      canvas.bg.moveTo(0, Math.round(h));
      canvas.bg.lineTo(canvas.bg.canvas.width, h);
      h = h + (options.grid / options.divisions);
    }
    canvas.bg.lineWidth = 1;
    canvas.bg.strokeStyle = colors.secondary;
    canvas.bg.stroke();

    canvas.bg.beginPath();
    v = options.grid;
    while (v < canvas.bg.canvas.width) {
      canvas.bg.moveTo(Math.round(v), 0);
      canvas.bg.lineTo(Math.round(v), canvas.bg.canvas.height);
      v = v + options.grid;
    }
    h = options.grid;
    while (h < canvas.bg.canvas.height) {
      canvas.bg.moveTo(0, Math.round(h));
      canvas.bg.lineTo(canvas.bg.canvas.width, Math.round(h));
      h = h + options.grid;
    }
    canvas.bg.lineWidth = 1;
    canvas.bg.strokeStyle = colors.primary;
    canvas.bg.stroke();

    canvas.f.lineWidth = 2;
    canvas.f.strokeStyle = colors.default;
    this.drawing.objects.forEach(function(obj) {
      if (obj.color) {
        canvas.f.strokeStyle = obj.color;
      } else {
        canvas.f.strokeStyle = colors.default;
      }
      if (obj.width) {
        canvas.f.lineWidth = obj.width;
      } else {
        canvas.f.lineWidth = 2;
      }
      canvas.f.beginPath();
      if (obj.type === "line") {
        if (obj.x === obj.u && obj.y === obj.v) {
          canvas.f.arc(obj.x, obj.y, 0.75, 0, 2 * Math.PI, true);
          canvas.f.stroke();
        } else {
          canvas.f.moveTo(obj.x, obj.y);
          canvas.f.lineTo(obj.u, obj.v);
          canvas.f.stroke();
        }
      } else if (obj.type === "arc") {
        canvas.f.arc(obj.x, obj.y, obj.r, obj.a, obj.b, true);
        canvas.f.stroke();
      } else if (obj.type === "text") {
        canvas.f.font = '18px "Routed Gothic"';
        canvas.f.fillStyle = obj.color || colors.default;
        canvas.f.fillText(obj.text, obj.x, obj.y - 1);
      } else if (obj.type === "eraser") {
        canvas.f.globalCompositeOperation = 'destination-out';
        canvas.f.arc(obj.x, obj.y - canvas.f.canvas.height, obj.r, 0, 2 * Math.PI, true);
        canvas.f.shadowOffsetY = canvas.f.canvas.height;
        canvas.f.shadowColor = '#000';
        canvas.f.shadowBlur = obj.r / 4;
        canvas.f.fill();
        canvas.f.globalCompositeOperation = 'source-over';
        canvas.f.shadowOffsetY = 0;
        canvas.f.shadowBlur = 0;
      }
    });
    canvas.f.lineWidth = 2;
    canvas.f.strokeStyle = colors.preview;
    canvas.f.fillStyle = colors.cursor;
  }

  import() {
    var upload = document.createElement("input");
    upload.setAttribute("type", "file");
    upload.onchange = (e) => {
      var reader = new FileReader();
      var file = e.target.files[0];
      reader.readAsText(file, "utf-8");
      reader.onload = (e) => {
        var temp = JSON.parse(e.target.result);
        this.drawing = temp.drawing;

        if (this.drawing.name) {
          options.change('name', this.drawing.name);
          delete this.drawing.name;
        }
        if (this.drawing.grid) {
          options.change('grid', this.drawing.grid);
          delete this.drawing.grid;
        }
        if (this.drawing.divisions) {
          options.change('divisions', this.drawing.divisions);
          delete this.drawing.divisions;
        }

        // might not want to change someone's default grid just cause they opened a particular drawing

        // could delete a bunch of other options that are imported from old drawings

        // replace old colors with new here
        var colorMap = {
          Red: '#ff4136',
          Orange: '#ff851b',
          Yellow: '#ffdc00',
          Green: '#2ecc40',
          Blue: '#0074d9',
          Purple: '#b10dc9',
        };

        this.drawing.objects.forEach(function(obj) {
          if (obj.colour) {
            if (colorMap[obj.colour]) {
              obj.color = colorMap[obj.colour];
            }
            delete obj.colour;
          }
        });

        this.refresh();
      };
    };
    upload.click();
  }

  xport() {
    var temp = {};
    temp.drawing = this.drawing;
    temp.drawing.name = options.name;
    temp.drawing.grid = options.grid;
    temp.drawing.divisions = options.divisions;

    // should tooltip go into the drawing?

    var json = JSON.stringify(temp);

    if (navigator.msSaveBlob) { // IE
      navigator.msSaveBlob(new Blob([json], {
        type: 'application/json'
      }), options.name + ".json");
    } else {
      var link = document.createElement("a");
      link.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(json));
      link.setAttribute("download", options.name + ".json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  save() {
    canvas.bg.drawImage(canvas.f.canvas, -0.5, -0.5);

    if (navigator.msSaveBlob) { // IE 
      navigator.msSaveBlob(canvas.bg.canvas.msToBlob(), options.name + ".png");
    } else {
      var link = document.createElement("a");
      link.setAttribute("href", canvas.bg.canvas.toDataURL('image/png'));
      link.setAttribute("download", options.name + ".png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export default new Drawing();
