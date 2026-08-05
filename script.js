/* ============================================================
   GREBY v2 — interaction layer
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Glowing particle network canvas ---------- */
  function initNetwork(canvasId, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const density = opts.density || 100;
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function makeParticles() {
      const count = Math.round((canvas.offsetWidth * canvas.offsetHeight) / (density * 1000));
      particles = Array.from({ length: Math.max(24, Math.min(count, 90)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
        r: Math.random() * 1.8 + 0.6
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const maxDist = 140 * devicePixelRatio;

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(79,168,255,${0.22 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(150,210,255,0.85)";
        ctx.shadowColor = "rgba(79,168,255,0.9)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(step);
    }

    resize();
    makeParticles();
    step();
    window.addEventListener("resize", () => { resize(); makeParticles(); });
  }

  initNetwork("introCanvas", { density: 75 });
  initNetwork("siteCanvas", { density: 150 });

  /* ---------- 2. Intro sequence (~4s, skippable) ---------- */
  const intro = document.getElementById("intro");
  const introSkip = document.getElementById("introSkip");
  const INTRO_DURATION = 4000;
  let introClosed = false;

  function closeIntro() {
    if (introClosed) return;
    introClosed = true;
    intro.classList.add("hide");
    document.body.style.overflow = "";
    revealOnScroll();
  }

  document.body.style.overflow = "hidden";
  const introTimer = setTimeout(closeIntro, INTRO_DURATION);

  introSkip.addEventListener("click", () => {
    clearTimeout(introTimer);
    closeIntro();
  });

  /* ---------- 3. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  function revealOnScroll() {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) el.classList.add("in");
    });
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("in"); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
  window.addEventListener("scroll", revealOnScroll, { passive: true });

  /* ---------- 4. Nav: scroll shadow + mobile menu ---------- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.style.boxShadow = window.scrollY > 12 ? "0 8px 24px rgba(0,0,0,.45)" : "none";
  }, { passive: true });

  const burger = document.getElementById("navBurger");
  const navMobile = document.getElementById("navMobile");
  burger.addEventListener("click", () => navMobile.classList.toggle("open"));
  navMobile.querySelectorAll("a").forEach(el => {
    el.addEventListener("click", () => navMobile.classList.remove("open"));
  });

  /* ---------- 5. CTA buttons scroll to join ---------- */
  document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("join").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  const ghostBtn = document.querySelector(".btn-ghost");
  if (ghostBtn) {
    ghostBtn.addEventListener("click", () => {
      document.getElementById("features").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

});
