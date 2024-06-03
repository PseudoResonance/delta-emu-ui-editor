"use client";
import icons from "@/utils/icons.module.css";
import ValueInput from "@/components/inputs/valueinput";
import React, { Dispatch, SetStateAction } from "react";
import Button from "@/components/inputs/button";
import DropdownInput from "@/components/inputs/dropdown";
import {
	Asset,
	EmulatorElement,
	EmulatorElementType,
	EmulatorLayout,
	InfoFile,
	ShowPopupFunc,
} from "@/data/types";
import { loadAssetHelper } from "@/utils/readImage";
import { Spec } from "immutability-helper";
import Suggestions from "@/components/inputs/inputSuggestions";
import INPUT_PRESETS from "@/data/consoleInfo";
import { getElementLabel } from "@/components/visualEditor/element";
import requestFiles from "@/utils/requestFiles";
import InputGrid from "../inputGrid";
import CheckboxInput from "../inputs/checkbox";

const GRID_TEMPLATE_COLUMNS = "[start] 1fr [label] 2fr [button] 1.75em [end]";

export default function ElementValues(args: {
	addAsset: (path: string, asset: Asset) => void;
	assets: Record<string, Asset> | null;
	currentRepresentation: string;
	deleteThis: () => void;
	duplicateThis: () => void;
	elementData: EmulatorElement;
	elementIndex: number;
	infoFile: InfoFile;
	layoutData: EmulatorLayout;
	parentHeight: number;
	parentWidth: number;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	showPopup: ShowPopupFunc;
	updateElement: (data: Spec<EmulatorElement, never>) => void;
}) {
	const INPUT_PRESET =
		args.infoFile.gameTypeIdentifier in INPUT_PRESETS
			? INPUT_PRESETS[args.infoFile.gameTypeIdentifier]
			: null;
	const BUTTON_INPUTS =
		INPUT_PRESET && args.elementData.type in INPUT_PRESET.buttons
			? INPUT_PRESET.buttons[args.elementData.type]
			: null;
	const valueElements: React.JSX.Element[] = [];
	switch (args.elementData.type) {
		case EmulatorElementType.Thumbstick:
			valueElements.push(
				<>
					<hr />
					<span>Thumbstick Image</span>
					<Suggestions
						id={"assets"}
						values={
							args.assets
								? Object.keys(args.assets).filter(
										(name) => name !== "info.json",
									)
								: []
						}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						debounce={1000}
						key="thumbstickname"
						label="Image"
						onChange={(val: string) => {
							args.updateElement({
								data: { thumbstick: { name: { $set: val } } },
							});
							loadAssetHelper(val, args.assets, args.setAssets);
						}}
						style={{ gridColumn: "start / button" }}
						suggestionsId="assets"
						value={args.elementData.data.thumbstick.name}
					/>
					<Button
						label={"Select Thumbstick Image File"}
						onClick={() => {
							requestFiles("image/*,.pdf", false, (files) => {
								const val = files[0];
								args.addAsset(val.name, {
									file: val,
									height: -1,
									type: null,
									url: null,
									width: -1,
								});
								args.updateElement({
									data: {
										thumbstick: {
											name: { $set: val.name },
										},
									},
								});
							});
						}}
						style={{ gridColumn: "button / end" }}
					>
						<div
							className={`${icons.icon} ${icons.fileAdd}`}
							style={{
								height: "var(--icon-size)",
								width: "var(--icon-size)",
							}}
						/>
					</Button>
					<ValueInput
						context={String(args.elementIndex)}
						key="thumbstickwidth"
						label="Width"
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
						style={{ gridColumn: "start / end" }}
						type="number"
						value={String(args.elementData.data.thumbstick.width)}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="thumbstickheight"
						label="Height"
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
						style={{ gridColumn: "start / end" }}
						type="number"
						value={String(args.elementData.data.thumbstick.height)}
					/>
				</>,
			);
		// eslint-disable-next-line no-fallthrough
		case EmulatorElementType.Dpad:
			valueElements.push(
				<>
					<hr />
					<span>Input Bindings</span>
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
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="inputup"
						label="Up"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="inputUp"
						value={args.elementData.data.inputsobj.up}
					/>
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
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="inputdown"
						label="Down"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="inputDown"
						value={args.elementData.data.inputsobj.down}
					/>
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
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="inputleft"
						label="Left"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="inputLeft"
						value={args.elementData.data.inputsobj.left}
					/>
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
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="inputright"
						label="Right"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="inputRight"
						value={args.elementData.data.inputsobj.right}
					/>
				</>,
			);
			break;
		case EmulatorElementType.Touchscreen:
			valueElements.push(
				<>
					<hr />
					<span>Input Bindings</span>
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
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="touchscreenx"
						label="Touch X"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="inputX"
						value={args.elementData.data.inputsobj.x}
					/>
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
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="touchscreeny"
						label="Touch Y"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="inputY"
						value={args.elementData.data.inputsobj.y}
					/>
				</>,
			);
			break;
		case EmulatorElementType.Screen:
			valueElements.push(
				<>
					<hr />
					<span>Input Screen Size</span>
					<Suggestions
						id={"screenX"}
						values={
							INPUT_PRESET
								? INPUT_PRESET.screens.map((val) =>
										val.x.toFixed(0),
									)
								: []
						}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="screenx"
						label="X"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="screenX"
						type="number"
						value={String(args.elementData.data.screen.x)}
					/>
					<Suggestions
						id={"screenY"}
						values={
							INPUT_PRESET
								? INPUT_PRESET.screens.map((val) =>
										val.y.toFixed(0),
									)
								: []
						}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="screeny"
						label="Y"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="screenY"
						type="number"
						value={String(args.elementData.data.screen.y)}
					/>
					<Suggestions
						id={"screenWidth"}
						values={
							INPUT_PRESET
								? INPUT_PRESET.screens.map((val) =>
										val.width.toFixed(0),
									)
								: []
						}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="screenwidth"
						label="Width"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="screenWidth"
						type="number"
						value={String(args.elementData.data.screen.width)}
					/>
					<Suggestions
						id={"screenHeight"}
						values={
							INPUT_PRESET
								? INPUT_PRESET.screens.map((val) =>
										val.height.toFixed(0),
									)
								: []
						}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						key="screenheight"
						label="Height"
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="screenHeight"
						type="number"
						value={String(args.elementData.data.screen.height)}
					/>
				</>,
			);
			break;
		default:
			valueElements.push(
				<>
					<hr />
					<Suggestions
						id={"inputs"}
						values={
							BUTTON_INPUTS &&
							BUTTON_INPUTS.values &&
							BUTTON_INPUTS.values instanceof Array
								? BUTTON_INPUTS.values
								: []
						}
					/>
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
						style={{ gridColumn: "start / end" }}
						suggestionsId="inputs"
						value={args.elementData.data.inputs?.join(", ")}
					/>
				</>,
			);
			break;
	}
	const label = getElementLabel(args.elementData, true);
	return (
		<InputGrid
			style={{
				gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
			}}
		>
			<DropdownInput
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
				style={{ gridColumn: "start / end" }}
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

			{...valueElements}
			<hr />
			<span>Position</span>
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
				style={{ gridColumn: "start / button" }}
				type="number"
				value={args.elementData.x.toFixed(0)}
			/>
			<Button
				label={"Center Along X Axis"}
				onClick={() => {
					args.updateElement({
						x: {
							$set: Math.round(
								(args.parentWidth - args.elementData.width) / 2,
							),
						},
					});
				}}
				style={{ gridColumn: "button / end" }}
			>
				<div
					className={`${icons.icon} ${icons.horizontalAlign}`}
					style={{
						height: "var(--icon-size)",
						width: "var(--icon-size)",
					}}
				/>
			</Button>

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
				style={{ gridColumn: "start / button" }}
				type="number"
				value={args.elementData.y.toFixed(0)}
			/>
			<Button
				label={"Center Along Y Axis"}
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
				style={{ gridColumn: "button / end" }}
			>
				<div
					className={`${icons.icon} ${icons.verticalAlign}`}
					style={{
						height: "var(--icon-size)",
						width: "var(--icon-size)",
					}}
				/>
			</Button>

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
				style={{ gridColumn: "start / end" }}
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
				style={{ gridColumn: "start / end" }}
				type="number"
				value={args.elementData.height.toFixed(0)}
			/>

			{args.elementData.type !== EmulatorElementType.Screen && (
				<>
					<hr />
					<span>Padding</span>
					<ValueInput
						context={String(args.elementIndex)}
						disabled={args.elementData.paddingTopGlobal}
						key="paddingtop"
						label="Top"
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
						style={{ gridColumn: "start / button" }}
						type="number"
						value={args.elementData.paddingTop.toFixed(0)}
					/>
					<CheckboxInput
						iconClassFalse={icons.lockOff}
						iconClassTrue={icons.lock}
						label={"Use Default Padding Top"}
						onChange={(val) => {
							args.updateElement({
								paddingTopGlobal: {
									$set: val,
								},
							});
						}}
						style={{ gridColumn: "button / end" }}
						value={args.elementData.paddingTopGlobal}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						disabled={args.elementData.paddingBottomGlobal}
						key="paddingbottom"
						label="Bottom"
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
						style={{ gridColumn: "start / button" }}
						type="number"
						value={args.elementData.paddingBottom.toFixed(0)}
					/>
					<CheckboxInput
						iconClassFalse={icons.lockOff}
						iconClassTrue={icons.lock}
						label={"Use Default Padding Bottom"}
						onChange={(val) => {
							args.updateElement({
								paddingBottomGlobal: {
									$set: val,
								},
							});
						}}
						style={{ gridColumn: "button / end" }}
						value={args.elementData.paddingBottomGlobal}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						disabled={args.elementData.paddingLeftGlobal}
						key="paddingleft"
						label="Left"
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
						style={{ gridColumn: "start / button" }}
						type="number"
						value={args.elementData.paddingLeft.toFixed(0)}
					/>
					<CheckboxInput
						iconClassFalse={icons.lockOff}
						iconClassTrue={icons.lock}
						label={"Use Default Padding Left"}
						onChange={(val) => {
							args.updateElement({
								paddingLeftGlobal: {
									$set: val,
								},
							});
						}}
						style={{ gridColumn: "button / end" }}
						value={args.elementData.paddingLeftGlobal}
					/>
					<ValueInput
						context={String(args.elementIndex)}
						disabled={args.elementData.paddingRightGlobal}
						key="paddingright"
						label="Right"
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
						style={{ gridColumn: "start / button" }}
						type="number"
						value={args.elementData.paddingRight.toFixed(0)}
					/>
					<CheckboxInput
						iconClassFalse={icons.lockOff}
						iconClassTrue={icons.lock}
						label={"Use Default Padding Right"}
						onChange={(val) => {
							args.updateElement({
								paddingRightGlobal: {
									$set: val,
								},
							});
						}}
						style={{ gridColumn: "button / end" }}
						value={args.elementData.paddingRightGlobal}
					/>
				</>
			)}
			<hr />
			<Button
				onClick={() => {
					args.duplicateThis();
				}}
				style={{ gridColumn: "start / end" }}
			>
				Duplicate Element
			</Button>

			<Button
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
				style={{ gridColumn: "start / end" }}
			>
				Delete Element
			</Button>
		</InputGrid>
	);
}
