'use client';

import Link from "next/link";
import styles from "./landing.module.css";
import Script from "next/script";
import Landing3D from "./Landing3D";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic Mouse Glow Interactivity
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        // Offset by half of glow width/height (200px)
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Toggle body class for conditional padding (no footer gap on landing)
    document.body.classList.add("landing-page");

    setHasMounted(true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove("landing-page");
    };
  }, []);

  return (
    <>
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />

      {/* Dynamic Cursor Glow */}
      <div ref={glowRef} className={styles.mouseGlow} />

      <div className={styles.pageContainer}>
        {/* Unique Background Grid */}
        <div className={styles.perspectiveGrid} />

        {/* Continuous Active Data Streams */}
        <div className={styles.dataLayer}>
          {hasMounted && [...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.dataLine}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className={styles.contentWrapper}>

          {/* Two-Column Hero with 3D Element */}
          <div className={styles.heroSection}>
            <div className={styles.heroTextContent}>

              <h1 className={styles.heroTitle}>
                Powering <br /> <span>Your Digital Factory</span>
              </h1>

              <p className={styles.heroSubtitle}>
                A scalable, AI-Driven Universal Predictive Maintainance Platform to Monitor Diverse Industrial Machines, Predict Failures, Provide Actionable Insights, and Estimate Business Impact.
              </p>

              <div className={styles.ctaWrapper}>
                <Link href="/dashboard" className={styles.ctaButton}>
                  EXPLORE ASSETS <i className="ph-bold ph-arrow-right"></i>
                </Link>
              </div>
            </div>

            <div className={styles.hero3DContainer}>
              {/* Massive 3D Abstract Animation */}
              <Landing3D />
            </div>
          </div>
        </div>

        {/* Seamless Infinite Marquee with fixed colors */}
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeContent}>
            <span><i className="ph-bold "></i> KALMAN FILTERING</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> SHAP EXPLAINABILITY</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> PREDICTIVE MAINTENANCE</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> ZERO-LATENCY TWINS</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> XAI PATTERN MINING</span>
            {/* Duplication for seamless scroll */}
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> KALMAN FILTERING</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> SHAP EXPLAINABILITY</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> PREDICTIVE MAINTENANCE</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> ZERO-LATENCY TWINS</span>
            <span><i className="ph-bold "></i> | </span>
            <span><i className="ph-bold "></i> XAI PATTERN MINING</span>
            <span><i className="ph-bold "></i> | </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className={styles.contentWrapper} style={{ paddingTop: 0 }}>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              {/* <div className={styles.featureIcon}>
                <i className="ph-bold ph-cube"></i>
              </div> */}
              <h3 className={styles.featureTitle}>PREDICT</h3>
              <p className={styles.featureDesc}>
                Detects anamoly in real time and predicts failures before they happen.
                No more failures at <span style={{ color: "#451a03", fontWeight: "semibold" }}>Peak time</span>, no more downtime, no more losses.
              </p>
            </div>

            <div className={styles.featureCard}>
              {/* <div className={styles.featureIcon}>
                <i className="ph-bold ph-chart-line-up"></i>
              </div> */}
              <h3 className={styles.featureTitle}>PREVENT</h3>
              <p className={styles.featureDesc}>
                Prevents from failures by providing real-time anomaly scoring, model drift detection, and advanced <span style={{ color: "#451a03", fontWeight: "semibold" }}>Kalman Filter</span> smoothing at your fingertips. Preventing to put loots of money in reapairs after distruction.
              </p>
            </div>

            <div className={styles.featureCard}>
              {/* <div className={styles.featureIcon}>
                <i className="ph-bold ph-lightning"></i>
              </div> */}
              <h3 className={styles.featureTitle}>PERFORM</h3>
              <p className={styles.featureDesc}>
                Smooth Performance Monitoring and Optimization at your fingertips, with the help of Model Drift Detection.
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
