import drawing from './drawing.js';
import tool from './tool.js';

export default new function() {
  this.x = 0;
  this.y = 0;

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
}