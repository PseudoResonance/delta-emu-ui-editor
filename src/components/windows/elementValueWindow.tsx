"use client";

import { Spec } from "immutability-helper";
import CanvasValues from "./subelements/canvasvalues";
import ElementValues from "./subelements/elementvalues";
import { Asset, EmulatorElement, EmulatorLayout, InfoFile } from "@/data/types";
import { Dispatch, SetStateAction } from "react";

export default function ElementValueWindow(args: {
	getCurrentBackgroundAssetName: () => string;
	infoFile: InfoFile;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	addAsset: (path: string, asset: Asset) => void;
	elements: EmulatorElement[];
	addElementData: (data: EmulatorElement) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	removeElement: (key: number) => void;
	layoutData: EmulatorLayout | null;
	setLayoutData: (layout: Spec<EmulatorLayout, never>) => void;
	editingElement: number;
	setEditingElement: (val: number) => void;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	currentRepresentation: string;
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
