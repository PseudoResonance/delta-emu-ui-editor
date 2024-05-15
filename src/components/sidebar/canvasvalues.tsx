"use client";
import ValueInput from "../inputs/valueinput";
import React, { Dispatch, SetStateAction } from "react";
import Button from "../inputs/button";
import DropdownInput from "../inputs/dropdowninput";
import FileInput from "../inputs/fileinput";
import { Asset, AssetType, EmulatorLayout } from "@/data/types";
import { loadAsset } from "@/utils/readImage";
import { Spec } from "immutability-helper";
import CheckboxInput from "../inputs/checkboxinput";

export default function CanvasValues(args: {
	getCurrentBackgroundAssetName: () => string;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	addAsset: (path: string, asset: Asset) => void;
	setLayoutData: (layout: Spec<EmulatorLayout, never>) => void;
	layoutData: EmulatorLayout;
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
	return (
		<>
			<DropdownInput
				value={args.layoutData.assets.type}
				elementIndex={0}
				label="Asset Type"
				onChange={(val: string) => {
					args.setLayoutData({
						assets: {
							type: {
								$set: AssetType[val as keyof typeof AssetType],
							},
						},
					});
				}}
				values={
					{
						[AssetType.PDF]: "PDF",
						[AssetType.PNG]: "PNG",
					} as { [key in AssetType]: string }
				}
			/>
			{args.layoutData.assets.type === AssetType.PNG ? (
				<>
					<ValueInput
						context={args.currentRepresentation}
						label="Small"
						debounce={1000}
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									small: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val);
						}}
						value={args.layoutData.assets.small}
					/>
					<FileInput
						accept=".png"
						key="smallfile"
						label="Choose Small Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								url: null,
								width: -1,
								height: -1,
							});
							args.setLayoutData({
								assets: {
									small: {
										$set: val.name,
									},
								},
							});
						}}
					/>
					<ValueInput
						context={args.currentRepresentation}
						label="Medium"
						debounce={1000}
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									medium: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val);
						}}
						value={args.layoutData.assets.medium}
					/>
					<FileInput
						accept=".png"
						key="mediumfile"
						label="Choose Medium Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								url: null,
								width: -1,
								height: -1,
							});
							args.setLayoutData({
								assets: {
									medium: {
										$set: val.name,
									},
								},
							});
						}}
					/>
					<ValueInput
						context={args.currentRepresentation}
						label="Large"
						debounce={1000}
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									large: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val);
						}}
						value={args.layoutData.assets.large}
					/>
					<FileInput
						accept=".png"
						key="largefile"
						label="Choose Large Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								url: null,
								width: -1,
								height: -1,
							});
							args.setLayoutData({
								assets: {
									large: {
										$set: val.name,
									},
								},
							});
						}}
					/>
				</>
			) : (
				<>
					<ValueInput
						context={args.currentRepresentation}
						label="Resizable"
						debounce={1000}
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									resizable: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val);
						}}
						value={args.layoutData.assets.resizable}
					/>

					<FileInput
						accept=".pdf"
						key="resizablefile"
						label="Choose Resizable Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								url: null,
								width: -1,
								height: -1,
							});
							args.setLayoutData({
								assets: {
									resizable: {
										$set: val.name,
									},
								},
							});
						}}
					/>
				</>
			)}

			<ValueInput
				context={args.currentRepresentation}
				label="Screen Width"
				minValue={0}
				onChange={(val: string) => {
					const res = parseInt(val);
					if (!isNaN(res)) {
						let height = -1;
						const bgName = args.getCurrentBackgroundAssetName();
						if (
							args.layoutData &&
							args.layoutData.lockBackgroundRatio &&
							args.assets &&
							bgName in args.assets &&
							args.assets[bgName].height > -1 &&
							args.assets[bgName].width > -1
						) {
							height =
								res *
								(args.assets[bgName].height /
									args.assets[bgName].width);
						}
						args.setLayoutData({
							canvas: {
								width: {
									$set: res,
								},
								...(height > -1 && {
									height: {
										$set: height,
									},
								}),
							},
						});
					}
				}}
				type="number"
				value={String(Math.round(args.layoutData.canvas.width))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Screen Height"
				minValue={0}
				onChange={(val: string) => {
					const res = parseInt(val);
					if (!isNaN(res)) {
						let width = -1;
						const bgName = args.getCurrentBackgroundAssetName();
						if (
							args.layoutData &&
							args.layoutData.lockBackgroundRatio &&
							args.assets &&
							bgName in args.assets &&
							args.assets[bgName].height > -1 &&
							args.assets[bgName].width > -1
						) {
							width =
								res *
								(args.assets[bgName].width /
									args.assets[bgName].height);
						}
						args.setLayoutData({
							canvas: {
								height: {
									$set: res,
								},
								...(width > -1 && {
									width: {
										$set: width,
									},
								}),
							},
						});
					}
				}}
				type="number"
				value={String(Math.round(args.layoutData.canvas.height))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Padding Top"
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.setLayoutData({
							padding: {
								top: {
									$set: num,
								},
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					if (isNaN(num) || val.length === 0) {
						args.setLayoutData({
							padding: {
								top: {
									$set: 0,
								},
							},
						});
					}
				}}
				type="number"
				value={String(Math.round(args.layoutData.padding.top))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Padding Bottom"
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.setLayoutData({
							padding: {
								bottom: {
									$set: num,
								},
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					if (isNaN(num) || val.length === 0) {
						args.setLayoutData({
							padding: {
								bottom: {
									$set: 0,
								},
							},
						});
					}
				}}
				type="number"
				value={String(Math.round(args.layoutData.padding.bottom))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Padding Left"
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.setLayoutData({
							padding: {
								left: {
									$set: num,
								},
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					if (isNaN(num) || val.length === 0) {
						args.setLayoutData({
							padding: {
								left: {
									$set: 0,
								},
							},
						});
					}
				}}
				type="number"
				value={String(Math.round(args.layoutData.padding.left))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Padding Right"
				minValue={0}
				onChange={(val: string) => {
					const num = parseInt(val);
					if (!isNaN(num))
						args.setLayoutData({
							padding: {
								right: {
									$set: num,
								},
							},
						});
				}}
				onFocusLost={(val: string) => {
					const num = parseInt(val);
					console.log(val, isNaN(num));
					if (isNaN(num) || val.length === 0) {
						args.setLayoutData({
							padding: {
								right: {
									$set: 0,
								},
							},
						});
					}
				}}
				type="number"
				value={String(Math.round(args.layoutData.padding.right))}
			/>

			<CheckboxInput
				value={args.layoutData.translucent}
				label="Translucent"
				onChange={(val: boolean) => {
					args.setLayoutData({
						translucent: {
							$set: val,
						},
					});
				}}
			/>

			<CheckboxInput
				value={args.layoutData.lockBackgroundRatio}
				label="Lock Background Ratio"
				onChange={(val: boolean) => {
					const bgName = args.getCurrentBackgroundAssetName();
					let height = -1;
					if (
						args.layoutData &&
						val &&
						args.assets &&
						bgName in args.assets &&
						args.assets[bgName].height > -1 &&
						args.assets[bgName].width > -1
					) {
						height = Math.round(
							args.layoutData.canvas.width *
								(args.assets[bgName].height /
									args.assets[bgName].width),
						);
					}
					args.setLayoutData({
						lockBackgroundRatio: {
							$set: val,
						},
						...(height > -1 && {
							canvas: {
								height: {
									$set: height,
								},
							},
						}),
					});
				}}
			/>

			<Button
				label="Resize to Background"
				onClick={() => {
					const bgName = args.getCurrentBackgroundAssetName();
					if (
						args.assets &&
						bgName in args.assets &&
						args.assets[bgName].height > -1 &&
						args.assets[bgName].width > -1
					) {
						args.setLayoutData({
							canvas: {
								width: {
									$set: args.assets[bgName].width,
								},
								height: {
									$set: args.assets[bgName].height,
								},
							},
						});
					}
				}}
			/>
		</>
	);
}
