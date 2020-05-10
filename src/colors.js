// colors.js

export default {
  background: '#ffffff',
  preview: '#d6d6d6',
  cursor: '#ffa0a0',
  secondary: '#e3f1fe',
  primary: '#bedbf8',
  default: '#333333',

  theme: function(t) {
    if(t === 'dark') {
      this.background = '#111111';
      this.preview = '#444444';
      this.cursor = '#943636';
      this.secondary = '#212b33';
      this.primary = '#293a4a';
      this.default = '#eeeeee';
    } else if(t === 'blue') {
      this.background = '#003153';
      this.preview = '#444444';
      this.cursor = '#943636';
      this.secondary = '#143f5c';
      this.primary = '#1b537a';
      this.default = '#eeeeee';
    } else {
      this.background = '#ffffff';
      this.preview = '#d6d6d6';
      this.cursor = '#ffa0a0';
      this.secondary = '#e3f1fe';
      this.primary = '#bedbf8';
      this.default = '#333333';
    }
  }
}