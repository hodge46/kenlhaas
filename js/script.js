/* =========================================================
   Kenny Haas — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("mainNav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a")) : [];

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header shadow on scroll ---- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- On-load intro: header, hero, then the About section, all staggered ---- */
  var introSteps = [
    [header, 0],
    [document.querySelector(".hero .hero-bg"), 0.04],
    [document.querySelector(".hero .eyebrow"), 0.05],
    [document.querySelector(".hero .hero-name"), 0.13],
    [document.querySelector(".hero .hero-roles"), 0.21],
    [document.querySelector(".hero .hero-status"), 0.29],
    [document.querySelector("#about .section-head"), 0.4],
    [document.querySelector(".about-photo"), 0.44],
    [document.querySelector(".about-body"), 0.44],
    // case-study pages: the .cs-hero block gets the same staggered intro
    [document.querySelector(".cs-hero .hero-bg"), 0.04],
    [document.querySelector(".cs-hero .cs-back"), 0.04],
    [document.querySelector(".cs-hero .cs-eyebrow"), 0.08],
    [document.querySelector(".cs-hero h1"), 0.14],
    [document.querySelector(".cs-hero .cs-lede"), 0.22],
    [document.querySelector(".cs-hero .cs-meta"), 0.3],
    [document.querySelector(".cs-hero .cs-cta"), 0.37]
  ].filter(function (s) { return s[0]; });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      introSteps.forEach(function (s) {
        s[0].style.transitionDelay = s[1] + "s";
        s[0].classList.add("intro-in");
      });
      window.setTimeout(function () {
        introSteps.forEach(function (s) { s[0].style.transitionDelay = ""; });
      }, 2400);
    });
  });

  /* ---- Dark / light theme toggle ---- */
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    var root = document.documentElement;
    var darkMq = window.matchMedia("(prefers-color-scheme: dark)");
    var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    var currentTheme = function () {
      return root.getAttribute("data-theme") || (darkMq.matches ? "dark" : "light");
    };
    var applyTheme = function (t, persist) {
      root.setAttribute("data-theme", t);
      themeToggle.setAttribute(
        "aria-label",
        t === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      if (persist) {
        try { localStorage.setItem("theme", t); } catch (e) {}
      }
    };

    applyTheme(currentTheme(), false); // sync the aria-label with the pre-paint choice

    themeToggle.addEventListener("click", function () {
      if (!reduceMq.matches) {
        root.classList.add("theme-anim");
        window.setTimeout(function () { root.classList.remove("theme-anim"); }, 340);
      }
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });

    // follow the OS setting only until the user picks a theme themselves
    darkMq.addEventListener("change", function (e) {
      var saved = null;
      try { saved = localStorage.getItem("theme"); } catch (err) {}
      if (saved !== "light" && saved !== "dark") {
        applyTheme(e.matches ? "dark" : "light", false);
      }
    });
  }

  /* ---- Mobile nav toggle ---- */
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Active nav link on scroll ---- */
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" && id.length > 1
        ? document.querySelector(id)
        : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Scroll reveal (About, Projects, Contact are handled separately) ---- */
  var revealTargets = Array.prototype.filter.call(
    document.querySelectorAll(
      ".about-grid, .project-card, .contact-item, .contact-intro, .contact-resume, .tl-item, .tl-resume, .tl-education, .section-head, .site-footer"
    ),
    function (el) {
      return !el.closest("#about") &&
        !el.classList.contains("project-card") &&
        !el.classList.contains("contact-item");
    }
  );
  Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    Array.prototype.forEach.call(revealTargets, function (el) { revealObserver.observe(el); });
  } else {
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Project cards: stagger reveal (left-to-right per row) when scrolled into view ---- */
  var projectCards = document.querySelectorAll(".project-card");
  Array.prototype.forEach.call(projectCards, function (card, i) {
    card.classList.add("reveal");
    card.style.transitionDelay = ((i % 3) * 0.16).toFixed(2) + "s";
  });

  if ("IntersectionObserver" in window && projectCards.length) {
    var cardObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add("is-visible");
            obs.unobserve(el);
            // drop the stagger delay once revealed so hover stays snappy
            window.setTimeout(function () { el.style.transitionDelay = ""; }, 1300);
          }
        });
      },
      { threshold: 0.15 }
    );
    Array.prototype.forEach.call(projectCards, function (card) { cardObserver.observe(card); });
  } else {
    Array.prototype.forEach.call(projectCards, function (card) {
      card.classList.add("is-visible");
      card.style.transitionDelay = "";
    });
  }

  /* ---- Fade project screenshots in once they decode ---- */
  Array.prototype.forEach.call(
    document.querySelectorAll(".project-thumb img"),
    function (img) {
      var done = function () { img.classList.add("is-loaded"); };
      if (img.complete && img.naturalWidth > 0) {
        done();
      } else {
        img.addEventListener("load", done);
        img.addEventListener("error", done);
      }
    }
  );

  /* ---- Core Skills chips: reveal + cascade when scrolled into view ---- */
  var skillChips = document.querySelectorAll(".skills-list li");
  Array.prototype.forEach.call(skillChips, function (li, i) {
    li.classList.add("chip-reveal");
    li.style.transitionDelay = (i * 0.025).toFixed(3) + "s";
  });

  if ("IntersectionObserver" in window && skillChips.length) {
    var chipObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    Array.prototype.forEach.call(skillChips, function (li) { chipObserver.observe(li); });
  } else {
    Array.prototype.forEach.call(skillChips, function (li) { li.classList.add("is-visible"); });
  }

  /* ---- Contact cards: stagger reveal when scrolled into view ---- */
  var contactItems = document.querySelectorAll(".contact-item");
  Array.prototype.forEach.call(contactItems, function (item, i) {
    item.classList.add("reveal");
    item.style.transitionDelay = (i * 0.12).toFixed(2) + "s";
  });

  if ("IntersectionObserver" in window && contactItems.length) {
    var contactObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add("is-visible");
            obs.unobserve(el);
            window.setTimeout(function () { el.style.transitionDelay = ""; }, 1000);
          }
        });
      },
      { threshold: 0.15 }
    );
    Array.prototype.forEach.call(contactItems, function (item) { contactObserver.observe(item); });
  } else {
    Array.prototype.forEach.call(contactItems, function (item) {
      item.classList.add("is-visible");
      item.style.transitionDelay = "";
    });
  }

  /* ---- Testimonials: stagger reveal when scrolled into view ---- */
  var quoteCards = document.querySelectorAll(".quote-card");
  Array.prototype.forEach.call(quoteCards, function (card, i) {
    card.classList.add("reveal");
    card.style.transitionDelay = (i * 0.12).toFixed(2) + "s";
  });

  if ("IntersectionObserver" in window && quoteCards.length) {
    var quoteObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add("is-visible");
            obs.unobserve(el);
            window.setTimeout(function () { el.style.transitionDelay = ""; }, 1000);
          }
        });
      },
      { threshold: 0.15 }
    );
    Array.prototype.forEach.call(quoteCards, function (card) { quoteObserver.observe(card); });
  } else {
    Array.prototype.forEach.call(quoteCards, function (card) {
      card.classList.add("is-visible");
      card.style.transitionDelay = "";
    });
  }

  /* ---- Parallax drift + slow rotation on the decorative shapes ---- */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var parallaxItems = [
      { el: document.querySelector(".hero-deco"), factor: 0.28, spin: 0.025, cap: 220 },
      { el: document.querySelector(".dot-grid-hero"), factor: 0.42, spin: 0, cap: 200 },
      { el: document.querySelector(".dot-grid-photo"), factor: 0.1, spin: 0, cap: 50 },
      { el: document.querySelector(".projects-deco"), factor: 0.22, spin: 0.02, cap: 190 },
      { el: document.querySelector(".contact-deco"), factor: 0.28, spin: 0.025, cap: 220 },
      { el: document.querySelector(".dot-grid-contact"), factor: 0.42, spin: 0, cap: 200 }
    ].filter(function (p) { return p.el; });

    if (parallaxItems.length) {
      var measure = function (p) {
        var prev = p.el.style.transform;
        p.el.style.transform = "none";
        var rect = p.el.getBoundingClientRect();
        var centerY = rect.top + window.scrollY + rect.height / 2;
        // zero offset when this shape's section sits nicely in view
        p.anchor = Math.max(0, centerY - window.innerHeight * 0.65);
        p.el.style.transform = prev;
      };
      parallaxItems.forEach(function (p) {
        p.el.style.willChange = "transform";
        measure(p);
      });

      var clamp = function (v, lim) { return v > lim ? lim : v < -lim ? -lim : v; };
      var parallaxTicking = false;
      var updateParallax = function () {
        var y = window.scrollY;
        parallaxItems.forEach(function (p) {
          var d = y - p.anchor;
          var shift = clamp(d * p.factor, p.cap);
          var rot = p.spin ? clamp(d * p.spin, 8) : 0;
          p.el.style.transform =
            "translate3d(0," + shift.toFixed(1) + "px,0)" +
            (rot ? " rotate(" + rot.toFixed(2) + "deg)" : "");
        });
        parallaxTicking = false;
      };
      var onParallaxScroll = function () {
        if (!parallaxTicking) {
          parallaxTicking = true;
          window.requestAnimationFrame(updateParallax);
        }
      };

      updateParallax();
      window.addEventListener("scroll", onParallaxScroll, { passive: true });
      window.addEventListener("resize", function () {
        parallaxItems.forEach(measure);
        updateParallax();
      }, { passive: true });
    }
  }

  /* ---- In-page PDF viewer ---- */
  var pdfModal = document.getElementById("pdfModal");
  if (pdfModal) {
    var pdfFrame = document.getElementById("pdfModalFrame");
    var pdfTitle = document.getElementById("pdfModalTitle");
    var pdfOpen = document.getElementById("pdfModalOpen");
    var pdfCloseBtn = document.getElementById("pdfModalClose");
    var pdfTrigger = null;
    var pdfClearTimer = null;

    // iOS / iPadOS cannot render a PDF inside an <iframe>; let those open normally.
    var isIOS =
      /iP(hone|ad|od)/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    function pdfTitleFor(link) {
      var card = link.closest(".project-card");
      if (card && card.querySelector("h3")) {
        return card.querySelector("h3").textContent.trim() + " — Case Study";
      }
      if (link.getAttribute("href").indexOf("resume") !== -1) return "Résumé — Kenny Haas";
      return "Document";
    }

    function pdfKeydown(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closePdf();
        return;
      }
      if (e.key === "Tab") {
        var order = [pdfOpen, pdfCloseBtn];
        var i = order.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); order[order.length - 1].focus(); }
        else if (!e.shiftKey && i === order.length - 1) { e.preventDefault(); order[0].focus(); }
      }
    }

    function openPdf(url, title, trigger) {
      window.clearTimeout(pdfClearTimer);
      pdfTrigger = trigger || null;
      pdfTitle.textContent = title;
      pdfOpen.href = url;
      pdfFrame.src = url + (url.indexOf("#") === -1 ? "#view=FitH" : "");
      pdfModal.classList.add("is-open");
      pdfModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("pdf-open");
      document.addEventListener("keydown", pdfKeydown);
      pdfCloseBtn.focus();
    }

    function closePdf() {
      pdfModal.classList.remove("is-open");
      pdfModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("pdf-open");
      document.removeEventListener("keydown", pdfKeydown);
      pdfClearTimer = window.setTimeout(function () {
        if (!pdfModal.classList.contains("is-open")) pdfFrame.src = "about:blank";
      }, 250);
      if (pdfTrigger && typeof pdfTrigger.focus === "function") pdfTrigger.focus();
      pdfTrigger = null;
    }

    pdfCloseBtn.addEventListener("click", closePdf);
    pdfModal.addEventListener("click", function (e) {
      if (e.target === pdfModal) closePdf();
    });

    Array.prototype.forEach.call(
      document.querySelectorAll('a[href$=".pdf"]'),
      function (link) {
        link.addEventListener("click", function (e) {
          if (isIOS) return; // fall back to the link's normal new-tab behavior
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          openPdf(link.getAttribute("href"), pdfTitleFor(link), link);
        });
      }
    );
  }
})();
