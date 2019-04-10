import mouse from './mouse.js';

var canvas = {};

window.addEventListener("load", function () {
  canvas.f = document.getElementById("canvas").getContext("2d");
  canvas.bg = document.getElementById("bgcanvas").getContext("2d");
  canvas.f.canvas.addEventListener("mousedown", mouse.click);
  canvas.f.canvas.addEventListener("mousemove", mouse.move);
  canvas.f.canvas.addEventListener("touchend", mouse.click);
  canvas.f.canvas.addEventListener("touchmove", mouse.move);
  canvas.f.canvas.addEventListener("mouseout", mouse.hide);
});

export default canvas;