import canvas from './canvas.js';

var drawing = new Object();
drawing.drawing = new Object();
drawing.drawing.grid = 96 / 1;
drawing.drawing.divisions = 8;
drawing.drawing.gridsnap = 1;
drawing.drawing.lengthsnap = 1;
drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
drawing.drawing.anglesnap = 15;
drawing.drawing.snap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.gridsnap;
drawing.drawing.endsnap = 1;

drawing.drawing.points = [];
drawing.drawing.objects = [];
drawing.undo = function() {
  this.drawing.objects.splice(-1,1);
  this.refresh();
}
drawing.clear = function() {
  this.drawing.objects.length = 0;
  this.refresh();
}
drawing.refresh = function() {
  canvas.f.canvas.width = document.body.clientWidth; //window.innerWidth;
  canvas.f.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); //window.innerHeight;
  canvas.f.translate(0.5, 0.5);
  canvas.bg.canvas.width = document.body.clientWidth; //window.innerWidth;
  canvas.bg.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); //window.innerHeight;
  canvas.bg.translate(0.5, 0.5);
  canvas.f.clearRect(0, 0, canvas.f.canvas.width, canvas.f.canvas.height);
  canvas.bg.fillStyle = "#fff";
  canvas.bg.fillRect(-1, -1, canvas.bg.canvas.width + 1, canvas.bg.canvas.height + 1);
  canvas.f.fillStyle = "#FFA0A0";
  canvas.f.lineCap = "square";
  
  if(this.drawing.grid === 0 || this.drawing.divisions === 0) {
    return; // otherwise you crash your browser
  }
  
  document.getElementById("grid").value = Math.round(96 * 100 / drawing.drawing.grid) / 100;
  document.getElementById("divisions").value = drawing.drawing.divisions;
  document.getElementById("gridsnap").value = drawing.drawing.gridsnap;
  document.getElementById("lengthsnap").value = drawing.drawing.lengthsnap;
  document.getElementById("anglesnap").value = drawing.drawing.anglesnap;
  document.getElementById("endsnap").value = drawing.drawing.endsnap;
  
  var v, h;
  canvas.bg.beginPath();
  v = this.drawing.grid / this.drawing.divisions;
  while (v < canvas.bg.canvas.width) {
    canvas.bg.moveTo(Math.round(v), 0);
    canvas.bg.lineTo(Math.round(v), canvas.bg.canvas.height);
    v = v + (this.drawing.grid / this.drawing.divisions);
  }
  h = this.drawing.grid / this.drawing.divisions;
  while (Math.round(h) < canvas.bg.canvas.height) {
    canvas.bg.moveTo(0, Math.round(h));
    canvas.bg.lineTo(canvas.bg.canvas.width, h);
    h = h + (this.drawing.grid / this.drawing.divisions);
  }
  canvas.bg.lineWidth = 1;
  canvas.bg.strokeStyle = "#E3F1FE";
  canvas.bg.stroke();
  
  canvas.bg.beginPath();
  v = this.drawing.grid;
  while (v < canvas.bg.canvas.width) {
    canvas.bg.moveTo(Math.round(v), 0);
    canvas.bg.lineTo(Math.round(v), canvas.bg.canvas.height);
    v = v + this.drawing.grid;
  }
  h = this.drawing.grid;
  while (h < canvas.bg.canvas.height) {
    canvas.bg.moveTo(0, Math.round(h));
    canvas.bg.lineTo(canvas.bg.canvas.width, Math.round(h));
    h = h + this.drawing.grid;
  }
  canvas.bg.lineWidth = 1;
  canvas.bg.strokeStyle = "#BEDBF8";
  canvas.bg.stroke();
  
  canvas.f.lineWidth = 2;
  canvas.f.strokeStyle = "#333";
  this.drawing.objects.forEach(function(obj) {
    if (obj.colour) {
      canvas.f.strokeStyle = obj.colour;
    } else {
      canvas.f.strokeStyle = "#333";
    }
    if (obj.width) {
      canvas.f.lineWidth = obj.width;
    } else {
      canvas.f.lineWidth = 2;
    }
    canvas.f.beginPath();
    if(obj.type === "line") {
      if(obj.x === obj.u && obj.y === obj.v) {
        canvas.f.arc(obj.x, obj.y, 0.75, 0, 2 * Math.PI, true);
        canvas.f.stroke();
      } else {
        canvas.f.moveTo(obj.x, obj.y);
        canvas.f.lineTo(obj.u, obj.v);
        canvas.f.stroke();
      }
    } else if(obj.type === "arc") {
      canvas.f.arc(obj.x, obj.y, obj.r, obj.a, obj.b, true);
      canvas.f.stroke();
    } else if(obj.type === "eraser") {
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
  canvas.f.strokeStyle = "#D6D6D6";
}
drawing.import = function() {
  var upload = document.createElement("input");
  upload.setAttribute("type", "file");
  upload.onchange = function() {
    var reader = new FileReader();
    var file = this.files[0];
    reader.readAsText(file, "utf-8");
    reader.onload = function (e) {
      var temp = JSON.parse(e.target.result);
      drawing.drawing = temp.drawing;
      // for previous version saves
      if(drawing.drawing.lengthsnap === undefined) {
        drawing.drawing.lengthsnap = 1;
        drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
      }
      if(drawing.drawing.name === undefined) {
        drawing.drawing.name = "Drawing";
      }
      document.getElementById("name").value = drawing.drawing.name;
      drawing.refresh();
    }
  }
  upload.click();
}
drawing.export = function() {
  var name = document.getElementById("name").value;
  name = name.replace(/[^a-z0-9_\-\s.'()]/gi, '');
  if(name === "") {
    name = "Drawing";
  }
  
  var temp = new Object();
  temp.drawing = this.drawing;
  temp.drawing.name = name;
  var json = encodeURIComponent(JSON.stringify(temp));

  var link = document.createElement("a");
  link.setAttribute("href", "data:text/json;charset=utf-8," + json);
  link.setAttribute("download", name + ".json");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
drawing.save = function() {
  var name = document.getElementById("name").value;
  name = name.replace(/[^a-z0-9_\-\s.'()]/gi, '');
  if(name === "") {
    name = "Drawing";
  }
  canvas.bg.drawImage(canvas.f.canvas, -0.5, -0.5);
  var link = document.createElement("a");
  link.setAttribute("href", canvas.bg.canvas.toDataURL('image/png'));
  link.setAttribute("download", name + ".png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default drawing;