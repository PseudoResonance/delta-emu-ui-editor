# Delta Emulator UI Designer

This is a web-based editor/designer for [Delta emulator](https://github.com/rileytestut/Delta) skins, built with [Next.js](https://nextjs.org/). It is capable of directly loading/exporting .deltaskin files, as well as loading the info.json and assets separately which can be useful in developing and packaging a skin. Additionally, thank you to noah978 and others for [documentation on the skin making process](https://noah978.gitbook.io/delta-docs/skins).

An instance is [available for use here](https://pseudo.tokyo/deltaemu).

The editor supports touchscreen devices, but it is generally recommended to use a mouse or pen. Additionally, larger screens, such as a desktop or tablet, will be more convenient to work on. There is also some screen reader/ARIA support, full keyboard navigation and common keyboard shortcuts. Check the menu under Help -> Controls for more information.

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

-   State will be lost when the page is reloaded.
-   Some input fields reformat the contents while still typing.
-   Background may not render exactly as in the app yet, but should be acceptable if using a resizable background, or correctly sized PNGs.
-   Touchscreen pan/zoom doesn't work correctly if the first touch is on an element instead of the background.
