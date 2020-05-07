import drawing from './drawing.js';

function cd(a, b) {
  if (!b) {
    return a;
  }
  return cd(b, a % b);
}

function toFraction(n) {
  let max = 64;

  let temp = Math.round(n * max);
  let string = Math.floor(temp / max).toString();
  let fraction = temp % max;

  if (fraction) {
    let com = cd(max, fraction);
    string += ' ' + fraction / com + '/' + max / com;
  }

  return string;
}

export default function convert(n) {
  var degree = false;

  if(typeof n === 'string') {
    if(n.search(' rad') > -1) {
      degree = true;
      n.replace(' rad', '');
    }
    n = parseFloat(n);
  }

  if(!degree) {
    n = n / drawing.drawing.grid;
  } else {
    n = n * -180 / Math.PI;
    if(n < 0) {
      n = n + 360;
    }
  }

  var output = '';
  var s = n;

  if (drawing.drawing.tooltip == 2 && !degree) {
    s = (n * drawing.drawing.divisions);
  }
  if (drawing.drawing.tooltip == 3 && !degree) {
    let p = Math.floor(n);
    if(p) {
      output += p + '-';
    }
    s = ((n % 1) * drawing.drawing.divisions);
  }

  if (drawing.drawing.fractions == 1) {
    s = toFraction(s);
  } else {
    s = +s.toFixed(4);
  }

  output += s;

  if(degree) {
    output += '&deg;';
  }

  return output;
}