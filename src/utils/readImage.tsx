import { Asset } from "@/data/types";
import convertPdfToImage from "@/utils/pdf/pdfToImg";

export const readImage = (file: File) => {
	return new Promise<{ url: string; height: number; width: number }>(
		(resolve, reject) => {
			if (file.name.toLocaleLowerCase().endsWith(".pdf")) {
				convertPdfToImage(file)
					.then((data) => {
						resolve(data);
					})
					.catch((e) => {
						reject(e);
					});
			} else {
				const url = URL.createObjectURL(file);
				const image = new Image();
				image.onload = (e) => {
					resolve({
						url: url,
						height:
							e.target instanceof HTMLImageElement
								? (e.target as HTMLImageElement).naturalHeight
								: -1,
						width:
							e.target instanceof HTMLImageElement
								? (e.target as HTMLImageElement).naturalWidth
								: -1,
					});
				};
				image.onerror = (e) => {
					reject(e);
				};
				image.src = url;
			}
		},
	);
};

export const loadAsset = async (asset: Asset, tryCallback: () => void) => {
	if (asset.attemptLoad) {
		return false;
	}
	tryCallback();
	try {
		if (asset.url) return false;
		const data = await readImage(asset.file);
		asset.url = data.url;
		asset.width = data.width;
		asset.height = data.height;
		return true;
	} catch (e) {
		console.error("Unable to load asset!", e);
		return false;
	}
};
