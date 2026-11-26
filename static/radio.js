// Live listener bar for the splatterbox.us Icecast server (WBCQ and friends).
// On HTTPS we go through the same-origin Vercel rewrite (/radio/status.json),
// because the Icecast server only speaks HTTP and browsers block mixed content.
(function () {
  var bar = document.getElementById("radio-bar");
  if (!bar) return;

  var SOURCE = location.protocol === "https:"
    ? "/radio/status.json"
    : "http://splatterbox.us/status-json.xsl";
  var REFRESH_MS = 30000;

  var totalEl = bar.querySelector(".radio-total");
  var trackEl = bar.querySelector(".radio-track");
  var listEl = bar.querySelector(".radio-list");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function clean(v) {
    return v && v !== "(NULL)" && v !== "url" ? String(v) : "";
  }

  function render(sources) {
    var streams = sources
      .map(function (s) {
        var mount = (s.listenurl || "").split("/").pop();
        return {
          name: clean(s.server_name) || mount || "stream",
          listeners: Number(s.listeners) || 0,
          peak: Number(s.listener_peak) || 0,
          url: (s.listenurl || "").replace(":80/", "/"),
          wbcq: /wbcq/i.test(mount),
        };
      })
      .sort(function (a, b) {
        return (b.wbcq - a.wbcq) || (b.listeners - a.listeners);
      });

    var total = streams.reduce(function (n, s) { return n + s.listeners; }, 0);
    totalEl.textContent = total + " listening on " + streams.length + " streams";

    trackEl.replaceChildren();
    listEl.replaceChildren();

    streams.forEach(function (s, i) {
      var seg = el("span", "radio-seg" + (s.wbcq ? " is-wbcq" : ""));
      seg.style.flexGrow = String(Math.max(s.listeners, 0.5));
      seg.style.setProperty("--shade", String(1 - Math.min(i, 5) * 0.15));
      seg.title = s.name + ": " + s.listeners + " listeners";
      trackEl.appendChild(seg);

      var item = el("li", s.wbcq ? "is-wbcq" : "");
      var link = el("a", null, s.name);
      link.href = s.url;
      link.target = "_blank";
      link.rel = "noopener";
      item.appendChild(link);
      item.appendChild(el("span", "radio-count", " " + s.listeners));
      item.title = "Peak " + s.peak;
      listEl.appendChild(item);
    });

    bar.hidden = false;
  }

  function load() {
    fetch(SOURCE, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(function (data) {
        var src = data && data.icestats && data.icestats.source;
        if (!src) throw new Error("no sources");
        render(Array.isArray(src) ? src : [src]);
      })
      .catch(function () {
        bar.hidden = true;
      });
  }

  load();
  setInterval(function () {
    if (!document.hidden) load();
  }, REFRESH_MS);
})();
