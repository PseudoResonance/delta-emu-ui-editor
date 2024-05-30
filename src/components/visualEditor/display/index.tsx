"use client";
import React, { Dispatch, SetStateAction } from "react";
import EmulatorElementComponent from "../element";
import styles from "./index.module.css";
import {
	Asset,
	EmulatorElement,
	FocusState,
	ShowContextMenuFunc,
	ShowPopupFunc,
} from "@/data/types";
import * as CONSTANT from "@/data/constants";
import { loadAssetHelper } from "@/utils/readImage";
import { Spec } from "immutability-helper";

export default function EmulatorWindow(args: {
	getCurrentBackgroundAssetName: () => string;
	focusState: FocusState;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	pressedKeys: string[];
	elements: EmulatorElement[];
	addElementData: (data: EmulatorElement) => void;
	removeElement: (key: number) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	editingElement: number;
	setEditingElement: (val: number) => void;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	style: object;
	scale: number;
	width: number;
	height: number;
	hoverIndex: number;
	defaultPadding: {
		top: number;
		bottom: number;
		left: number;
		right: number;
	};
	showPopup: ShowPopupFunc;
	showContextMenu: ShowContextMenuFunc;
	isEditing: boolean[];
	setIsEditing: (val: boolean) => void;
}) {
	const targetAssetName = args.getCurrentBackgroundAssetName();
	const bgAsset =
		args.assets && targetAssetName in args.assets
			? args.assets[targetAssetName]
			: null;
	if (bgAsset) {
		loadAssetHelper(targetAssetName, args.assets, args.setAssets);
	}
	const bgUrl =
		bgAsset && bgAsset.url && bgAsset.url.length > 0 ? bgAsset.url : "";
	return (
		<div
			style={
				{
					"--element-border-width": `${CONSTANT.ELEMENT_BORDER_WIDTH}px`,
					"--resize-handle-width": `${CONSTANT.RESIZE_HANDLE_WIDTH}px`,
				} as React.CSSProperties
			}
		>
			<div
				className={styles.window}
				style={{
					...args.style,
					width:
						args.width * args.scale -
						2 * CONSTANT.ELEMENT_BORDER_WIDTH,
					height:
						args.height * args.scale -
						2 * CONSTANT.ELEMENT_BORDER_WIDTH,
				}}
			>
				{
					// eslint-disable-next-line @next/next/no-img-element
					<img
						className={styles.backgroundImage}
						src={bgUrl}
						style={{
							display: bgUrl.length > 0 ? "inherit" : "none",
							width: args.width * args.scale,
							height: args.height * args.scale,
							top: -CONSTANT.ELEMENT_BORDER_WIDTH,
							left: -CONSTANT.ELEMENT_BORDER_WIDTH,
						}}
					/>
				}

				{args.elements.map((val: EmulatorElement, i: number) => (
					<EmulatorElementComponent
						assets={args.assets}
						defaultPadding={args.defaultPadding}
						deleteThis={() => {
							if (args.editingElement >= i)
								args.setEditingElement(args.editingElement - 1);
							if (args.hoverIndex >= i) args.setHoverIndex(-1);
							args.removeElement(i);
						}}
						duplicateThis={() => {
							args.addElementData(
								structuredClone(args.elements[i]),
							);
						}}
						elementData={val}
						isBackground={bgUrl.length > 0}
						isEditing={args.isEditing}
						isHover={i === args.hoverIndex}
						key={i}
						onClick={() => {
							args.setEditingElement(i);
							args.setHoverIndex(i);
						}}
						parentHeight={args.height}
						parentWidth={args.width}
						pressedKeys={args.pressedKeys}
						scale={args.scale}
						setAssets={args.setAssets}
						setHoverIndex={args.setHoverIndex}
						setIsEditing={args.setIsEditing}
						showContextMenu={args.showContextMenu}
						showPopup={args.showPopup}
						updateElement={(data: Spec<EmulatorElement, never>) => {
							args.updateElement(i, data);
						}}
						zIndex={
							args.focusState.elements.includes(i)
								? args.focusState.elements.indexOf(i)
								: null
						}
					/>
				))}
			</div>
		</div>
	);
}