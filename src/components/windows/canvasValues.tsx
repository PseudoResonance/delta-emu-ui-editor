"use client";
import lockRatioStyle from "./lockRatio.module.css";
import icons from "@/utils/icons.module.css";
import ValueInput from "@/components/inputs/valueinput";
import React, { Dispatch, SetStateAction } from "react";
import Button from "@/components/inputs/button";
import DropdownInput from "@/components/inputs/dropdown";
import FileInput from "@/components/inputs/file";
import { Asset, AssetType, EmulatorLayout } from "@/data/types";
import { loadAssetHelper } from "@/utils/readImage";
import { Spec } from "immutability-helper";
import CheckboxInput from "@/components/inputs/checkbox";
import Suggestions from "@/components/inputs/inputSuggestions";

export default function CanvasValues(args: {
	getCurrentBackgroundAssetName: () => string;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	addAsset: (path: string, asset: Asset) => void;
	setLayoutData: (layout: Spec<EmulatorLayout, never>) => void;
	layoutData: EmulatorLayout;
	currentRepresentation: string;
}) {
	return (
		<>
			<DropdownInput
				label="Background Type"
				onChange={(val: string) => {
					args.setLayoutData({
						assets: {
							type: {
								$set: AssetType[val as keyof typeof AssetType],
							},
						},
					});
				}}
				value={args.layoutData.assets.type}
				values={
					{
						[AssetType.PDF]: "PDF",
						[AssetType.PNG]: "PNG",
					} as { [key in AssetType]: string }
				}
			/>
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
			{args.layoutData.assets.type === AssetType.PNG ? (
				<>
					<ValueInput
						context={args.currentRepresentation}
						debounce={1000}
						label="Small Name"
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									small: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val, args.assets, args.setAssets);
						}}
						suggestionsId="assets"
						value={args.layoutData.assets.small}
					/>
					<FileInput
						accept=".png"
						key="smallfile"
						label="Choose Small Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								type: null,
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
						debounce={1000}
						label="Medium Name"
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									medium: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val, args.assets, args.setAssets);
						}}
						suggestionsId="assets"
						value={args.layoutData.assets.medium}
					/>
					<FileInput
						accept=".png"
						key="mediumfile"
						label="Choose Medium Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								type: null,
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
						debounce={1000}
						label="Large Name"
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									large: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val, args.assets, args.setAssets);
						}}
						suggestionsId="assets"
						value={args.layoutData.assets.large}
					/>
					<FileInput
						accept=".png"
						key="largefile"
						label="Choose Large Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								type: null,
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
						debounce={1000}
						label="PDF Name"
						onChange={(val: string) => {
							args.setLayoutData({
								assets: {
									resizable: {
										$set: val,
									},
								},
							});
							loadAssetHelper(val, args.assets, args.setAssets);
						}}
						suggestionsId="assets"
						value={args.layoutData.assets.resizable}
					/>

					<FileInput
						accept=".pdf"
						key="resizablefile"
						label="Choose PDF Image"
						onChange={(val: File) => {
							args.addAsset(val.name, {
								file: val,
								type: null,
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

			<div className={lockRatioStyle.container}>
				<div className={lockRatioStyle.inputs}>
					<ValueInput
						context={args.currentRepresentation}
						label="Canvas Width"
						minValue={0}
						onChange={(val: string) => {
							const res = parseInt(val);
							if (!isNaN(res)) {
								let height = -1;
								if (
									args.layoutData &&
									args.layoutData.lockBackgroundRatio
								) {
									height =
										res *
										(args.layoutData.canvas.height /
											args.layoutData.canvas.width);
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
						label="Canvas Height"
						minValue={0}
						onChange={(val: string) => {
							const res = parseInt(val);
							if (!isNaN(res)) {
								let width = -1;
								if (
									args.layoutData &&
									args.layoutData.lockBackgroundRatio
								) {
									width =
										res *
										(args.layoutData.canvas.width /
											args.layoutData.canvas.height);
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
						value={String(
							Math.round(args.layoutData.canvas.height),
						)}
					/>
				</div>
				<div className={lockRatioStyle.buttonContainer}>
					<div className={lockRatioStyle.buttonTop}>
						<div />
						<div />
						<div
							style={{
								borderTop:
									"var(--tree-line-width) var(--tree-line-rgb) solid",
								borderRight:
									"var(--tree-line-width) var(--tree-line-rgb) solid",
							}}
						/>
						<div />
					</div>
					<CheckboxInput
						iconClassFalse={icons.chainBroken}
						iconClassTrue={icons.chain}
						onChange={(val) => {
							args.setLayoutData({
								lockBackgroundRatio: {
									$set: val,
								},
							});
						}}
						value={
							args.layoutData &&
							args.layoutData.lockBackgroundRatio
						}
					/>
					<div className={lockRatioStyle.buttonBottom}>
						<div
							style={{
								borderBottom:
									"var(--tree-line-width) var(--tree-line-rgb) solid",
								borderRight:
									"var(--tree-line-width) var(--tree-line-rgb) solid",
							}}
						/>
						<div />
						<div />
						<div />
					</div>
				</div>
			</div>

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
				label="Translucent Layout"
				onChange={(val: boolean) => {
					args.setLayoutData({
						translucent: {
							$set: val,
						},
					});
				}}
				value={args.layoutData.translucent}
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
