'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const handleMenuClick = (e) => {
      const menuContainers = document.querySelectorAll('.action-menu-container, .dropdown');

      // Handle trigger clicks
      menuContainers.forEach(container => {
        const trigger =
          container.querySelector('.action-menu-trigger, .nav-main-link') || container;

        if (trigger.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();

          const wasActive = container.classList.contains('active');
          menuContainers.forEach(c => c.classList.remove('active'));

          if (!wasActive) container.classList.add('active');
        }
      });

      // Handle outside click
      let isInsideAny = false;
      menuContainers.forEach(container => {
        if (container.contains(e.target)) isInsideAny = true;
      });

      if (!isInsideAny) {
        menuContainers.forEach(c => c.classList.remove('active'));
      }
    };

    document.addEventListener('click', handleMenuClick);
    return () => document.removeEventListener('click', handleMenuClick);
  }, []);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `
          
<!-- Left Side Panel -->
<aside class="side-track left-track">
  <div class="track-icons">
    <i class="ph ph-chat-circle-dots"></i>
    <i class="ph ph-phone"></i>
    <i class="ph ph-map-pin"></i>
  </div>
</aside>

<!-- Right Side Panel -->
<aside class="side-track right-track">
  <div class="track-icons">
    <i class="ph ph-facebook-logo"></i>
    <i class="ph ph-youtube-logo"></i>
    <i class="ph ph-instagram-logo"></i>
  </div>
</aside>

<!-- Header -->
<header class="top-bar">
  <div class="top-left">
    <a href="/" class="company">SPredict</a>
    <span class="active-link">Equipment</span>
    <span>Services</span>
    <span>Intelligence</span>
    <span>Fleet</span>
  </div>

  <div class="top-right">
    <a href="#">About</a>

    <div class="dropdown">
      <a href="#" class="nav-main-link">Features</a>
      <div class="dropdown-content">
        <a href="#">Model Ops</a>
        <a href="#">Ticket Admin</a>
        <a href="#">Noise Filter</a>
        <a href="#">Failure Patterns</a>
      </div>
    </div>

    <a href="/account">
      <i class="ph-bold ph-user"></i>
    </a>

    <button class="btn-pill">Login</button>
  </div>
</header>

<!-- Main Content -->
<main class="center-area">

  <!-- Hero -->
  <section class="hero-section">
    <div class="hero-text">
      <h1>Shot blasting machine</h1>
      <p>
        Advanced surface preparation technology for industrial-grade metal cleaning.
      </p>
    </div>
  </section>

  <!-- Workflow Diagram -->
  <section class="workflow-card">
    <h2>IoT System Architecture — Data Flow</h2>
    <div style="overflow-x:auto;">
      <svg width="100%" viewBox="0 0 980 580">
        <text x="50%" y="50%" text-anchor="middle" font-size="18">
          (Workflow Diagram Loaded Successfully)
        </text>
      </svg>
    </div>
  </section>

</main>

          `,
        }}
      />
    </>
  );
}