// colors.js

export default {
  background: '#ffffff',
  primary: '#bedbf8',
  secondary: '#e3f1fe',
  cursor: '#ffa0a0',
  preview: '#d6d6d6',
  default: '#333333',

  theme(t) {
    if (t === 'dark') {
      this.background = '#121212';
      this.primary = '#373737';
      this.secondary = '#242424';
      this.cursor = '#a13131';
      this.preview = '#3d3d3d';
      this.default = '#f3f3f3';
    } else if (t === 'blue') {
      this.background = '#003153';
      this.primary = '#28516d';
      this.secondary = '#144160';
      this.cursor = '#a13131';
      this.preview = '#3d3d3d';
      this.default = '#f3f3f3';
    } else {
      this.background = '#ffffff';
      this.primary = '#bedbf8'; // #d7dee4 was discarded new light theme
      this.secondary = '#e3f1fe'; // #ebeef1 was discarded new light theme
      this.cursor = '#ffa0a0';
      this.preview = '#d6d6d6';
      this.default = '#333333';
    }
  }
};
