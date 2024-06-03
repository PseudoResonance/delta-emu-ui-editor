"use client";

import { Spec } from "immutability-helper";
import CanvasValues from "./canvasValues";
import ElementValues from "./elementValues";
import {
	Asset,
	EmulatorElement,
	EmulatorLayout,
	InfoFile,
	ShowPopupFunc,
} from "@/data/types";
import { Dispatch, SetStateAction } from "react";

export default function ElementValueWindow(args: {
	addAsset: (path: string, asset: Asset) => void;
	addElementData: (data: EmulatorElement) => void;
	assets: Record<string, Asset> | null;
	currentRepresentation: string;
	editingElement: number;
	elements: EmulatorElement[];
	getCurrentBackgroundAssetName: () => string;
	infoFile: InfoFile;
	layoutData: EmulatorLayout | null;
	removeElement: (key: number) => void;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	setEditingElement: (val: number) => void;
	setLayoutData: (layout: Spec<EmulatorLayout, never>) => void;
	showPopup: ShowPopupFunc;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
}) {
	return (
		args.layoutData &&
		(args.editingElement >= 0 ? (
			<ElementValues
				addAsset={args.addAsset}
				assets={args.assets}
				currentRepresentation={args.currentRepresentation}
				deleteThis={() => {
					args.setEditingElement(args.editingElement - 1);
					args.removeElement(args.editingElement);
				}}
				duplicateThis={() => {
					args.addElementData(
						structuredClone(args.elements[args.editingElement]),
					);
				}}
				elementData={args.elements[args.editingElement]}
				elementIndex={args.editingElement}
				infoFile={args.infoFile}
				layoutData={args.layoutData}
				parentHeight={args.layoutData.canvas.height}
				parentWidth={args.layoutData.canvas.width}
				setAssets={args.setAssets}
				showPopup={args.showPopup}
				updateElement={(data: Spec<EmulatorElement, never>) => {
					args.updateElement(args.editingElement, data);
				}}
			/>
		) : (
			<CanvasValues
				addAsset={args.addAsset}
				assets={args.assets}
				currentRepresentation={args.currentRepresentation}
				getCurrentBackgroundAssetName={
					args.getCurrentBackgroundAssetName
				}
				layoutData={args.layoutData}
				setAssets={args.setAssets}
				setLayoutData={args.setLayoutData}
			/>
		))
	);
}
