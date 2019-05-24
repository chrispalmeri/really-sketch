'use strict';

var canvas = new function() {
  window.addEventListener("load", function() {
    this.f = document.getElementById("canvas").getContext("2d");
    this.bg = document.getElementById("bgcanvas").getContext("2d");
  }.bind(this));
};

var drawing = new function() {
  this.drawing = new Object();
  this.drawing.grid = 96 / 1;
  this.drawing.divisions = 8;
  this.drawing.gridsnap = 1;
  this.drawing.lengthsnap = 1;
  this.drawing.lensnap = this.drawing.grid / this.drawing.divisions * this.drawing.lengthsnap;
  this.drawing.anglesnap = 15;
  this.drawing.snap = this.drawing.grid / this.drawing.divisions * this.drawing.gridsnap;
  this.drawing.endsnap = 1;

  this.drawing.points = [];
  this.drawing.objects = [];

  this.undo = function() {
    this.drawing.objects.splice(-1,1);
    this.refresh();
  };

  this.clear = function() {
    this.drawing.objects.length = 0;
    this.refresh();
  };

  this.refresh = function() {
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
    
    document.getElementById("grid").value = Math.round(96 * 100 / this.drawing.grid) / 100;
    document.getElementById("divisions").value = this.drawing.divisions;
    document.getElementById("gridsnap").value = this.drawing.gridsnap;
    document.getElementById("lengthsnap").value = this.drawing.lengthsnap;
    document.getElementById("anglesnap").value = this.drawing.anglesnap;
    document.getElementById("endsnap").value = this.drawing.endsnap;
    
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
  };

  this.import = function() {
    var upload = document.createElement("input");
    upload.setAttribute("type", "file");
    upload.onchange = function() {
      var reader = new FileReader();
      var file = this.files[0];
      reader.readAsText(file, "utf-8");
      reader.onload = function (e) {
        var temp = JSON.parse(e.target.result);
        this.drawing = temp.drawing;
        // for previous version saves
        if(this.drawing.lengthsnap === undefined) {
          this.drawing.lengthsnap = 1;
          this.drawing.lensnap = this.drawing.grid / this.drawing.divisions * this.drawing.lengthsnap;
        }
        if(this.drawing.name === undefined) {
          this.drawing.name = "Drawing";
        }
        document.getElementById("name").value = this.drawing.name;
        this.refresh();
      };
    };
    upload.click();
  };

  this.export = function() {
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
  };

  this.save = function() {
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
  };
};

var tool = new function() {
  this.a = '';
};

var mouse = new function() {
  this.x = 0;
  this.y = 0;

  this.load = function() {
    canvas.f.canvas.addEventListener("mousedown", this.click);
    canvas.f.canvas.addEventListener("mousemove", this.move);
    canvas.f.canvas.addEventListener("touchend", this.click);
    canvas.f.canvas.addEventListener("touchmove", this.move);
    canvas.f.canvas.addEventListener("mouseout", this.hide);
  }.bind(this);

  this.click = function(e) {
    if(e.touches) {
      this.x = e.changedTouches[0].pageX;
      this.y = e.changedTouches[0].pageY - 48;
    } else {
      this.x = e.clientX;
      this.y = e.clientY;
    }
    tool.a.click(this.x, this.y);
  }.bind(this);

  this.move = function(e) {
    if(e.touches) {
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY - 48;
      e.preventDefault();
    } else {
      this.x = e.clientX;
      this.y = e.clientY;
    }
    drawing.refresh();
    tool.a.move(this.x, this.y);
  }.bind(this);
  
  this.hide = function() {
    document.getElementById("coords").style.display = "none";
    drawing.refresh();
  };
};

function help(text) { // maybe this should be in refresh and ref tool.help
  document.getElementById("help").innerHTML = text;
}

var interaction = new function() {
  this.text = '';
  this.touch = '';

  window.addEventListener("load", function() {
    if('ontouchstart' in window) {
      this.touch = "Yes";
      this.text = "Drag";
    } else {
      this.touch = "No";
      this.text = "Click";
    }
    document.getElementById("help").innerHTML = this.text + " to set new line start point";
  }.bind(this));
};

