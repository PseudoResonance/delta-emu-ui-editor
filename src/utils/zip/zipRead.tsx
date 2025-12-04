"use client";
import { Asset } from "@/data/types";
import * as zip from "@zip.js/zip.js";

const readZip = async (file: File) => {
	const tree: Record<string, Asset> = {};
	const promises: Promise<void>[] = [];
	const entries = await new zip.ZipReader(
		new zip.BlobReader(file),
	).getEntries();
	if (entries && entries.length) {
		if (entries.find((entry) => entry.encrypted))
			throw new Error("Unable to read encrypted archive!");
		entries.forEach((entry) => {
			if (!entry.filename.startsWith("__MACOSX")) {
				let total = -1;
				if (!entry.directory) {
					promises.push(
						entry
							.getData(new zip.BlobWriter(), {
								onend: (finalSize) => {
									console.debug(
										`[Unzip ${entry.filename}]: Read ${finalSize}B`,
									);
								},
								onprogress: (currentBytes) => {
									console.debug(
										`[Unzip ${entry.filename}]: ${total > 0 ? (currentBytes * 100.0) / total + "%" : "Err%"}`,
									);
								},
								onstart: (totalBytes) => {
									total = totalBytes;
									console.debug(
										`[Unzip ${entry.filename}]: ${total > 0 ? "0%" : "Err%"}`,
									);
								},
							} as zip.EntryGetDataOptions)
							.then((blob) => {
								try {
									const path = entry.filename.split("/");
									tree[entry.filename] = {
										file: new File(
											[blob],
											path[path.length - 1],
										),
										height: -1,
										type: null,
										url: null,
										width: -1,
									};
								} catch (e) {
									console.error(
										"Error reading zip file directory structure!",
										e,
									);
								}
							})
							.catch((e) => {
								console.error(
									`Error while reading ${entry.filename} from zip!`,
									e,
								);
							}),
					);
				}
			}
		});
	}
	await Promise.allSettled(promises);
	return tree;
};

export default readZip;
