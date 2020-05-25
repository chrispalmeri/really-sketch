// drawing.js

import canvas from './canvas.js';
import colors from './colors.js';
import options from './options.js';
import storage from './storage.js';

var drw = {
  name: 'Drawing',
  points: [],
  objects: [],

  addItem(item) {
    this.objects.push(item);
    storage.set('drawing', this);
  },

  addSnap(snap) {
    this.points.push(snap);
    storage.set('drawing', this);
  },

  setName(name) {
    this.name = name;
    storage.set('drawing', this);
  },

  undo() {
    this.objects.splice(-1, 1);
    this.refresh();
    storage.set('drawing', this);
  },

  clear() {
    this.name = 'Drawing';
    document.getElementById("name").value = this.name;
    this.points.length = 0;
    this.objects.length = 0;
    this.refresh();
    storage.set('drawing', this);
  },

  refresh(all = false) {
    if (all) {
      // reset the background
      canvas.bg.canvas.width = document.body.clientWidth; //window.innerWidth;
      canvas.bg.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); //window.innerHeight;
      canvas.bg.translate(0.5, 0.5);
      canvas.bg.fillStyle = colors.background;
      canvas.bg.fillRect(-1, -1, canvas.bg.canvas.width + 1, canvas.bg.canvas.height + 1);

      // draw the grid
      if (options.grid && options.divisions) {
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
      }

      // reset the foreground
      canvas.f.canvas.width = document.body.clientWidth; //window.innerWidth;
      canvas.f.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); //window.innerHeight;
      canvas.f.translate(0.5, 0.5);
      canvas.f.lineCap = "square";
    }

    // clear foreground
    canvas.f.clearRect(0, 0, canvas.f.canvas.width, canvas.f.canvas.height);

    // draw the objects
    this.objects.forEach(function(obj) {
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

    // leave setup for cursor and preview
    canvas.f.lineWidth = 2;
    canvas.f.strokeStyle = colors.preview;
    canvas.f.fillStyle = colors.cursor;
  },

  import() {
    var upload = document.createElement("input");
    upload.setAttribute("type", "file");
    upload.onchange = (e) => {
      var reader = new FileReader();
      var file = e.target.files[0];
      reader.readAsText(file, "utf-8");
      reader.onload = (e) => {
        var parsed = JSON.parse(e.target.result);

        // old or new exports
        var temp = parsed.drawing || parsed;

        this.name = temp.name || 'Drawing';
        this.points = temp.points || [];
        this.objects = temp.objects || [];

        if (temp.grid) {
          options.change('grid', temp.grid, false);
        }
        if (temp.divisions) {
          options.change('divisions', temp.divisions, false);
        }

        // set other options from old exports 
        // since that's what it used to do
        // but won't have any effect going forward
        if (temp.tooltip) {
          options.change('tooltip', temp.tooltip, false);
        }
        if (temp.fractions) {
          options.change('fractions', temp.fractions, false);
        }
        if (temp.gridsnap) {
          options.change('gridsnap', temp.gridsnap, false);
        }
        if (temp.lengthsnap) {
          options.change('lengthsnap', temp.lengthsnap, false);
        }
        if (temp.lensnap) {
          options.change('lensnap', temp.lensnap, false);
        }
        if (temp.anglesnap) {
          options.change('anglesnap', temp.anglesnap, false);
        }
        if (temp.snap) {
          options.change('snap', temp.snap, false);
        }
        if (temp.endsnap) {
          options.change('endsnap', temp.endsnap, false);
        }

        // replace old colors with new here
        var colorMap = {
          Red: '#ff4136',
          Orange: '#ff851b',
          Yellow: '#ffdc00',
          Green: '#2ecc40',
          Blue: '#0074d9',
          Purple: '#b10dc9',
        };

        this.objects.forEach(function(obj) {
          if (obj.colour) {
            if (colorMap[obj.colour]) {
              obj.color = colorMap[obj.colour];
            }
            delete obj.colour;
          }
        });

        // display it all
        document.getElementById("name").value = this.name;
        options.sync();
        storage.set('drawing', this);
        this.refresh(true);
      };
    };
    upload.click();
  },

  xport() {
    var json = JSON.stringify({
      name: this.name,
      grid: options.grid,
      divisions: options.divisions,
      points: this.points,
      objects: this.objects
    });

    // should tooltip go into the drawing?

    if (navigator.msSaveBlob) { // IE
      navigator.msSaveBlob(new Blob([json], {
        type: 'application/json'
      }), this.name + ".json");
    } else {
      var link = document.createElement("a");
      link.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(json));
      link.setAttribute("download", this.name + ".json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  save() {
    canvas.bg.drawImage(canvas.f.canvas, -0.5, -0.5);

    if (navigator.msSaveBlob) { // IE 
      navigator.msSaveBlob(canvas.bg.canvas.msToBlob(), this.name + ".png");
    } else {
      var link = document.createElement("a");
      link.setAttribute("href", canvas.bg.canvas.toDataURL('image/png'));
      link.setAttribute("download", this.name + ".png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    this.refresh(true);
  }
};

var maintab = false;

window.addEventListener("load", function() {
  // I wanna be the maintab
  var mt = storage.get('maintab');
  if (!mt) {
    storage.set('maintab', 'true');
    maintab = true;

    // get drawing from storage
    var stored = storage.get('drawing');
    if (stored) {
      drw.name = stored.name;
      drw.points = stored.points;
      drw.objects = stored.objects;

      document.getElementById("name").value = drw.name;
      drw.refresh(true);
    }
  }
});

window.addEventListener("unload", function() {
  // keep the maintab honest
  storage.remove('maintab');
});

window.addEventListener("storage", function() {
  // don't take the maintab away from me
  var mt = storage.get('maintab');
  if (maintab && !mt) {
    storage.set('maintab', 'true');
  }
});

export default drw;
