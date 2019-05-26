export default new function() {
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