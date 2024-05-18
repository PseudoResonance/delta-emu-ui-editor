"use client";

import { ScaleData } from "@/data/types";
import ValueInput from "../inputs/valueinput";
import * as Constants from "@/utils/constants";
import { Dispatch, SetStateAction } from "react";

export default function ZoomWindow(args: {
	currentRepresentation: string;
	scale: ScaleData;
	setScale: Dispatch<SetStateAction<ScaleData>>;
}) {
	return (
		<ValueInput
			context={args.currentRepresentation}
			label="Zoom"
			maxValue={Constants.ZOOM_MAX * 100.0}
			minValue={Constants.ZOOM_MIN * 100.0}
			onChange={(val: string) => {
				const newScale = Number(val) / 100.0;
				const centerX = -args.scale.xOffset;
				const centerY = -args.scale.yOffset;
				args.setScale((oldScale) => {
					return {
						scale: newScale,
						xOffset:
							oldScale.xOffset -
							centerX * (newScale / oldScale.scale) +
							centerX,
						yOffset:
							oldScale.yOffset -
							centerY * (newScale / oldScale.scale) +
							centerY,
					};
				});
			}}
			type="number"
			value={(args.scale.scale * 100).toFixed(0)}
		/>
	);
}
