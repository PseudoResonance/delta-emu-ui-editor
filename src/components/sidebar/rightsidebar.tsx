"use client";
import styles from "./sidebar.module.css";
import React, { Dispatch, SetStateAction } from "react";
import {
	Asset,
	ContextMenu,
	EmulatorElement,
	EmulatorLayout,
	InfoFile,
	ScaleData,
} from "@/data/types";
import { Spec } from "immutability-helper";
import ElementListWindow from "../windows/elementListWindow";
import ZoomWindow from "../windows/zoomWindow";
import ElementValueWindow from "../windows/elementValueWindow";

export default function RightSidebar(args: {
	getCurrentBackgroundAssetName: () => string;
	infoFile: InfoFile;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	addAsset: (path: string, asset: Asset) => void;
	elements: EmulatorElement[];
	addElement: () => void;
	addElementData: (data: EmulatorElement) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	removeElement: (key: number) => void;
	layoutData: EmulatorLayout | null;
	setLayoutData: (layout: Spec<EmulatorLayout, never>) => void;
	updateAllElements: (elements: Spec<EmulatorElement[], never>) => void;
	editingElement: number;
	setEditingElement: (val: number) => void;
	scale: ScaleData;
	setScale: Dispatch<SetStateAction<ScaleData>>;
	hoverIndex: number;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
	currentRepresentation: string;
}) {
	return (
		<div className={styles.sidebar}>
			<div>
				<ZoomWindow
					currentRepresentation={args.currentRepresentation}
					scale={args.scale}
					setScale={args.setScale}
				/>
				<ElementListWindow
					addElement={args.addElement}
					addElementData={args.addElementData}
					editingElement={args.editingElement}
					elements={args.elements}
					hoverIndex={args.hoverIndex}
					layoutData={args.layoutData}
					removeElement={args.removeElement}
					setEditingElement={args.setEditingElement}
					setHoverIndex={args.setHoverIndex}
					showContextMenu={args.showContextMenu}
					showPopup={args.showPopup}
					updateAllElements={args.updateAllElements}
					updateElement={args.updateElement}
				/>
			</div>
			<hr />
			<div>
				<ElementValueWindow
					addAsset={args.addAsset}
					addElementData={args.addElementData}
					assets={args.assets}
					currentRepresentation={args.currentRepresentation}
					editingElement={args.editingElement}
					elements={args.elements}
					getCurrentBackgroundAssetName={
						args.getCurrentBackgroundAssetName
					}
					infoFile={args.infoFile}
					layoutData={args.layoutData}
					removeElement={args.removeElement}
					setAssets={args.setAssets}
					setEditingElement={args.setEditingElement}
					setLayoutData={args.setLayoutData}
					showPopup={args.showPopup}
					updateElement={args.updateElement}
				/>
			</div>
		</div>
	);
}
