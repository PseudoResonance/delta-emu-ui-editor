"use client";

import { ChangeEvent } from "react";

const requestFiles = (
	accept: string,
	multiple: boolean,
	onChoose: (files: FileList) => void,
) => {
	const elem = document.createElement("input");
	elem.type = "file";
	elem.accept = accept;
	if (multiple) elem.multiple = true;
	elem.style.display = "none";
	elem.onchange = ((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onChoose(e.target.files);
		}
	}) as unknown as (this: GlobalEventHandlers, ev: Event) => unknown;
	document.body.appendChild(elem);
	elem.click();
	document.body.removeChild(elem);
};

export default requestFiles;
