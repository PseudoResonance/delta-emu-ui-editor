# Delta Emulator UI Designer

This is a web-based editor/designer for [Delta](https://github.com/rileytestut/Delta) emulator, built with [Next.js](https://nextjs.org/). It is capable of directly loading/exporting .deltaskin files, as well as loading the info.json and assets separately which is useful in developing and packaging a skin.

## Major Dependencies

-   [PDF.js](https://mozilla.github.io/pdf.js/) to render PDFs to images
-   [ZIP.js](https://gildas-lormeau.github.io/zip.js/) to zip/unzip skin files
-   [SVG Repo](https://www.svgrepo.com) for icons

## Getting Started

First, copy PDF.js from `node_modules/pdfjs-dist/build/pdf.worker.min.js` to `public/pdf.worker.min.js`

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
