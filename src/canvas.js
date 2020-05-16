// canvass.js

var cv = {
  f: null,
  bg: null
};

window.addEventListener("load", function() {
  cv.f = document.getElementById("canvas").getContext("2d");
  cv.bg = document.getElementById("bgcanvas").getContext("2d");
});

export default cv;
