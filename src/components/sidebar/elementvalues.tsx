"use client";
import styles from "./sidebar.module.css";
import ValueInput from "../inputs/valueinput";
import React, { Dispatch, SetStateAction } from "react";
import Button from "../inputs/button";
import DropdownInput from "../inputs/dropdowninput";
import FileInput from "../inputs/fileinput";
import {
	Asset,
	EmulatorElement,
	EmulatorElementType,
	EmulatorLayout,
} from "@/data/types";
import { loadAsset } from "@/utils/readImage";
import { Spec } from "immutability-helper";

export default function ElementValues(args: {
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	addAsset: (path: string, asset: Asset) => void;
	elementIndex: number;
	updateElement: (data: Spec<EmulatorElement, never>) => void;
	elementData: EmulatorElement;
	duplicateThis: () => void;
	deleteThis: () => void;
	parentWidth: number;
	parentHeight: number;
	layoutData: EmulatorLayout;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
}) {
	const loadAssetHelper = (fileName: string) => {
		if (args.assets && fileName in args.assets) {
			loadAsset(args.assets[fileName], () => {
				if (args.assets && fileName in args.assets) {
					const newAssets = Object.assign({}, args.assets);
					newAssets[fileName].attemptLoad = true;
					args.setAssets(newAssets);
				}
			}).then((res) => {
				if (res) {
					const newAssets = Object.assign({}, args.assets);
					args.setAssets(newAssets);
				}
			});
		}
	};
	let data: React.JSX.Element[] = [];
	switch (args.elementData.type) {
		case EmulatorElementType.Thumbstick:
			data = [
				<ValueInput
					elementIndex={args.elementIndex}
					key="thumbstickname"
					label="Thumbstick Name"
					debounce={100}
					onChange={(val: string) => {
						args.updateElement({
							data: { thumbstick: { name: { $set: val } } },
						});
						loadAssetHelper(val);
					}}
					value={args.elementData.data.thumbstick.name}
				/>,
				<FileInput
					accept="image/*,.pdf"
					key="thumbstickfile"
					label="Thumbstick Image"
					onChange={(val: File) => {
						args.addAsset(val.name, {
							file: val,
							url: null,
							width: -1,
							height: -1,
						});
						args.updateElement({
							data: { thumbstick: { name: { $set: val.name } } },
						});
					}}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="thumbstickwidth"
					label="Thumbstick Width"
					minValue={0}
					onChange={(val: string) => {
						args.updateElement({
							data: {
								thumbstick: { width: { $set: parseInt(val) } },
							},
						});
					}}
					type="number"
					value={String(args.elementData.data.thumbstick.width)}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="thumbstickheight"
					label="Thumbstick Height"
					minValue={0}
					onChange={(val: string) => {
						args.updateElement({
							data: {
								thumbstick: { height: { $set: parseInt(val) } },
							},
						});
					}}
					type="number"
					value={String(args.elementData.data.thumbstick.height)}
				/>,
			];
		// eslint-disable-next-line no-fallthrough
		case EmulatorElementType.Dpad:
			data = [
				...data,
				<ValueInput
					elementIndex={args.elementIndex}
					key="inputup"
					label="Input Up"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									up: { $set: val },
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.up}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="inputdown"
					label="Input Down"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									down: { $set: val },
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.down}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="inputleft"
					label="Input Left"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									left: { $set: val },
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.left}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="inputright"
					label="Input Right"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									right: { $set: val },
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.right}
				/>,
			];
			break;
		case EmulatorElementType.Touchscreen:
			data = [
				<ValueInput
					elementIndex={args.elementIndex}
					key="touchscreenx"
					label="Touchscreen X"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									x: { $set: val },
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.x}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="touchscreeny"
					label="Touchscreen Y"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									y: { $set: val },
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.y}
				/>,
			];
			break;
		case EmulatorElementType.Screen:
			data = [
				<ValueInput
					elementIndex={args.elementIndex}
					key="screenx"
					label="Screen X"
					minValue={0}
					onChange={(val: string) => {
						args.updateElement({
							data: {
								screen: {
									x: { $set: parseInt(val) },
								},
							},
						});
					}}
					type="number"
					value={String(args.elementData.data.screen.x)}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="screeny"
					label="Screen Y"
					minValue={0}
					onChange={(val: string) => {
						args.updateElement({
							data: {
								screen: {
									y: { $set: parseInt(val) },
								},
							},
						});
					}}
					type="number"
					value={String(args.elementData.data.screen.y)}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="screenwidth"
					label="Screen Width"
					minValue={0}
					onChange={(val: string) => {
						args.updateElement({
							data: {
								screen: {
									width: { $set: parseInt(val) },
								},
							},
						});
					}}
					type="number"
					value={String(args.elementData.data.screen.width)}
				/>,
				<ValueInput
					elementIndex={args.elementIndex}
					key="screenheight"
					label="Screen Height"
					minValue={0}
					onChange={(val: string) => {
						args.updateElement({
							data: {
								screen: {
									height: { $set: parseInt(val) },
								},
							},
						});
					}}
					type="number"
					value={String(args.elementData.data.screen.height)}
				/>,
			];
			break;
		default:
			data = [
				<ValueInput
					elementIndex={args.elementIndex}
					key="inputs"
					label="Inputs"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputs: {
									$set: val.replace(/\s/g, "").split(","),
								},
							},
						});
					}}
					value={args.elementData.data.inputs?.join(", ")}
				/>,
			];
			break;
	}
	let label = "";
	switch (args.elementData.type) {
		case EmulatorElementType.Thumbstick:
			label = "Thumbstick";
			break;
		case EmulatorElementType.Dpad:
			label = "D-Pad";
			break;
		case EmulatorElementType.Touchscreen:
			label = "Touchscreen";
			break;
		case EmulatorElementType.Screen:
			label = "Screen";
			break;
		case EmulatorElementType.Default:
			if (args.elementData.data.inputs?.length > 0) {
				label = args.elementData.data.inputs.join(", ");
			}
			break;
	}
	if (label.trim().length === 0) label = "Not Bound";
	return (
		<div className={styles.elementValues}>
			<DropdownInput
				value={args.elementData.type}
				elementIndex={args.elementIndex}
				label="Type"
				onChange={(val: string) => {
					args.updateElement({
						type: {
							$set: EmulatorElementType[
								val as keyof typeof EmulatorElementType
							],
						},
					});
				}}
				values={
					{
						[EmulatorElementType.Default]: "Button",
						[EmulatorElementType.Dpad]: "D-Pad",
						[EmulatorElementType.Thumbstick]: "Thumbstick",
						[EmulatorElementType.Touchscreen]: "Touchscreen",
						[EmulatorElementType.Screen]: "Screen",
					} as { [key in EmulatorElementType]: string }
				}
			/>

			{...data}
			<ValueInput
				elementIndex={args.elementIndex}
				label="X"
				maxValue={args.parentWidth - args.elementData.width}
				minValue={0}
				onChange={(val: string) => {
					args.updateElement({
						x: {
							$set: parseInt(val),
						},
					});
				}}
				type="number"
				value={args.elementData.x.toFixed(0)}
			/>

			<ValueInput
				elementIndex={args.elementIndex}
				label="Y"
				maxValue={args.parentHeight - args.elementData.height}
				minValue={0}
				onChange={(val: string) => {
					args.updateElement({
						y: {
							$set: parseInt(val),
						},
					});
				}}
				type="number"
				value={args.elementData.y.toFixed(0)}
			/>

			<Button
				label="Center X"
				onClick={() => {
					args.updateElement({
						x: {
							$set: Math.round(
								(args.parentWidth - args.elementData.width) / 2,
							),
						},
					});
				}}
			/>

			<Button
				label="Center Y"
				onClick={() => {
					args.updateElement({
						y: {
							$set: Math.round(
								(args.parentHeight - args.elementData.height) /
									2,
							),
						},
					});
				}}
			/>

			<ValueInput
				elementIndex={args.elementIndex}
				label="Width"
				maxValue={args.parentWidth - args.elementData.x}
				minValue={0}
				onChange={(val: string) => {
					args.updateElement({
						width: {
							$set: parseInt(val),
						},
					});
				}}
				type="number"
				value={args.elementData.width.toFixed(0)}
			/>

			<ValueInput
				elementIndex={args.elementIndex}
				label="Height"
				maxValue={args.parentHeight - args.elementData.y}
				minValue={0}
				onChange={(val: string) => {
					args.updateElement({
						height: {
							$set: parseInt(val),
						},
					});
				}}
				type="number"
				value={args.elementData.height.toFixed(0)}
			/>

			{...args.elementData.type === EmulatorElementType.Screen
				? [<></>]
				: [
						<ValueInput
							elementIndex={args.elementIndex}
							key="paddingtop"
							label="Padding Top"
							minValue={0}
							onChange={(val: string) => {
								args.updateElement({
									paddingTop: {
										$set: parseInt(val),
									},
								});
							}}
							type="number"
							value={args.elementData.paddingTop.toFixed(0)}
						/>,
						<ValueInput
							elementIndex={args.elementIndex}
							key="paddingbottom"
							label="Padding Bottom"
							minValue={0}
							onChange={(val: string) => {
								args.updateElement({
									paddingBottom: {
										$set: parseInt(val),
									},
								});
							}}
							type="number"
							value={args.elementData.paddingBottom.toFixed(0)}
						/>,
						<ValueInput
							elementIndex={args.elementIndex}
							key="paddingleft"
							label="Padding Left"
							minValue={0}
							onChange={(val: string) => {
								args.updateElement({
									paddingLeft: {
										$set: parseInt(val),
									},
								});
							}}
							type="number"
							value={args.elementData.paddingLeft.toFixed(0)}
						/>,
						<ValueInput
							elementIndex={args.elementIndex}
							key="paddingright"
							label="Padding Right"
							minValue={0}
							onChange={(val: string) => {
								args.updateElement({
									paddingRight: {
										$set: parseInt(val),
									},
								});
							}}
							type="number"
							value={args.elementData.paddingRight.toFixed(0)}
						/>,
					]}
			<Button
				label="Duplicate Element"
				onClick={() => {
					args.duplicateThis();
				}}
			/>

			<Button
				label="Delete Element"
				onClick={() => {
					args.showPopup(
						<>
							<h2>Warning</h2>

							<p>
								Confirm deleting &quot;
								{label}
								&quot;
							</p>
						</>,
						() => {},
						() => {
							args.deleteThis();
						},
					);
				}}
			/>
		</div>
	);
}
