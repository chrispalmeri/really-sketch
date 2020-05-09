import drawing from './drawing.js';
import mouse from './mouse.js';
import convert from './coords.js';

export default function snap(x, y, u, v) {
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
  var coordX = snapped.x;
  var coordY = snapped.y;
  
  
  if(origin.x !== undefined && origin.y !== undefined) {
    var angle = {};
    var a = Math.atan2((target.y - origin.y), (target.x - origin.x));
    
    if(drawing.drawing.anglesnap > 0) {
      a = Math.round((a * 180 / Math.PI) / drawing.drawing.anglesnap) * drawing.drawing.anglesnap;
      a = a * Math.PI / 180;
    }
    var r = Math.sqrt(Math.pow(target.x - origin.x, 2) + Math.pow(target.y - origin.y, 2));
    r = Math.round(r / snap2) * snap2;
    
    //use new a and r to calculate xy from origin
    angle.x = Math.cos(a) * r + origin.x;
    angle.y = Math.sin(a) * r + origin.y;
    angle.d = Math.sqrt(Math.pow(target.x - angle.x, 2) + Math.pow(target.y - angle.y, 2));

    if(drawing.drawing.anglesnap > 0 || snap2 > 1) {
      if(angle.d <= grid.d || (snapper == 1 && drawing.drawing.endsnap == 0)) {
        snapped.x = angle.x;
        snapped.y = angle.y;
        coordX = r;
        coordY = a + " rad";
      }
    }
    
  }
  
  document.getElementById("coords").innerHTML = convert(coordX) + ", " + convert(coordY);
  document.getElementById("coords").style.display = "block";
  document.getElementById("coords").style.left = (mouse.x + 32) + "px";
  document.getElementById("coords").style.top = (mouse.y - 32) + "px";
  
  return {x: snapped.x, y: snapped.y};
}