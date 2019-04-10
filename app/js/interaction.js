var touchscreen;
var interaction = {
  text: ''
}

window.addEventListener("load", function () {
  if('ontouchstart' in window) {
    touchscreen = "Yes";
    interaction.text = "Drag";
  } else {
    touchscreen = "No";
    interaction.text = "Click";
  }
  document.getElementById("help").innerHTML = interaction.text + " to set new line start point";
});

export default interaction;