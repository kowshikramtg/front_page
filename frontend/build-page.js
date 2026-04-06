const fs = require('fs');

const htmlContent = fs.readFileSync('../index.html', 'utf8');

// Use a regex to extract content inside the <body> tag, ignoring <script> tags or we can keep them!
// We'll just grab the <body>
let bodyContent = htmlContent;
const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
    bodyContent = bodyMatch[1];
}

const pageCode = `
'use client';
import { useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(bodyContent)} }} />
      <Script src="/three-app.js" strategy="lazyOnload" />
      <Script src="/app.js" strategy="lazyOnload" />
    </>
  );
}
`;

fs.writeFileSync('app/page.tsx', pageCode);
console.log('page.tsx successfully generated.');
