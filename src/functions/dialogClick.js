// functions/dialogClick.js

window.addEventListener("load", function() {
  var dialogs = document.getElementsByClassName("dialog");
  Array.prototype.forEach.call(dialogs, dialogHandler);
});

function dialogHandler(dialog) {
  dialog.addEventListener("click", dialogClick);
}

export default function dialogClick(e) {
  if (e.target.className === "dialog") {
    e.target.style.display = "none";
  }
}
