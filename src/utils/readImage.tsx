import { Asset, AssetType, Mutable } from "@/data/types";
import convertPdfToImage from "@/utils/pdf/pdfToImg";
import { Dispatch, SetStateAction } from "react";

const readImage = (file: File) => {
	return new Promise<{
		height: number;
		type: AssetType;
		url: string;
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
					height:
						e.target instanceof HTMLImageElement
							? (e.target as HTMLImageElement).naturalHeight
							: -1,
					type: AssetType.PNG,
					url: url,
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

const loadAsset = async (asset: Asset) => {
	try {
		if (asset.url) return false;
		const data = await readImage(asset.file);
		(asset as Mutable<Asset>).type = data.type;
		(asset as Mutable<Asset>).url = data.url;
		(asset as Mutable<Asset>).width = data.width;
		(asset as Mutable<Asset>).height = data.height;
		return true;
	} catch (e) {
		console.error("Unable to load asset!", e);
		(asset as Mutable<Asset>).type = null;
		return false;
	}
};

export const loadAssetHelper = (
	fileName: string,
	assets: Record<string, Asset> | null,
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>,
) => {
	if (assets && fileName in assets && !assets[fileName].attemptLoad) {
		(assets[fileName] as Mutable<Asset>).attemptLoad = true;
		loadAsset(assets[fileName]).then((res) => {
			if (res) {
				setAssets((oldAssets) => Object.assign({}, oldAssets));
			}
		});
	}
};
