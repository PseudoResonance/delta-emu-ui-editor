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
	InfoFile,
} from "@/data/types";
import { loadAsset } from "@/utils/readImage";
import { Spec } from "immutability-helper";
import Suggestions from "../inputs/inputSuggestions";
import INPUT_PRESETS from "@/data/consoleInfo";

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
	infoFile: InfoFile;
	layoutData: EmulatorLayout;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	currentRepresentation: string;
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
	const INPUT_PRESET =
		args.infoFile.gameTypeIdentifier in INPUT_PRESETS
			? INPUT_PRESETS[args.infoFile.gameTypeIdentifier]
			: null;
	const BUTTON_INPUTS =
		INPUT_PRESET && args.elementData.type in INPUT_PRESET.buttons
			? INPUT_PRESET.buttons[args.elementData.type]
			: null;
	let data: React.JSX.Element[] = [];
	switch (args.elementData.type) {
		case EmulatorElementType.Thumbstick:
			data = [
				<Suggestions
					id={"assets"}
					values={
						args.assets
							? Object.keys(args.assets).filter(
									(name) => name !== "info.json",
								)
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="thumbstickname"
					label="Thumbstick Name"
					suggestionsId="assets"
					debounce={1000}
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
					context={String(args.elementIndex)}
					key="thumbstickwidth"
					label="Thumbstick Width"
					minValue={0}
					onChange={(val: string) => {
						const num = parseInt(val);
						if (!isNaN(num))
							args.updateElement({
								data: {
									thumbstick: {
										width: {
											$set: num,
										},
									},
								},
							});
					}}
					onFocusLost={(val: string) => {
						const num = parseInt(val);
						if (isNaN(num) || val.length === 0) {
							args.updateElement({
								data: {
									thumbstick: {
										width: {
											$set: 0,
										},
									},
								},
							});
						}
					}}
					type="number"
					value={String(args.elementData.data.thumbstick.width)}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="thumbstickheight"
					label="Thumbstick Height"
					minValue={0}
					onChange={(val: string) => {
						const num = parseInt(val);
						if (!isNaN(num))
							args.updateElement({
								data: {
									thumbstick: {
										height: {
											$set: num,
										},
									},
								},
							});
					}}
					onFocusLost={(val: string) => {
						const num = parseInt(val);
						if (isNaN(num) || val.length === 0) {
							args.updateElement({
								data: {
									thumbstick: {
										height: {
											$set: 0,
										},
									},
								},
							});
						}
					}}
					type="number"
					value={String(args.elementData.data.thumbstick.height)}
				/>,
			];
		// eslint-disable-next-line no-fallthrough
		case EmulatorElementType.Dpad:
			data = [
				...data,
				<Suggestions
					id={"inputUp"}
					values={
						BUTTON_INPUTS &&
						BUTTON_INPUTS.values &&
						!(BUTTON_INPUTS.values instanceof Array) &&
						"up" in BUTTON_INPUTS.values
							? BUTTON_INPUTS.values.up
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="inputup"
					label="Input Up"
					suggestionsId="inputUp"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									up: {
										$set: val,
									},
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.up}
				/>,
				<Suggestions
					id={"inputDown"}
					values={
						BUTTON_INPUTS &&
						BUTTON_INPUTS.values &&
						!(BUTTON_INPUTS.values instanceof Array) &&
						"down" in BUTTON_INPUTS.values
							? BUTTON_INPUTS.values.down
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="inputdown"
					label="Input Down"
					suggestionsId="inputDown"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									down: {
										$set: val,
									},
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.down}
				/>,
				<Suggestions
					id={"inputLeft"}
					values={
						BUTTON_INPUTS &&
						BUTTON_INPUTS.values &&
						!(BUTTON_INPUTS.values instanceof Array) &&
						"left" in BUTTON_INPUTS.values
							? BUTTON_INPUTS.values.left
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="inputleft"
					label="Input Left"
					suggestionsId="inputLeft"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									left: {
										$set: val,
									},
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.left}
				/>,
				<Suggestions
					id={"inputRight"}
					values={
						BUTTON_INPUTS &&
						BUTTON_INPUTS.values &&
						!(BUTTON_INPUTS.values instanceof Array) &&
						"right" in BUTTON_INPUTS.values
							? BUTTON_INPUTS.values.right
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="inputright"
					label="Input Right"
					suggestionsId="inputRight"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									right: {
										$set: val,
									},
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
				<Suggestions
					id={"inputX"}
					values={
						BUTTON_INPUTS &&
						BUTTON_INPUTS.values &&
						!(BUTTON_INPUTS.values instanceof Array) &&
						"x" in BUTTON_INPUTS.values
							? BUTTON_INPUTS.values.x
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="touchscreenx"
					label="Touchscreen X"
					suggestionsId="inputX"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									x: {
										$set: val,
									},
								},
							},
						});
					}}
					value={args.elementData.data.inputsobj.x}
				/>,
				<Suggestions
					id={"inputY"}
					values={
						BUTTON_INPUTS &&
						BUTTON_INPUTS.values &&
						!(BUTTON_INPUTS.values instanceof Array) &&
						"y" in BUTTON_INPUTS.values
							? BUTTON_INPUTS.values.y
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="touchscreeny"
					label="Touchscreen Y"
					suggestionsId="inputY"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputsobj: {
									y: {
										$set: val,
									},
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
				<Suggestions
					id={"screenX"}
					values={
						INPUT_PRESET
							? INPUT_PRESET.screens.map((val) =>
									val.x.toFixed(0),
								)
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="screenx"
					label="Screen X"
					suggestionsId="screenX"
					minValue={0}
					onChange={(val: string) => {
						const num = parseInt(val);
						if (!isNaN(num))
							args.updateElement({
								data: {
									screen: {
										x: {
											$set: num,
										},
									},
								},
							});
					}}
					onFocusLost={(val: string) => {
						const num = parseInt(val);
						if (isNaN(num) || val.length === 0) {
							args.updateElement({
								data: {
									screen: {
										x: {
											$set: 0,
										},
									},
								},
							});
						}
					}}
					type="number"
					value={String(args.elementData.data.screen.x)}
				/>,
				<Suggestions
					id={"screenY"}
					values={
						INPUT_PRESET
							? INPUT_PRESET.screens.map((val) =>
									val.y.toFixed(0),
								)
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="screeny"
					label="Screen Y"
					suggestionsId="screenY"
					minValue={0}
					onChange={(val: string) => {
						const num = parseInt(val);
						if (!isNaN(num))
							args.updateElement({
								data: {
									screen: {
										y: {
											$set: num,
										},
									},
								},
							});
					}}
					onFocusLost={(val: string) => {
						const num = parseInt(val);
						if (isNaN(num) || val.length === 0) {
							args.updateElement({
								data: {
									screen: {
										y: {
											$set: 0,
										},
									},
								},
							});
						}
					}}
					type="number"
					value={String(args.elementData.data.screen.y)}
				/>,
				<Suggestions
					id={"screenWidth"}
					values={
						INPUT_PRESET
							? INPUT_PRESET.screens.map((val) =>
									val.width.toFixed(0),
								)
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="screenwidth"
					label="Screen Width"
					suggestionsId="screenWidth"
					minValue={0}
					onChange={(val: string) => {
						const num = parseInt(val);
						if (!isNaN(num))
							args.updateElement({
								data: {
									screen: {
										width: {
											$set: num,
										},
									},
								},
							});
					}}
					onFocusLost={(val: string) => {
						const num = parseInt(val);
						if (isNaN(num) || val.length === 0) {
							args.updateElement({
								data: {
									screen: {
										width: {
											$set: 0,
										},
									},
								},
							});
						}
					}}
					type="number"
					value={String(args.elementData.data.screen.width)}
				/>,
				<Suggestions
					id={"screenHeight"}
					values={
						INPUT_PRESET
							? INPUT_PRESET.screens.map((val) =>
									val.height.toFixed(0),
								)
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="screenheight"
					label="Screen Height"
					suggestionsId="screenHeight"
					minValue={0}
					onChange={(val: string) => {
						const num = parseInt(val);
						if (!isNaN(num))
							args.updateElement({
								data: {
									screen: {
										height: {
											$set: num,
										},
									},
								},
							});
					}}
					onFocusLost={(val: string) => {
						const num = parseInt(val);
						if (isNaN(num) || val.length === 0) {
							args.updateElement({
								data: {
									screen: {
										height: {
											$set: 0,
										},
									},
								},
							});
						}
					}}
					type="number"
					value={String(args.elementData.data.screen.height)}
				/>,
			];
			break;
		default:
			data = [
				<Suggestions
					id={"inputs"}
					values={
						BUTTON_INPUTS &&
						BUTTON_INPUTS.values &&
						BUTTON_INPUTS.values instanceof Array
							? BUTTON_INPUTS.values
							: []
					}
				/>,
				<ValueInput
					context={String(args.elementIndex)}
					key="inputs"
					label="Inputs"
					suggestionsId="inputs"
					onChange={(val: string) => {
						args.updateElement({
							data: {
								inputs: {
									$set: val
										.replace(/\s/g, "")
										.split(",")
										.filter((e) => e),
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
				context={String(args.elementIndex)}
				label="X"
				maxValue={args.parentWidth - args.elementData.width}
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.updateElement({
							x: {
								$set: num,
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					if (isNaN(num) || val.length === 0) {
						args.updateElement({
							x: {
								$set: 0,
							},
						});
					}
				}}
				type="number"
				value={args.elementData.x.toFixed(0)}
			/>

			<ValueInput
				context={String(args.elementIndex)}
				label="Y"
				maxValue={args.parentHeight - args.elementData.height}
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.updateElement({
							y: {
								$set: num,
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					if (isNaN(num) || val.length === 0) {
						args.updateElement({
							y: {
								$set: 0,
							},
						});
					}
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
				context={String(args.elementIndex)}
				label="Width"
				maxValue={args.parentWidth - args.elementData.x}
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.updateElement({
							width: {
								$set: num,
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					if (isNaN(num) || val.length === 0) {
						args.updateElement({
							width: {
								$set: 0,
							},
						});
					}
				}}
				type="number"
				value={args.elementData.width.toFixed(0)}
			/>

			<ValueInput
				context={String(args.elementIndex)}
				label="Height"
				maxValue={args.parentHeight - args.elementData.y}
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.updateElement({
							height: {
								$set: num,
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					if (isNaN(num) || val.length === 0) {
						args.updateElement({
							height: {
								$set: 0,
							},
						});
					}
				}}
				type="number"
				value={args.elementData.height.toFixed(0)}
			/>

			{...args.elementData.type === EmulatorElementType.Screen
				? [<></>]
				: [
						<ValueInput
							context={String(args.elementIndex)}
							key="paddingtop"
							label="Padding Top"
							minValue={0}
							onChange={(val: string) => {
								const num = parseInt(val);
								if (!isNaN(num))
									args.updateElement({
										paddingTop: {
											$set: num,
										},
									});
							}}
							onFocusLost={(val: string) => {
								const num = parseInt(val);
								if (isNaN(num) || val.length === 0) {
									args.updateElement({
										paddingTop: {
											$set: 0,
										},
									});
								}
							}}
							type="number"
							value={args.elementData.paddingTop.toFixed(0)}
						/>,
						<ValueInput
							context={String(args.elementIndex)}
							key="paddingbottom"
							label="Padding Bottom"
							minValue={0}
							onChange={(val: string) => {
								const num = parseInt(val);
								if (!isNaN(num))
									args.updateElement({
										paddingBottom: {
											$set: num,
										},
									});
							}}
							onFocusLost={(val: string) => {
								const num = parseInt(val);
								if (isNaN(num) || val.length === 0) {
									args.updateElement({
										paddingBottom: {
											$set: 0,
										},
									});
								}
							}}
							type="number"
							value={args.elementData.paddingBottom.toFixed(0)}
						/>,
						<ValueInput
							context={String(args.elementIndex)}
							key="paddingleft"
							label="Padding Left"
							minValue={0}
							onChange={(val: string) => {
								const num = parseInt(val);
								if (!isNaN(num))
									args.updateElement({
										paddingLeft: {
											$set: num,
										},
									});
							}}
							onFocusLost={(val: string) => {
								const num = parseInt(val);
								if (isNaN(num) || val.length === 0) {
									args.updateElement({
										paddingLeft: {
											$set: 0,
										},
									});
								}
							}}
							type="number"
							value={args.elementData.paddingLeft.toFixed(0)}
						/>,
						<ValueInput
							context={String(args.elementIndex)}
							key="paddingright"
							label="Padding Right"
							minValue={0}
							onChange={(val: string) => {
								const num = parseInt(val);
								if (!isNaN(num))
									args.updateElement({
										paddingRight: {
											$set: num,
										},
									});
							}}
							onFocusLost={(val: string) => {
								const num = parseInt(val);
								if (isNaN(num) || val.length === 0) {
									args.updateElement({
										paddingRight: {
											$set: 0,
										},
									});
								}
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
