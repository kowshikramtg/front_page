import "./globals.css";
import Script from "next/script";
import { ReactNode } from "react";

export const metadata = {
  title: "Equipment Monitor | Industrial SaaS",
  description: "Modern Equipment Monitor Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
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

        {/* Chart.js for smooth, identical graphs */}
        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive"></Script>

        {/* HTML2PDF for downloading reports */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="beforeInteractive"></Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
