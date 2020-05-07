import drawing from './drawing.js';

export default function convert(n) {
  var degree = false;

  if(typeof n === 'string') {
    if(n.search('&deg;') > -1) {
      degree = true;
      n.replace('&deg;', '');
    }
    n = parseFloat(n);
  }

  n = +n.toPrecision(15); // sometimes degrees would have float error after the 1000th's
  
  //drawing.drawing.tooltip; // 1=primary,2=secondary,3=combined
  //drawing.drawing.fractions; // 0=decimal,1=fractional

  if(degree) {
    n = n + '&deg;';
  }

  return n;
}