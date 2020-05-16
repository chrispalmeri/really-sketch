// mouse.js

import drawing from './drawing.js';
import tool from './tool.js';
import canvas from './canvas.js';

class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  load() {
    canvas.f.canvas.addEventListener("mousedown", e => this.click(e));
    canvas.f.canvas.addEventListener("mousemove", e => this.move(e));
    canvas.f.canvas.addEventListener("touchend", e => this.click(e));
    canvas.f.canvas.addEventListener("touchmove", e => this.move(e));
    canvas.f.canvas.addEventListener("mouseout", this.hide);
  }

  click(e) {
    if (e.touches) {
      this.x = e.changedTouches[0].pageX;
      this.y = e.changedTouches[0].pageY - 48;
    } else {
      this.x = e.clientX;
      this.y = e.clientY;
    }
    tool.click(this.x, this.y);
  }

  move(e) {
    if (e.touches) {
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY - 48;
      e.preventDefault();
    } else {
      this.x = e.clientX;
      this.y = e.clientY;
    }
    drawing.refresh();
    tool.move(this.x, this.y);
  }

  hide() {
    document.getElementById("coords").style.display = "none";
    drawing.refresh();
  }
}

export default new Mouse();
