# Delta Emulator UI Designer

This is a web-based editor/designer for [Delta](https://github.com/rileytestut/Delta) emulator, built with [Next.js](https://nextjs.org/). It is capable of directly loading/exporting .deltaskin files, as well as loading the info.json and assets separately which can be useful in developing and packaging a skin. Additionally, thank you to noah978 and others for documentation on the skin making process, available [here](https://noah978.gitbook.io/delta-docs/skins).

An instance is available for use [here](https://pseudo.tokyo/deltaemu).

## Major Dependencies

-   [PDF.js](https://mozilla.github.io/pdf.js/) to render PDFs to images
-   [ZIP.js](https://gildas-lormeau.github.io/zip.js/) to zip/unzip skin files
-   [SVG Repo](https://www.svgrepo.com) for icons

## Getting Started

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

## Known Issues

-   The previous skin's asset may override the current skin if it is still being rendered when a new skin is loaded.
-   Some input fields reformat the contents while still typing.
-   Global padding does not work yet. Only element-level padding will be exported correctly.
-   Background may not render exactly as in the app yet, but should be acceptable if using a resizable background, or correctly sized PNGs.
-   Touchscreen pan/zoom doesn't work correctly if the first touch is on an element instead of the background.
