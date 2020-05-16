// functions/linkClick.js

window.addEventListener("load", function() {
  var links = document.getElementsByTagName("a");
  Array.prototype.forEach.call(links, linkHandler);
});

function linkHandler(link) {
  if (link.href.indexOf("#") > 0) {
    link.addEventListener("click", linkClick);
  }
}

export default function linkClick(e) {
  var old = document.getElementsByClassName("active");
  var i;
  for (i = old.length; i > 0; i--) {
    old[i - 1].className = "";
  }
  var section = e.target.href;
  section = section.substring(section.indexOf("#") + 1);
  document.getElementById(section).className = "active";
  e.target.className = "active";
  e.preventDefault();
}
