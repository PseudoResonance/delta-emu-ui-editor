import { Asset, AssetType } from "@/data/types";
import convertPdfToImage from "@/utils/pdf/pdfToImg";
import { Dispatch, SetStateAction } from "react";

export const readImage = (file: File) => {
	return new Promise<{
		type: AssetType;
		url: string;
		height: number;
		width: number;
	}>((resolve, reject) => {
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
					type: AssetType.PNG,
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
	});
};

export const loadAsset = async (asset: Asset, tryCallback: () => void) => {
	if (asset.attemptLoad) {
		return false;
	}
	tryCallback();
	try {
		if (asset.url) return false;
		const data = await readImage(asset.file);
		asset.type = data.type;
		asset.url = data.url;
		asset.width = data.width;
		asset.height = data.height;
		return true;
	} catch (e) {
		console.error("Unable to load asset!", e);
		asset.type = null;
		return false;
	}
};

export const loadAssetHelper = (
	fileName: string,
	assets: Record<string, Asset> | null,
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>,
) => {
	if (assets && fileName in assets) {
		loadAsset(assets[fileName], () => {
			if (assets && fileName in assets) {
				setAssets((oldAssets) => {
					if (
						oldAssets &&
						assets &&
						fileName in oldAssets &&
						fileName in assets &&
						oldAssets[fileName] === assets[fileName]
					) {
						const newAssets = Object.assign({}, oldAssets);
						newAssets[fileName].attemptLoad = true;
						return newAssets;
					}
					return oldAssets;
				});
			}
		}).then((res) => {
			if (res) {
				setAssets((oldAssets) => Object.assign({}, oldAssets));
			}
		});
	}
};