function snap(x, y, u, v) {
  var target = {x: x, y: y};
  var origin = {x: u, y: v};
  var snapped = {};
  var snapper = 1;
  var snap2 = 1;
  if(drawing.drawing.snap > 0) {
    snapper = drawing.drawing.snap;
  }
  if(drawing.drawing.lensnap > 0) {
    snap2 = drawing.drawing.lensnap;
  }
  
  var grid = {};
  //if(drawing.drawing.snap === 0) {
  //  grid.x = target.x;
  //  grid.y = target.y;
  //  grid.d = 100;
  //} else {
    grid.x = Math.round(target.x / snapper) * snapper;
    grid.y = Math.round(target.y / snapper) * snapper;
    grid.d = Math.sqrt(Math.pow(target.x - grid.x, 2) + Math.pow(target.y - grid.y, 2));
  //}
  
  // endpoints, just going to overwrite grid so I don't have to mess with
  // 3 way compar with angle later
  // does not work when gridsnap is turned off though
  if(drawing.drawing.endsnap > 0) {
    // if grid snap is off initialize this to the first point before looping
    if(snapper === 1) {
      grid.x = drawing.drawing.points[0][0];
      grid.y = drawing.drawing.points[0][1];
      grid.d = Math.sqrt(Math.pow(target.x - drawing.drawing.points[0][0], 2) + Math.pow(target.y - drawing.drawing.points[0][1], 2));
    }
    //loop through points
    for(var i = 0; i < drawing.drawing.points.length; i++) {
      var dist = Math.sqrt(Math.pow(target.x - drawing.drawing.points[i][0], 2) + Math.pow(target.y - drawing.drawing.points[i][1], 2));
      if(dist <= grid.d) {
        grid.x = drawing.drawing.points[i][0];
        grid.y = drawing.drawing.points[i][1];
        grid.d = dist;
      }
    }
  }
  
  snapped.x = grid.x;
  snapped.y = grid.y;
  var coordX = Math.round(snapped.x * 1000 / drawing.drawing.grid) / 1000;
  var coordY = Math.round(snapped.y * 1000 / drawing.drawing.grid) / 1000;
  
  
  if(origin.x !== undefined && origin.y !== undefined) {
    var angle = {};
    var a = Math.atan2((target.y - origin.y), (target.x - origin.x));
    
    if(drawing.drawing.anglesnap > 0) {
      a = Math.round((a*180/Math.PI) / drawing.drawing.anglesnap) * drawing.drawing.anglesnap;
    } else {
      a = a*180/Math.PI;
    }
    var r = Math.sqrt(Math.pow(target.x - origin.x, 2) + Math.pow(target.y - origin.y, 2));
    r = Math.round(r / snap2) * snap2;
    
    //use new a and r to calculate xy from origin
    angle.x = Math.cos(a*Math.PI/180) * r + origin.x;
    angle.y = Math.sin(a*Math.PI/180) * r + origin.y;
    angle.d = Math.sqrt(Math.pow(target.x - angle.x, 2) + Math.pow(target.y - angle.y, 2));

    if(drawing.drawing.anglesnap > 0 || snap2 > 1) {
    if(angle.d <= grid.d || (snapper == 1 && drawing.drawing.endsnap == 0)) {
      snapped.x = angle.x;
      snapped.y = angle.y;
      coordX = Math.round(r * 1000 / drawing.drawing.grid) / 1000;
      if(a > 0) {
        a = a - 360;
      }
      coordY = Math.round(a * -1000) / 1000 + "&deg;";
    }
    }
    
  }
  
  document.getElementById("coords").innerHTML = coordX + ", " + coordY;
  document.getElementById("coords").style.display = "block";
  document.getElementById("coords").style.left = (mouse.x + 32) + "px";
  document.getElementById("coords").style.top = (mouse.y - 32) + "px";
  
  return {x: snapped.x, y: snapped.y};
}

