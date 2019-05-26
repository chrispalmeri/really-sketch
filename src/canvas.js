export default new function() {
  window.addEventListener("load", function() {
    this.f = document.getElementById("canvas").getContext("2d");
    this.bg = document.getElementById("bgcanvas").getContext("2d");
  }.bind(this));
};