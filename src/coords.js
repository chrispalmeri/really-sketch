// coords.js

import drawing from './drawing.js';

function cd(a, b) {
  if (!b) {
    return a;
  }
  return cd(b, a % b);
}

function toMinutes(n) {
  let max = 60;

  let temp = Math.round(n * max);
  let string = Math.floor(temp / max) + '&deg;';
  let minutes = temp % max;

  if (minutes) {
    string += '&nbsp;' + minutes + "&prime;";
  }

  return string;
}

function toFraction(n) {
  let max = 64;

  let temp = Math.round(n * max);
  let string = Math.floor(temp / max).toString();
  let fraction = temp % max;

  if (fraction) {
    let com = cd(max, fraction);
    string += '&#8239;' + fraction / com + '&frasl;' + max / com;
  }

  return string;
}

export default function convert(n) {
  var degree = false;

  if (typeof n === 'string') {
    if (n.search(' rad') > -1) {
      degree = true;
      n.replace(' rad', '');
    }
    n = parseFloat(n);
  }

  if (!degree) {
    n = n / drawing.drawing.grid;
  } else {
    n = n * -180 / Math.PI;
    if (n < 0) {
      n = n + 360;
    }
  }

  var output = '';
  var s = n;

  if (drawing.drawing.tooltip === "2" && !degree) {
    s = (n * drawing.drawing.divisions);
  }
  if (drawing.drawing.tooltip === "3" && !degree) {
    let p = Math.floor(n);
    output += p + '&prime;&nbsp;';
    s = ((n % 1) * drawing.drawing.divisions);
  }

  if (drawing.drawing.fractions === "1") {
    if (degree) {
      s = toMinutes(s);
    } else {
      s = toFraction(s);
    }
  } else {
    s = +s.toFixed(4);
  }

  output += s;

  if (drawing.drawing.tooltip === "3" && !degree) {
    output += '&Prime;';
  }

  if (degree && output.search('&deg;') < 0) {
    output += '&deg;';
  }

  return output;
}