function Line() {
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

function Arc() {
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

function Eraser() {
  help(interaction.text + " to position eraser");

  this.points = 0;
  this.coords = {};
  this.coords.type = "eraser";

  this.click = function(x, y) {
    this.save();
    this.reset();
  };

  this.reset = function() {
    tool.a = new Eraser();
    drawing.refresh();
    tool.a.move(mouse.x, mouse.y);
  };

  this.move = function(x, y) {
    if(this.points === 0) {
      this.coords.x = x;
      this.coords.y = y;
      if(drawing.drawing.snap === 0) {
        this.coords.r = 16;
      } else {
        this.coords.r = drawing.drawing.snap - 1;
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

window.addEventListener("load", function () {
  var buttons = document.getElementsByTagName("button");
  Array.prototype.forEach.call(buttons, buttonHandler);
});

function buttonHandler(button) {
  button.addEventListener("click", buttonClick);
}

function buttonClick(e) {
  var youClicked = {
    "line-button": function () {
      tool.a = new Line();
    },
    "arc-button": function () {
      tool.a = new Arc();
    },
    "eraser-button": function () {
      tool.a = new Eraser();
    },
    "undo-button": function () {
      drawing.undo();
    },
    "options-button": function () {
      document.getElementById("options").style.display = "block";
    },
    "options-close": function () {
      document.getElementById("options").style.display = "none";
    },
    "info": function () {
      // var dpi = "<table><tr><td width=\"60%\">Window Width:</td><td>" + document.body.clientWidth;
      // dpi += "</td></tr><tr><td>Device Pixel Ratio:</td><td>" + window.devicePixelRatio;
      // dpi += "</td></tr><tr><td>Touch Screen:</td><td>" + interaction.touch;
      // dpi += "</td></tr></table>";
      // document.getElementById("dpi").innerHTML = dpi;
  
      document.getElementById("drawingOptions").style.display = 'none';
      document.getElementById("appInfo").style.display = 'block';
    },
    "ok": function () {
      document.getElementById("appInfo").style.display = 'none';
    },
    "clear": function () {
      drawing.clear();
    },
    "save": function () {
      drawing.save();
    },
    "export": function () {
      drawing.export();
    },
    "import": function () {
      drawing.import();
    }
  };
  youClicked[e.currentTarget.id]();
}

window.addEventListener("load", function () {
  var dialogs = document.getElementsByClassName("dialog");
  Array.prototype.forEach.call(dialogs, dialogHandler);
});

function dialogHandler(dialog) {
  dialog.addEventListener("click", dialogClick);
}

function dialogClick(e) {
  if(e.target.className === "dialog") {
    e.target.style.display = "none";
  }
}

window.addEventListener("load", function () {
  var links = document.getElementsByTagName("a");
  Array.prototype.forEach.call(links, linkHandler);
});

function linkHandler(link) {
  if(link.href.indexOf("#") > 0) {
    link.addEventListener("click", linkClick);
  }
}

function linkClick(e) {
  var old = document.getElementsByClassName("active");
  var i;
  for (i = old.length; i > 0; i--) {
    old[i-1].className = "";
  }
  var section = e.target.href;
  section = section.substring(section.indexOf("#")+1);
  document.getElementById(section).className = "active";
  e.target.className = "active";
  e.preventDefault();
}

window.addEventListener("load", function () {
  var selects = document.getElementsByTagName("select");
  Array.prototype.forEach.call(selects, selectHandler);
});

function selectHandler(select) {
  select.addEventListener("change", selectChange);
}

function selectChange(e) {
  var youClicked = {
    "grid": function () {
      drawing.drawing.grid = 96 / e.target.value;
      drawing.drawing.snap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.gridsnap;
      drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
      drawing.refresh();
    },
    "divisions": function () {
      drawing.drawing.divisions = e.target.value;
      drawing.drawing.snap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.gridsnap;
      drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
      drawing.refresh();
    },
    "gridsnap": function () {
      drawing.drawing.gridsnap = e.target.value;
      drawing.drawing.snap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.gridsnap;
      drawing.refresh();
    },
    "lengthsnap": function () {
      drawing.drawing.lengthsnap = e.target.value;
      drawing.drawing.lensnap = drawing.drawing.grid / drawing.drawing.divisions * drawing.drawing.lengthsnap;
      drawing.refresh();
    },
    "anglesnap": function () {
      drawing.drawing.anglesnap = e.target.value;
      drawing.refresh();
    },
    "endsnap": function () {
      drawing.drawing.endsnap = e.target.value;
      drawing.refresh();
    },
    "line_colour": function() {

    },
    "line_width": function() {

    }
  };
  youClicked[e.target.id]();
}

window.addEventListener("load", function () {
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

window.addEventListener("keydown", function (e) {
  var elem = e.target.tagName.toLowerCase();
  // anything not on a text input
  if (elem !== 'input' && elem !== 'select') {
    if(e.ctrlKey && e.keyCode === 90) {
      drawing.undo();
    }
    if(e.keyCode === 27) {
      tool.a.reset();
      // also make sure options closes
      document.getElementById("options").style.display = "none";
    }
    if(e.shiftKey && e.keyCode === 191) {
      var old = document.getElementsByClassName("active");
      var i;
      for (i = old.length; i > 0; i--) {
        old[i-1].className = "";
      }
      document.getElementById("shortcuts-link").className = "active";
      document.getElementById("shortcuts").className = "active";
      document.getElementById("options").style.display = "block";
    }
  }
});
