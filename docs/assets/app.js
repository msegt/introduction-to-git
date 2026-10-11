/* Git & GitLab Tutorial — CMT651. Static single-page app; content is loaded from content.js. */
(function () {
  "use strict";
  var DATA;
  try {
    var raw = atob(window.__C), key = window.__K, bytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    DATA = JSON.parse(new TextDecoder("utf-8").decode(bytes));
  } catch (e) {
    document.getElementById("main").innerHTML = '<div class="callout danger"><p>Sorry, the tutorial could not load. Try refreshing the page.</p></div>';
    return;
  }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var main = $("#main"), tabs = $("#tabs"), side = $("#side");
  var flat = [];
  DATA.sections.forEach(function (s) { s.pages.forEach(function (p) { flat.push({ s: s, p: p }); }); });

  function find(sid, pid) {
    for (var i = 0; i < flat.length; i++) if (flat[i].s.id === sid && (!pid || flat[i].p.id === pid)) return i;
    return -1;
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderTabs(cur) {
    tabs.innerHTML = DATA.sections.map(function (s) {
      return '<a href="#/' + s.id + "/" + s.pages[0].id + '" class="' + (s.module ? "mod " : "") + (s === cur ? "on" : "") + '"' + (s === cur ? ' aria-current="page"' : "") + ">" + esc(s.title) + "</a>";
    }).join("");
    var on = $(".on", tabs); if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function renderSide(s, p) {
    side.innerHTML = "<h2>" + esc(s.title) + "</h2>" + s.pages.map(function (x) {
      return '<a href="#/' + s.id + "/" + x.id + '"' + (x === p ? ' class="on" aria-current="page"' : "") + ">" + esc(x.title) + "</a>";
    }).join("");
  }

  function route() {
    var h = (location.hash || "").replace(/^#\/?/, "").split("/");
    var idx = find(h[0], h[1]);
    if (idx < 0) idx = find(h[0]);
    if (idx < 0) idx = 0;
    var cur = flat[idx], s = cur.s, p = cur.p;
    renderTabs(s); renderSide(s, p);
    var prev = flat[idx - 1], next = flat[idx + 1];
    main.innerHTML = '<div class="crumb">' + esc(s.title) + (s.module ? ' <span class="badge">CMT651</span>' : "") + "</div>" + p.html +
      '<nav class="pager" aria-label="Previous and next page">' +
      (prev ? '<a class="prev" href="#/' + prev.s.id + "/" + prev.p.id + '"><small>← Previous</small>' + esc(prev.p.title) + "</a>" : "") +
      (next ? '<a class="next" href="#/' + next.s.id + "/" + next.p.id + '"><small>Next →</small>' + esc(next.p.title) + "</a>" : "") + "</nav>";
    document.title = p.title + " · Git & GitLab Tutorial";
    enhance();
    side.classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false");
    var anchor = h[2] ? decodeURIComponent(h[2]) : null, el = anchor && document.getElementById(anchor);
    if (el) {
      if (el.tagName === "DETAILS") el.open = true;
      setTimeout(function () { el.scrollIntoView({ block: "start" }); }, 0);
    } else { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
  }

  function slug(t) { return t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }

  function enhance() {
    // headings get ids for linking
    $$("h2, h3", main).forEach(function (h) { if (!h.id) h.id = slug(h.textContent); });
    // copy buttons on code blocks
    $$("pre", main).forEach(function (pre) {
      var b = document.createElement("button");
      b.className = "copy"; b.type = "button"; b.textContent = "Copy";
      b.setAttribute("aria-label", "Copy this code");
      b.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        var txt = code.innerText.trim();
        if (pre.classList.contains("cmd")) txt = code.innerText.split("\n").filter(function (l) { return !/^\s*#/.test(l); }).join("\n").trim();
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { fallback(txt); done(); });
        else { fallback(txt); done(); }
      });
      pre.appendChild(b);
      // grey out shell comments
      var code = pre.querySelector("code");
      if (code && pre.classList.contains("cmd")) code.innerHTML = code.innerHTML.replace(/(^|\n)(\s*#[^\n]*)/g, '$1<span class="c">$2</span>');
    });
    // problem filters
    $$("input.filter", main).forEach(function (inp) {
      inp.addEventListener("input", function () {
        var q = norm(inp.value);
        $$("details.problem", main).forEach(function (d) {
          var hit = !q || q.split(" ").every(function (w) { return norm(d.textContent).indexOf(w) >= 0; });
          d.classList.toggle("hidden", !hit);
        });
      });
    });
    $$("details.problem", main).forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open && d.id) history.replaceState(null, "", location.hash.split("/").slice(0, 3).join("/") + "/" + d.id);
      });
    });
    $$(".quiz", main).forEach(quiz);
    $$(".wizard", main).forEach(wizard);
  }
  function fallback(t) {
    var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta);
  }
  function norm(t) { return String(t).toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim(); }

  // ---- quiz: "good or bad?" items
  function quiz(el) {
    var items = (DATA.quizzes[el.getAttribute("data-quiz")] || []).slice(), i = 0, score = 0;
    var title = el.getAttribute("data-title") || "Quick check";
    function show() {
      if (i >= items.length) {
        el.innerHTML = "<h3>" + esc(title) + "</h3><p><strong>You got " + score + " out of " + items.length + ".</strong></p><button class='btn primary' type='button'>Try again</button>";
        $("button", el).onclick = function () { i = 0; score = 0; show(); };
        return;
      }
      var it = items[i];
      el.innerHTML = "<h3>" + esc(title) + "</h3><p>" + esc(it.q || "Is this a good example?") + "</p><div class='q-msg'>" + esc(it.msg) + "</div>" +
        "<div class='q-btns'><button class='btn' type='button' data-a='1'>" + esc(it.yes || "Good") + "</button><button class='btn' type='button' data-a='0'>" + esc(it.no || "Needs work") + "</button></div>" +
        "<div class='q-meta'>" + (i + 1) + " of " + items.length + "</div>";
      $$("button[data-a]", el).forEach(function (b) {
        b.onclick = function () {
          var right = (b.getAttribute("data-a") === "1") === it.good;
          if (right) score++;
          $$("button[data-a]", el).forEach(function (x) { x.disabled = true; });
          var fb = document.createElement("div");
          fb.className = "q-fb " + (right ? "ok" : "no");
          fb.innerHTML = "<strong>" + (right ? "Yes. " : "Not quite. ") + "</strong>" + it.why;
          var nx = document.createElement("button"); nx.className = "btn primary"; nx.type = "button"; nx.textContent = i + 1 < items.length ? "Next" : "See score"; nx.style.marginTop = ".6rem";
          nx.onclick = function () { i++; show(); };
          fb.appendChild(document.createElement("br")); fb.appendChild(nx);
          el.insertBefore(fb, $(".q-meta", el));
          nx.focus();
        };
      });
    }
    show();
  }

  // ---- wizard: decision tree
  function wizard(el) {
    var w = DATA.wizards[el.getAttribute("data-wizard")]; if (!w) return;
    var trail = [];
    function show(nodeId) {
      var n = w.nodes[nodeId];
      var html = "<h3>" + esc(w.title) + "</h3>";
      if (n.answer) {
        html += "<div class='wz-ans'>" + n.answer + "</div>";
      } else {
        html += "<p><strong>" + esc(n.q) + "</strong></p><div class='wz-opts'>" + n.options.map(function (o, k) { return "<button class='btn' type='button' data-k='" + k + "'>" + esc(o.label) + "</button>"; }).join("") + "</div>";
      }
      if (trail.length) html += "<p><button class='btn' type='button' data-back='1'>← Back</button> <button class='btn' type='button' data-restart='1'>Start again</button></p>";
      el.innerHTML = html;
      $$("button[data-k]", el).forEach(function (b) { b.onclick = function () { trail.push(nodeId); show(n.options[+b.getAttribute("data-k")].next); }; });
      var bk = $("button[data-back]", el); if (bk) bk.onclick = function () { show(trail.pop()); };
      var rs = $("button[data-restart]", el); if (rs) rs.onclick = function () { trail = []; show("start"); };
      $$("pre", el).forEach(function (pre) { if (!$(".copy", pre)) { var c = document.createElement("button"); c.className = "copy"; c.type = "button"; c.textContent = "Copy"; c.onclick = function () { var t = pre.querySelector("code").innerText.trim(); if (navigator.clipboard) navigator.clipboard.writeText(t); c.textContent = "Copied"; }; pre.appendChild(c); } });
    }
    show("start");
  }

  // ---- search
  var index = [];
  flat.forEach(function (f) {
    index.push({ s: f.s, p: f.p, title: f.p.title, text: norm(f.p.text), anchor: "" });
    (f.p.problems || []).forEach(function (pr) { index.push({ s: f.s, p: f.p, title: pr.title, text: norm(pr.text), anchor: pr.id, problem: true }); });
  });
  var input = $("#search"), box = $("#results"), active = -1;
  function doSearch() {
    var q = norm(input.value);
    if (q.length < 2) { box.hidden = true; return; }
    var words = q.split(" ").filter(function (w) { return w.length > 1; });
    var hits = [];
    index.forEach(function (e) {
      var t = norm(e.title), score = 0, ok = words.every(function (w) { var a = t.indexOf(w) >= 0, b = e.text.indexOf(w) >= 0; if (a) score += 5; if (b) score += 1; return a || b; });
      if (t.indexOf(q) >= 0) score += 10; if (e.text.indexOf(q) >= 0) score += 4; if (e.problem) score += 1;
      if (ok) hits.push({ e: e, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    hits = hits.slice(0, 12);
    active = -1;
    box.innerHTML = hits.length ? hits.map(function (h) {
      var e = h.e, pos = e.text.indexOf(words[0]), snip = pos >= 0 ? e.text.slice(Math.max(0, pos - 50), pos + 110) : e.text.slice(0, 140);
      words.forEach(function (w) { snip = esc(snip).replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>"); });
      return '<a href="#/' + e.s.id + "/" + e.p.id + (e.anchor ? "/" + e.anchor : "") + '"><span class="rs">' + esc(e.s.title) + (e.problem ? " · " + esc(e.p.title) : "") + "</span><br>" + esc(e.title) + '<span class="rx">…' + snip + "…</span></a>";
    }).join("") : '<div class="none">No matches. Try fewer words, or part of the error message.</div>';
    box.hidden = false;
  }
  input.addEventListener("input", doSearch);
  input.addEventListener("keydown", function (ev) {
    var links = $$("a", box);
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault(); if (!links.length) return;
      active = (active + (ev.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      links.forEach(function (a, k) { a.classList.toggle("active", k === active); });
    } else if (ev.key === "Enter") {
      var a = links[active >= 0 ? active : 0]; if (a) { location.hash = a.getAttribute("href"); box.hidden = true; input.blur(); }
    } else if (ev.key === "Escape") { box.hidden = true; input.blur(); }
  });
  box.addEventListener("click", function () { box.hidden = true; });
  document.addEventListener("click", function (ev) { if (!ev.target.closest(".search")) box.hidden = true; });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") { ev.preventDefault(); input.focus(); }
  });

  // ---- theme + menu
  $("#themeBtn").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var nt = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nt);
    try { localStorage.setItem("gt-theme", nt); } catch (e) {}
  });
  $("#menuBtn").addEventListener("click", function () {
    var o = side.classList.toggle("open"); this.setAttribute("aria-expanded", o ? "true" : "false");
  });

  window.addEventListener("hashchange", route);
  route();
})();
