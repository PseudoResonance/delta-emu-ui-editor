"use client";
import lockRatioStyle from "./lockRatio.module.css";
import icons from "@/utils/icons.module.css";
import ValueInput from "@/components/inputs/valueinput";
import React, { Dispatch, SetStateAction } from "react";
import Button from "@/components/inputs/button";
import DropdownInput from "@/components/inputs/dropdown";
import { Asset, AssetType, EmulatorLayout } from "@/data/types";
import { loadAssetHelper } from "@/utils/readImage";
import { Spec } from "immutability-helper";
import CheckboxInput from "@/components/inputs/checkbox";
import Suggestions from "@/components/inputs/inputSuggestions";
import requestFiles from "@/utils/requestFiles";
import InputGrid from "../inputGrid";

const GRID_TEMPLATE_COLUMNS = "[start] 1fr [label] 2fr [button] 1.75em [end]";

export default function CanvasValues(args: {
	addAsset: (path: string, asset: Asset) => void;
	assets: Record<string, Asset> | null;
	currentRepresentation: string;
	getCurrentBackgroundAssetName: () => string;
	layoutData: EmulatorLayout;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	setLayoutData: (layout: Spec<EmulatorLayout, never>) => void;
}) {
	return (
		<InputGrid
			style={{
				gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
			}}
		>
			<span>Background Image</span>
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
			<DropdownInput
				label="Type"
				onChange={(val: string) => {
					args.setLayoutData({
						assets: {
							type: {
								$set: AssetType[val as keyof typeof AssetType],
							},
						},
					});
				}}
				style={{ gridColumn: "start / end" }}
				value={args.layoutData.assets.type}
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
						ariaLabel="Small Image File Name"
						context={args.currentRepresentation}
						debounce={1000}
						label="Small"
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
						style={{ gridColumn: "start / button" }}
						suggestionsId="assets"
						value={args.layoutData.assets.small}
					/>
					<Button
						label={"Select Small Image File"}
						onClick={() => {
							requestFiles(".png", false, (files) => {
								const val = files[0];
								args.addAsset(val.name, {
									file: val,
									height: -1,
									type: null,
									url: null,
									width: -1,
								});
								args.setLayoutData({
									assets: {
										small: {
											$set: val.name,
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
						ariaLabel="Medium Image File Name"
						context={args.currentRepresentation}
						debounce={1000}
						label="Medium"
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
						style={{ gridColumn: "start / button" }}
						suggestionsId="assets"
						value={args.layoutData.assets.medium}
					/>
					<Button
						label={"Select Medium Image File"}
						onClick={() => {
							requestFiles(".png", false, (files) => {
								const val = files[0];
								args.addAsset(val.name, {
									file: val,
									height: -1,
									type: null,
									url: null,
									width: -1,
								});
								args.setLayoutData({
									assets: {
										medium: {
											$set: val.name,
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
						ariaLabel="Large Image File Name"
						context={args.currentRepresentation}
						debounce={1000}
						label="Large"
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
						style={{ gridColumn: "start / button" }}
						suggestionsId="assets"
						value={args.layoutData.assets.large}
					/>
					<Button
						label={"Select Large Image File"}
						onClick={() => {
							requestFiles(".png", false, (files) => {
								const val = files[0];
								args.addAsset(val.name, {
									file: val,
									height: -1,
									type: null,
									url: null,
									width: -1,
								});
								args.setLayoutData({
									assets: {
										large: {
											$set: val.name,
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
				</>
			) : (
				<>
					<ValueInput
						ariaLabel="PDF Image File Name"
						context={args.currentRepresentation}
						debounce={1000}
						label="PDF"
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
						style={{ gridColumn: "start / button" }}
						suggestionsId="assets"
						value={args.layoutData.assets.resizable}
					/>
					<Button
						label={"Select PDF Image File"}
						onClick={() => {
							requestFiles(".pdf", false, (files) => {
								const val = files[0];
								args.addAsset(val.name, {
									file: val,
									height: -1,
									type: null,
									url: null,
									width: -1,
								});
								args.setLayoutData({
									assets: {
										resizable: {
											$set: val.name,
										},
									},
								});
							});
						}}
						style={{
							gridColumn: "button / end",
						}}
					>
						<div
							className={`${icons.icon} ${icons.fileAdd}`}
							style={{
								height: "var(--icon-size)",
								width: "var(--icon-size)",
							}}
						/>
					</Button>
				</>
			)}
			<hr />
			<span>Canvas</span>
			<div
				style={{
					display: "grid",
					gridColumn: "start / end",
					gridRow: "span 2",
					gridTemplateColumns: "subgrid",
					gridTemplateRows: "subgrid",
				}}
			>
				<ValueInput
					context={args.currentRepresentation}
					label="Width"
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
					style={{
						gridColumn: "start / button",
						gridRow: "1 / 2",
					}}
					type="number"
					value={String(Math.round(args.layoutData.canvas.width))}
				/>

				<ValueInput
					context={args.currentRepresentation}
					label="Height"
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
					style={{
						gridColumn: "start / button",
						gridRow: "2 / 3",
					}}
					type="number"
					value={String(Math.round(args.layoutData.canvas.height))}
				/>
				<div
					className={lockRatioStyle.buttonContainer}
					style={{
						gridColumn: "button / end",
						gridRow: "1 / 3",
					}}
				>
					<div className={lockRatioStyle.buttonTop}>
						<div />
						<div />
						<div
							style={{
								borderRight:
									"var(--tree-line-width) var(--tree-line-rgb) solid",
								borderTop:
									"var(--tree-line-width) var(--tree-line-rgb) solid",
							}}
						/>
						<div />
					</div>
					<CheckboxInput
						iconClassFalse={icons.chainBroken}
						iconClassTrue={icons.chain}
						label={"Lock Aspect Ratio"}
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
			<Button
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
								height: {
									$set: args.assets[bgName].height,
								},
								width: {
									$set: args.assets[bgName].width,
								},
							},
						});
					}
				}}
				style={{ gridColumn: "start / end" }}
			>
				Resize to Background
			</Button>
			<hr />
			<span>Default Padding</span>
			<ValueInput
				context={args.currentRepresentation}
				label="Top"
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
				style={{ gridColumn: "start / end" }}
				type="number"
				value={String(Math.round(args.layoutData.padding.top))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Bottom"
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
				style={{ gridColumn: "start / end" }}
				type="number"
				value={String(Math.round(args.layoutData.padding.bottom))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Left"
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
				style={{ gridColumn: "start / end" }}
				type="number"
				value={String(Math.round(args.layoutData.padding.left))}
			/>

			<ValueInput
				context={args.currentRepresentation}
				label="Right"
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
				style={{ gridColumn: "start / end" }}
				type="number"
				value={String(Math.round(args.layoutData.padding.right))}
			/>
			<hr />
			<CheckboxInput
				onChange={(val: boolean) => {
					args.setLayoutData({
						translucent: {
							$set: val,
						},
					});
				}}
				style={{ gridColumn: "start / end" }}
				value={args.layoutData.translucent}
			>
				Translucent Layout
			</CheckboxInput>
		</InputGrid>
	);
}
