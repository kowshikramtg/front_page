'use client';

import Link from "next/link";
import styles from "./landing.module.css";
import Script from "next/script";
import Landing3D from "./Landing3D";
import { useEffect, useRef } from "react";

function WorkflowDiagram() {
  return (
    <section className={styles.workflowSection}>
      <div className={styles.workflowContent}>
        <div className={styles.workflowSvgWrapper}>
          <svg viewBox="0 0 980 580" xmlns="http://www.w3.org/2000/svg" className={styles.workflowSvg}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
              <path id="flowSensorToEsp" d="M152 171 L208 219" fill="none" />
              <path id="flowSensorToEsp2" d="M152 233 L208 245" fill="none" />
              <path id="flowSensorToEsp3" d="M152 295 L208 271" fill="none" />
              <path id="flowSensorToEsp4" d="M152 355 L208 315" fill="none" />
              <path id="flowEspToPi" d="M332 238 L386 238" fill="none" />
              <path id="flowPiToXgboost" d="M570 164 L656 164" fill="none" />
              <path id="flowJetsonToDc" d="M656 184 L570 184" fill="none" />
              <path id="flowDcToFrontend" d="M478 190 L478 210" fill="none" />
              <path id="flowFrontendToScreen" d="M478 266 L478 402" fill="none" />
              <path id="flowLstmToXgboost" d="M744 280 L744 190" fill="none" />
              <style>{`
                .node-g:hover rect { opacity: 0.85; }
                .pkt { opacity: 0.85; }
                @keyframes pkt { 0%{opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{opacity:0} }
              `}</style>
            </defs>

            <rect x="16" y="122" width="148" height="276" rx="26" fill="none" stroke="#111827" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.8" />
            <text x="90" y="110" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" letterSpacing="0.08em" opacity="0.95">SENSORS</text>

            <rect x="378" y="120" width="196" height="168" rx="24" fill="none" stroke="#111827" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.8" />
            <text x="476" y="110" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" letterSpacing="0.08em" opacity="0.95">RASPBERRY PI</text>

            <rect x="650" y="120" width="210" height="248" rx="24" fill="none" stroke="#111827" strokeWidth="1.2" strokeDasharray="8 6" opacity="0.8" />
            <text x="755" y="110" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" letterSpacing="0.08em" opacity="0.95">JETSON NANO</text>

            <g className="node-g">
              <rect x="24" y="134" width="128" height="40" rx="6" fill="#062611" stroke="#2ea043" strokeWidth="0.6" />
              <text x="88" y="155" textAnchor="middle" dominantBaseline="central" fontSize="12.5" fontWeight="600" fill="#3fb950">MPU6050</text>
            </g>
            <g className="node-g">
              <rect x="24" y="196" width="128" height="40" rx="6" fill="#062611" stroke="#2ea043" strokeWidth="0.6" />
              <text x="88" y="217" textAnchor="middle" dominantBaseline="central" fontSize="12.5" fontWeight="600" fill="#3fb950">Flame sensor</text>
            </g>
            <g className="node-g">
              <rect x="24" y="258" width="128" height="40" rx="6" fill="#062611" stroke="#2ea043" strokeWidth="0.6" />
              <text x="88" y="279" textAnchor="middle" dominantBaseline="central" fontSize="12.5" fontWeight="600" fill="#3fb950">TCRT5000</text>
            </g>
            <g className="node-g">
              <rect x="24" y="320" width="128" height="40" rx="6" fill="#062611" stroke="#2ea043" strokeWidth="0.6" />
              <text x="88" y="341" textAnchor="middle" dominantBaseline="central" fontSize="12.5" fontWeight="600" fill="#3fb950">DHT22</text>
            </g>

            <g className="node-g">
              <rect x="208" y="210" width="124" height="58" rx="14" fill="#392a03" stroke="#f6b03b" strokeWidth="0.9" />
              <text x="270" y="243" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="700" fill="#f4cc6a">ESP32</text>
            </g>

            <g className="node-g">
              <rect x="386" y="134" width="184" height="56" rx="12" fill="#110f2d" stroke="#a78bfa" strokeWidth="0.8" />
              <text x="478" y="162" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#c4b5fd">Data centre</text>
            </g>
            <g className="node-g">
              <rect x="386" y="210" width="184" height="56" rx="12" fill="#110f2d" stroke="#a78bfa" strokeWidth="0.8" />
              <text x="478" y="238" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#c4b5fd">Frontend</text>
            </g>

            <g className="node-g">
              <rect x="656" y="134" width="176" height="56" rx="12" fill="#062f51" stroke="#1d4ed8" strokeWidth="0.7" />
              <text x="744" y="162" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#9ad0ff">XGBoost</text>
            </g>
            <g className="node-g">
              <rect x="656" y="280" width="176" height="56" rx="12" fill="#062f51" stroke="#1d4ed8" strokeWidth="0.7" />
              <text x="744" y="308" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#9ad0ff">LSTM</text>
            </g>

            <path d="M152 171 L208 219" stroke="#2ea043" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.8" />
            <path d="M152 233 L208 245" stroke="#2ea043" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.8" />
            <path d="M152 295 L208 271" stroke="#2ea043" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.8" />
            <path d="M152 355 L208 315" stroke="#2ea043" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.8" />

            <path d="M332 238 L386 238" stroke="#f6b03b" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.85" />
            <path d="M478 190 L478 210" stroke="#c7d2fe" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.85" />
            <path d="M570 164 L656 164" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.85" />
            <path id="flowFrontendToScreen" d="M478 266 L478 402" stroke="#f47067" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.9" />
            <path d="M656 184 L570 184" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.85" />
            <path d="M744 280 L744 190" stroke="#f47067" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.9" />
            <text x="754" y="236" textAnchor="start" fontSize="10" fill="#c7d2fe" opacity="0.95">backend</text>

            <g className="node-g">
              <rect x="386" y="402" width="194" height="56" rx="12" fill="#2b0f0f" stroke="#e11d48" strokeWidth="0.9" />
              <text x="483" y="430" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" fill="#ffa198">Raspberry Pi screen</text>
            </g>
            <path d="M478 266 L478 402" stroke="#f47067" strokeWidth="2" markerEnd="url(#arrow)" opacity="0.9" />

            <rect x="12" y="440" width="168" height="124" rx="14" fill="#0f1720" stroke="#30363d" strokeWidth="0.7" />
            <text x="96" y="459" textAnchor="middle" fontSize="10" fill="#8b949e" letterSpacing="0.06em">LEGEND</text>
            <circle cx="30" cy="476" r="4" fill="#2ea043" />
            <text x="42" y="480" fontSize="11" fill="#8b949e">Sensor data</text>
            <circle cx="30" cy="496" r="4" fill="#f6b03b" />
            <text x="42" y="500" fontSize="11" fill="#8b949e">Aggregated stream</text>
            <circle cx="30" cy="516" r="4" fill="#60a5fa" />
            <text x="42" y="520" fontSize="11" fill="#8b949e">To Jetson</text>
            <circle cx="30" cy="536" r="4" fill="#f47067" />
            <text x="42" y="540" fontSize="11" fill="#8b949e">Model results</text>

            <circle r="4" fill="#2ea043" className="pkt">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"><mpath href="#flowSensorToEsp" /></animateMotion>
            </circle>
            <circle r="4" fill="#2ea043" className="pkt">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.4s"><mpath href="#flowSensorToEsp2" /></animateMotion>
            </circle>
            <circle r="4" fill="#2ea043" className="pkt">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.8s"><mpath href="#flowSensorToEsp3" /></animateMotion>
            </circle>
            <circle r="4" fill="#2ea043" className="pkt">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.2s"><mpath href="#flowSensorToEsp4" /></animateMotion>
            </circle>
            <circle r="4" fill="#f6b03b" className="pkt">
              <animateMotion dur="2s" repeatCount="indefinite" begin="0.2s"><mpath href="#flowEspToPi" /></animateMotion>
            </circle>
            <circle r="4" fill="#60a5fa" className="pkt">
              <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s"><mpath href="#flowPiToXgboost" /></animateMotion>
            </circle>
            <circle r="4" fill="#60a5fa" className="pkt">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.3s"><mpath href="#flowDcToFrontend" /></animateMotion>
            </circle>
            <circle r="4" fill="#f47067" className="pkt">
              <animateMotion dur="2s" repeatCount="indefinite" begin="0.4s"><mpath href="#flowFrontendToScreen" /></animateMotion>
            </circle>
            <circle r="4" fill="#60a5fa" className="pkt">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.6s"><mpath href="#flowJetsonToDc" /></animateMotion>
            </circle>
            <circle r="4" fill="#f47067" className="pkt">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.7s"><mpath href="#flowLstmToXgboost" /></animateMotion>
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
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
          {[...Array(20)].map((_, i) => (
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

        <WorkflowDiagram />

        <div style={{ height: '6rem', width: '100%' }} />
      </div>
    </>
  );
}
