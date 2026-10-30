/* Progressive enhancement for the landing page. No framework, no dependencies.
   - Scroll reveals for the sections below the hero.
   - A quiet "Listen" shortcut that appears once the hero has scrolled away.
   The page is complete and usable without this file: every link and all copy are plain HTML.

   It starts after the first two animation frames, so the browser paints the page before this script
   measures anything. Measuring positions during parsing forced a synchronous layout that showed up as
   about 200 ms of blocking time in mobile Lighthouse runs. */
(function () {
  requestAnimationFrame(function () {
    requestAnimationFrame(init);
  });

  function init() {
    var root = document.documentElement;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hidden states only exist once this script is running, so a failed load can never hide content.
    root.classList.add("js");

    // Reveal each element once its top has risen above 88% of the screen. Position-based, so a fast
    // flick or an anchor jump can never leave something hidden. The first pass uses the full screen,
    // so anything already visible when this starts stays visible and never flickers.
    var pending = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    function reveal(factor) {
      var limit = window.innerHeight * factor;
      pending = pending.filter(function (el) {
        if (reduced || el.getBoundingClientRect().top < limit) {
          el.setAttribute("data-in", "true");
          return false;
        }
        return true;
      });
    }
    var queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        reveal(0.88);
      });
    }
    reveal(1);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // The shortcut is only useful away from the places that already show the listening links.
    var pill = document.querySelector(".pill");
    if (pill && "IntersectionObserver" in window) {
      var zones = ["top", "listen", "closing"].map(function (id) { return document.getElementById(id); });
      var visible = [true, false, false];
      var watcher = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var i = zones.indexOf(e.target);
          if (i > -1) visible[i] = e.isIntersecting;
        });
        var show = !visible.some(Boolean);
        pill.setAttribute("data-show", show ? "true" : "false");
        pill.setAttribute("aria-hidden", show ? "false" : "true");
        pill.tabIndex = show ? 0 : -1;
      });
      zones.forEach(function (el) { if (el) watcher.observe(el); });
    }
  }
})();
