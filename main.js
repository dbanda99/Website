(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  const year = new Date().getFullYear();
  const copyright =
    document.getElementById("copyright");
  if (copyright) {
    copyright.textContent = `© ${year} Grace Church. All rights reserved.`;
  }

  // Mobile menu toggle
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const setMenuOpen = (open) => {
    if (!navToggle || !navMenu) return;
    navToggle.classList.toggle("is-open", open);
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      setMenuOpen(!isOpen);
    });

    navMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setMenuOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("is-open")) return;
      const inside = e.target.closest("#navMenu") || e.target.closest("#navToggle");
      if (!inside) setMenuOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });
  }

  // Smooth scroll for internal anchors
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const headerOffset = 78;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Active nav link while scrolling
  const sectionIds = ["about", "services", "ministries", "events", "give", "contact", "plan"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
    });
  };

  const getCurrentSection = () => {
    const offset = 120;
    let current = null;
    for (const s of sections) {
      const rect = s.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom >= offset) {
        current = s.id;
        break;
      }
    }
    return current;
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      const current = getCurrentSection();
      if (current) setActive(current);
      ticking = false;
    });
  }, { passive: true });

  // Contact form validation demo
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  const setError = (fieldId, msg) => {
    const small = document.querySelector(`[data-error-for="${fieldId}"]`);
    if (small) small.textContent = msg || "";
  };

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (note) note.textContent = "";

      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");

      let ok = true;

      setError("name", "");
      setError("email", "");
      setError("message", "");

      if (!name.value.trim()) {
        ok = false;
        setError("name", "Please enter your name.");
      }

      if (!email.value.trim() || !isEmail(email.value.trim())) {
        ok = false;
        setError("email", "Please enter a valid email.");
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        ok = false;
        setError("message", "Please write a short message (at least 10 characters).");
      }

      if (!ok) return;

      if (note) {
        note.textContent = "Message ready to send. Connect this form to your email or backend endpoint.";
      }

      form.reset();
    });
  }

  /* ===========================
     TOP HERO CAROUSEL (NEW)
     =========================== */
  const carousel = document.getElementById("topHeroCarousel");
  const track = document.getElementById("topHeroTrack");

  if (carousel && track) {
    const slides = Array.from(track.querySelectorAll(".top-hero-slide"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");

    // Set slide backgrounds from data-image
    slides.forEach((slide) => {
      const img = slide.getAttribute("data-image");
      if (img) slide.style.backgroundImage = `url("${img}")`;
    });

    let index = 0;
    let timer = null;

    const setSlide = (i) => {
      index = (i + slides.length) % slides.length;

      slides.forEach((s, k) => {
        const active = k === index;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", active ? "false" : "true");
      });

      dots.forEach((d, k) => {
        const active = k === index;
        d.classList.toggle("is-active", active);
        d.setAttribute("aria-pressed", active ? "true" : "false");
      });
    };

    const start = () => {
      if (prefersReducedMotion) return;
      stop();
      timer = window.setInterval(() => setSlide(index + 1), 6000);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    // Buttons
    if (prevBtn) prevBtn.addEventListener("click", () => { setSlide(index - 1); start(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { setSlide(index + 1); start(); });

    // Dots
    dots.forEach((d) => {
      d.addEventListener("click", () => {
        const i = Number(d.getAttribute("data-carousel-dot"));
        if (!Number.isNaN(i)) {
          setSlide(i);
          start();
        }
      });
    });

    // Pause on hover/focus (professional feel)
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Swipe (mobile)
    let startX = 0;
    let isDown = false;

    const onStart = (x) => { startX = x; isDown = true; };
    const onEnd = (x) => {
      if (!isDown) return;
      isDown = false;
      const delta = x - startX;
      if (Math.abs(delta) < 45) return;
      if (delta < 0) setSlide(index + 1);
      else setSlide(index - 1);
      start();
    };

    carousel.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), { passive: true });
    carousel.addEventListener("touchend", (e) => onEnd(e.changedTouches[0].clientX), { passive: true });

    // Keyboard support
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { setSlide(index - 1); start(); }
      if (e.key === "ArrowRight") { setSlide(index + 1); start(); }
    });

    // Init
    setSlide(0);
    start();
  }
})();
