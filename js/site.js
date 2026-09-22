/* Clean Sweets — client interactivity (search + form).
   Supabase can be wired in later by replacing __csSubmit and the search source. */
(function () {
  "use strict";

  /* ---- Contact form (placeholder until Supabase is connected) ---- */
  window.__csSubmit = function (event) {
    event.preventDefault();
    var form = event.target;
    var btn = form.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "שולח..."; }
    setTimeout(function () {
      form.innerHTML = '<p style="color:#ececdb;font-size:1.1rem">תודה! ההודעה נשלחה בהצלחה.</p>';
    }, 500);
    return false;
  };

  /* ---- Search ---- */
  var input = document.getElementById("q");
  var results = document.getElementById("results");
  if (!input || !results) { return; }

  var index = [];
  fetch("data/search-index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      index = data;
      input.addEventListener("input", run);
      run();
    })
    .catch(function () {
      results.innerHTML = "<p>לא ניתן לטעון את אינדקס החיפוש.</p>";
    });

  function run() {
    var q = (input.value || "").trim();
    if (!q) {
      results.innerHTML = "";
      return;
    }
    var matches = index.filter(function (e) {
      return e.t.indexOf(q) !== -1;
    });
    if (!matches.length) {
      results.innerHTML = "<p>לא נמצאו תוצאות עבור: " + escapeHtml(q) + "</p>";
      return;
    }
    results.innerHTML = matches.map(function (e) {
      return '<div class="result"><h3><a href="' + e.u + '">' + escapeHtml(e.t) + "</a></h3></div>";
    }).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      var map = { 38: "amp", 60: "lt", 62: "gt", 34: "quot", 39: "#39" };
      return "&" + map[c.charCodeAt(0)] + ";";
    });
  }
})();