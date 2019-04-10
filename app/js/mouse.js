import drawing from './drawing.js';
import tool from './tool.js';

var mouse = new Object();
mouse.x = 0;
mouse.y = 0;
mouse.click = function(e) {
  if(e.touches) {
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY - 48;
  } else {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  tool.a.click(mouse.x, mouse.y);
}
mouse.move = function(e) {
  if(e.touches) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY - 48;
    e.preventDefault();
  } else {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  drawing.refresh();
  tool.a.move(mouse.x, mouse.y);
}
mouse.hide = function(e) {
  document.getElementById("coords").style.display = "none";
  drawing.refresh();
}

export default mouse;