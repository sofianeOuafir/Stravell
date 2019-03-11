(function() {
  var w = window;
  var d = document;
  function l() {
    var s = d.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src =
      "https://app.usemagnify.com/widget/e8b88c42-a7a0-4e4e-94b4-119019401a82";
    var x = d.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
  }
  if (w.attachEvent) {
    w.attachEvent("onload", l);
  } else {
    w.addEventListener("load", l, false);
  }
})();
