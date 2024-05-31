"use client";
import { AssetType } from "@/data/types";
import { pdfjs } from "react-pdf";

const readFileData = (file: File) => {
	return new Promise<string | ArrayBuffer>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target && e.target.result) resolve(e.target.result);
			else reject("Missing target");
		};
		reader.onerror = (err) => {
			reject(err);
		};
		reader.readAsDataURL(file);
	});
};

const convertPdfToImage: (file: File) => Promise<{
	height: number;
	type: AssetType;
	url: string;
	width: number;
}> = async (file: File) => {
	pdfjs.GlobalWorkerOptions.workerSrc = new URL(
		"pdfjs-dist/build/pdf.worker.min.js",
		import.meta.url,
	).toString();
	const data = await readFileData(file);
	const pdf = await pdfjs.getDocument(data).promise;
	const canvas = document.createElement("canvas");
	if (pdf.numPages > 0) {
		const page = await pdf.getPage(1);
		const viewport = page.getViewport({ scale: 1 });
		const context = canvas.getContext("2d");
		if (context) {
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			await page.render({
				background: "rgba(0,0,0,0)",
				canvasContext: context,
				viewport: viewport,
			}).promise;
			return {
				height: viewport.height,
				type: AssetType.PDF,
				url: canvas.toDataURL(),
				width: viewport.width,
			};
		}
	}
	throw new Error("Unable to load PDF!");
};

export default convertPdfToImage;
