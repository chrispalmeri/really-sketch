import mouse from './mouse.js';

export default new function() {
  window.addEventListener("load", function() {
    this.f = document.getElementById("canvas").getContext("2d");
    this.bg = document.getElementById("bgcanvas").getContext("2d");
    this.f.canvas.addEventListener("mousedown", mouse.click);
    this.f.canvas.addEventListener("mousemove", mouse.move);
    this.f.canvas.addEventListener("touchend", mouse.click);
    this.f.canvas.addEventListener("touchmove", mouse.move);
    this.f.canvas.addEventListener("mouseout", mouse.hide);
  }.bind(this));
};