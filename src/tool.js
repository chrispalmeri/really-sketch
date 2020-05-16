// tool.js

export default {
  active: null,
  change(tool) {
    this.active = tool;
  },
  reset() {
    this.active.reset();
  },
  click(x, y) {
    this.active.click(x, y);
  },
  move(x, y) {
    this.active.move(x, y);
  }
};
