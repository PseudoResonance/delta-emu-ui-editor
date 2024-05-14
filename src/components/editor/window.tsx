"use client";
import React, { Dispatch, SetStateAction } from "react";
import EmulatorElementComponent from "./element";
import styles from "./editor.module.css";
import { Asset, ContextMenu, EmulatorElement } from "@/data/types";
import * as CONSTANT from "@/utils/constants";
import { loadAsset } from "@/utils/readImage";
import { Spec } from "immutability-helper";

export default function EmulatorWindow(args: {
	getCurrentBackgroundAssetName: () => string;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	pressedKeys: string[];
	elements: EmulatorElement[];
	addElementData: (data: EmulatorElement) => void;
	removeElement: (key: number) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	editingElement: number;
	setEditingElement: Dispatch<SetStateAction<number>>;
	style: object;
	scale: number;
	width: number;
	height: number;
	hoverIndex: number;
	padding: { top: number; bottom: number; left: number; right: number };
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
}) {
	const targetAssetName = args.getCurrentBackgroundAssetName();
	const bgAsset =
		args.assets && targetAssetName in args.assets
			? args.assets[targetAssetName]
			: null;
	if (bgAsset) {
		loadAsset(bgAsset, () => {
			if (args.assets && targetAssetName in args.assets) {
				const newAssets = Object.assign({}, args.assets);
				newAssets[targetAssetName].attemptLoad = true;
				args.setAssets(newAssets);
			}
		}).then((res) => {
			if (res) {
				const newAssets = Object.assign({}, args.assets);
				args.setAssets(newAssets);
			}
		});
	}
	const bgUrl =
		bgAsset && bgAsset.url && bgAsset.url.length > 0 ? bgAsset.url : "";
	return (
		<div
			style={
				{
					"--element-border-width": `${CONSTANT.BORDER_WIDTH}px`,
				} as React.CSSProperties
			}
		>
			<div
				className={styles.window}
				style={{
					...args.style,
					width:
						(args.width + args.padding.left + args.padding.right) *
							args.scale -
						2 * CONSTANT.BORDER_WIDTH,
					height:
						(args.height + args.padding.top + args.padding.bottom) *
							args.scale -
						2 * CONSTANT.BORDER_WIDTH,
				}}
			>
				<div
					className={styles.windowInner}
					style={{
						width:
							args.width * args.scale - 2 * CONSTANT.BORDER_WIDTH,
						height:
							args.height * args.scale -
							2 * CONSTANT.BORDER_WIDTH,
						marginTop:
							args.padding.top * args.scale -
							CONSTANT.BORDER_WIDTH,
						marginBottom: args.padding.bottom * args.scale,
						marginLeft:
							args.padding.left * args.scale -
							CONSTANT.BORDER_WIDTH,
						marginRight: args.padding.right * args.scale,
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
								top: -CONSTANT.BORDER_WIDTH,
								left: -CONSTANT.BORDER_WIDTH,
							}}
						/>
					}

					{args.elements.map((val: EmulatorElement, i: number) => (
						<EmulatorElementComponent
							assets={args.assets}
							setAssets={args.setAssets}
							deleteThis={() => {
								if (args.editingElement >= i)
									args.setEditingElement(
										args.editingElement - 1,
									);
								args.removeElement(i);
							}}
							duplicateThis={() => {
								args.addElementData(
									structuredClone(args.elements[i]),
								);
							}}
							elementData={val}
							isBackground={bgUrl.length > 0}
							isHover={i === args.hoverIndex}
							key={i}
							onClick={() => {
								args.setEditingElement(i);
							}}
							parentHeight={args.height}
							parentWidth={args.width}
							pressedKeys={args.pressedKeys}
							scale={args.scale}
							showContextMenu={args.showContextMenu}
							showPopup={args.showPopup}
							updateElement={(
								data: Spec<EmulatorElement, never>,
							) => {
								args.updateElement(i, data);
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}