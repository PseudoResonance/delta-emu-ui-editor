"use client";
import { Asset } from "@/data/types";
import * as zip from "@zip.js/zip.js";

const writeZip = async (files: Record<string, Asset>) => {
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
		bufferedWrite: true,
	});
	const promises: Promise<zip.EntryMetaData | void>[] = [];
	Object.keys(files).forEach((name) => {
		if (!name.startsWith("__MACOSX")) {
			promises.push(
				zipWriter
					.add(name, new zip.BlobReader(files[name].file))
					.catch((e) => {
						console.error(`Error while writing ${name} to zip!`, e);
					}),
			);
		}
	});
	await Promise.allSettled(promises);
	return URL.createObjectURL(await zipWriter.close());
};

export default writeZip;
