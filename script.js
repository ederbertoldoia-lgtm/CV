(() => {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const progress = document.querySelector(".scroll-progress");

  /* Menu mobile */
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Nav + barra de scroll */
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 48);

    if (progress) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = `${pct}%`;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  const langItems = document.querySelectorAll(".lang-item");

  langItems.forEach((item) => {
    const level = item.dataset.level || "0";
    item.style.setProperty("--level", `${level}%`);
  });

  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => revealObs.observe(el));

    const langObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            langObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    langItems.forEach((el) => langObs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
    langItems.forEach((el) => el.classList.add("in-view"));
  }

  /* Highlight do link ativo na nav */
  const sections = document.querySelectorAll("section[id], header[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if ("IntersectionObserver" in window && navAnchors.length) {
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => sectionObs.observe(s));
  }

  /* Partículas flutuantes no fundo */
  const canvas = document.getElementById("bgParticles");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(48, Math.floor((w * h) / 28000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.4,
        vx: -0.25 + Math.random() * 0.5,
        vy: -0.35 + Math.random() * -0.15,
        a: 0.15 + Math.random() * 0.35,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 230, 210, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener(
      "beforeunload",
      () => cancelAnimationFrame(raf),
      { once: true }
    );
  }
})();
