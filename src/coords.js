// coords.js

import options from './options.js';

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
    string += '&#8239;<sup>' + fraction / com + '</sup>&frasl;<sub>' + max / com + '</sub>';
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
    n = n / options.grid;
  } else {
    n = n * -180 / Math.PI;
    if (n < 0) {
      n = n + 360;
    }
  }

  var output = '';
  var s = n;

  if (options.tooltip === "2" && !degree) {
    s = (n * options.divisions);
  }
  if (options.tooltip === "3" && !degree) {
    let p = Math.floor(n);
    output += p + '&prime;&nbsp;';
    s = ((n % 1) * options.divisions);
  }

  if (options.fractions === "1") {
    if (degree) {
      s = toMinutes(s);
    } else {
      s = toFraction(s);
    }
  } else {
    s = +s.toFixed(4);
  }

  output += s;

  if (options.tooltip === "3" && !degree) {
    output += '&Prime;';
  }

  if (degree && output.search('&deg;') < 0) {
    output += '&deg;';
  }

  return output;
}
