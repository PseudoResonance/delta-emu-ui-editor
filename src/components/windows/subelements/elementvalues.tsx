"use client";
import style from "./elementvalues.module.css";
import icons from "@/utils/icons.module.css";
import ValueInput from "../../inputs/valueinput";
import React, { Dispatch, SetStateAction } from "react";
import Button from "../../inputs/button";
import DropdownInput from "../../inputs/dropdowninput";
import FileInput from "../../inputs/fileinput";
import {
	Asset,
	EmulatorElement,
	EmulatorElementType,
	EmulatorLayout,
	InfoFile,
} from "@/data/types";
import { loadAsset } from "@/utils/readImage";
import { Spec } from "immutability-helper";
import Suggestions from "../../inputs/inputSuggestions";
import INPUT_PRESETS from "@/data/consoleInfo";
import { getElementLabel } from "../../editor/element";

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
					debounce={1000}
					key="thumbstickname"
					label="Image Name"
					onChange={(val: string) => {
						args.updateElement({
							data: { thumbstick: { name: { $set: val } } },
						});
						loadAssetHelper(val);
					}}
					suggestionsId="assets"
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
					label="Bind Up"
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
					suggestionsId="inputUp"
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
					label="Bind Down"
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
					suggestionsId="inputDown"
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
					label="Bind Left"
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
					suggestionsId="inputLeft"
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
					label="Bind Right"
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
					suggestionsId="inputRight"
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
					label="Bind Touch X"
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
					suggestionsId="inputX"
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
					label="Bind Touch Y"
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
					suggestionsId="inputY"
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
					label="Capture Screen X"
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
					suggestionsId="screenX"
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
					label="Capture Screen Y"
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
					suggestionsId="screenY"
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
					label="Capture Screen Width"
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
					suggestionsId="screenWidth"
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
					label="Capture Screen Height"
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
					suggestionsId="screenHeight"
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
					label="Bindings"
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
					suggestionsId="inputs"
					value={args.elementData.data.inputs?.join(", ")}
				/>,
			];
			break;
	}
	const label = getElementLabel(args.elementData, true);
	return (
		<div>
			<DropdownInput
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
				value={args.elementData.type}
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
			<div className={style.inputFlex}>
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
				<Button
					label={
						<div
							className={`${icons.icon} ${icons.horizontalAlign}`}
							style={{
								height: "var(--icon-size)",
								width: "var(--icon-size)",
							}}
						/>
					}
					onClick={() => {
						args.updateElement({
							x: {
								$set: Math.round(
									(args.parentWidth -
										args.elementData.width) /
										2,
								),
							},
						});
					}}
				/>
			</div>

			<div className={style.inputFlex}>
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
					label={
						<div
							className={`${icons.icon} ${icons.verticalAlign}`}
							style={{
								height: "var(--icon-size)",
								width: "var(--icon-size)",
							}}
						/>
					}
					onClick={() => {
						args.updateElement({
							y: {
								$set: Math.round(
									(args.parentHeight -
										args.elementData.height) /
										2,
								),
							},
						});
					}}
				/>
			</div>

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