import "./globals.css";
import Script from "next/script";
import { ReactNode } from "react";
import Footer from "./components/Footer";

export const metadata = {
  title: "Industrial SaaS",
  description: "Modern Equipment Monitor Dashboard for Industrial Machines",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Phosphor Icons */}
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
        {/* Three.js Script Loaders to keep EXACT identical functionality */}
        <Script src="https://unpkg.com/three@0.145.0/build/three.min.js" strategy="beforeInteractive"></Script>
        <Script src="https://unpkg.com/three@0.145.0/examples/js/controls/OrbitControls.js" strategy="beforeInteractive"></Script>
        <Script src="https://unpkg.com/three@0.145.0/examples/js/loaders/GLTFLoader.js" strategy="beforeInteractive"></Script>
        <Script src="https://unpkg.com/three@0.145.0/examples/js/loaders/DRACOLoader.js" strategy="beforeInteractive"></Script>
        {/* Meshopt Decoder for compressed GLB files */}
        <Script src="https://unpkg.com/meshoptimizer@0.18.1/meshopt_decoder.js" strategy="beforeInteractive"></Script>

        {/* Chart.js for smooth, identical graphs */}
        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive"></Script>

        {/* HTML2PDF for downloading reports */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="beforeInteractive"></Script>
      </head>
      <body suppressHydrationWarning>
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
