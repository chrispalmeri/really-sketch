// interaction.js

var inter = {
  text: '',
  touch: ''
};

window.addEventListener("load", function() {
  if ('ontouchstart' in window) {
    inter.touch = "Yes";
    inter.text = "Drag";
  } else {
    inter.touch = "No";
    inter.text = "Click";
  }
  document.getElementById("help").innerHTML = inter.text + " to set new line start point";
});

export default inter;
