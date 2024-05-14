"use client";
import styles from "./sidebar.module.css";
import visibilityStyles from "./visibility.module.css";
import ElementValues from "./elementvalues";
import React, { Dispatch, SetStateAction } from "react";
import ValueInput from "../inputs/valueinput";
import Button from "../inputs/button";
import {
	Asset,
	ContextMenu,
	EmulatorElement,
	EmulatorElementType,
	EmulatorLayout,
	InfoFile,
} from "@/data/types";
import TreeElement from "./treeElement";
import { Spec } from "immutability-helper";
import CanvasValues from "./canvasvalues";

export default function RightSidebar(args: {
	getCurrentBackgroundAssetName: () => string;
	infoFile: InfoFile;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	addAsset: (path: string, asset: Asset) => void;
	pressedKeys: string[];
	elements: EmulatorElement[];
	addElement: () => void;
	addElementData: (data: EmulatorElement) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	removeElement: (key: number) => void;
	layoutData: EmulatorLayout | null;
	setLayoutData: (layout: Spec<EmulatorLayout, never>) => void;
	editingElement: number;
	setEditingElement: Dispatch<SetStateAction<number>>;
	scale: number;
	setScale: Dispatch<SetStateAction<number>>;
	hoverIndex: number;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
}) {
	return (
		<div className={styles.sidebar}>
			<div>
				<ValueInput
					elementIndex={0}
					increment={0.01}
					label="Zoom"
					minValue={0}
					onChange={(val: string) => {
						args.setScale(Number(val));
					}}
					places={4}
					type="float"
					value={args.scale.toFixed(4)}
				/>
				{args.layoutData && (
					<>
						<Button
							label="Add Element"
							onClick={() => {
								args.addElement();
							}}
						/>
						<div style={{ padding: "3px 5px" }}>
							<TreeElement
								label="Canvas"
								onClick={() => {
									args.setEditingElement(-1);
								}}
								onContextMenu={(e) => {
									e.preventDefault();
									args.showContextMenu(
										[
											{
												label: "Add Element",
												onClick: () => {
													args.addElement();
												},
											},
										],
										e.pageX,
										e.pageY,
									);
								}}
								showActive={args.editingElement === -1}
							>
								{args.elements.map(
									(val: EmulatorElement, i: number) => {
										let label = "";
										switch (val.type) {
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
												label =
													val.data.inputs.join(", ");
												break;
										}
										if (label.trim().length === 0)
											label = "Not Bound";
										return (
											<TreeElement
												key={i}
												label={
													<div
														style={{
															display: "flex",
															justifyContent:
																"space-between",
															alignItems:
																"stretch",
															position:
																"relative",
														}}
													>
														<p
															style={{
																margin: 0,
															}}
														>
															{label}
														</p>
														<div
															className={`${visibilityStyles.visibilityToggle}${args.elements[i].hidden ? " " + visibilityStyles.hidden : ""}`}
															style={{
																height: "var(--tree-text-line-height)",
																width: "var(--tree-text-line-height)",
															}}
															onClick={() => {
																args.updateElement(
																	i,
																	{
																		hidden: {
																			$set: !args
																				.elements[
																				i
																			]
																				.hidden,
																		},
																	},
																);
															}}
														></div>
													</div>
												}
												onClick={() => {
													args.setEditingElement(i);
												}}
												onContextMenu={(e) => {
													e.preventDefault();
													args.showContextMenu(
														[
															{
																label: "Duplicate",
																onClick: () => {
																	args.addElementData(
																		structuredClone(
																			args
																				.elements[
																				i
																			],
																		),
																	);
																},
															},
															{
																label: "Delete",
																onClick: () => {
																	args.showPopup(
																		<>
																			<h2>
																				Warning
																			</h2>
																			<p>
																				Confirm
																				deleting
																				&quot;
																				{(() => {
																					let label =
																						"Not Bound";
																					switch (
																						val.type
																					) {
																						case EmulatorElementType.Thumbstick:
																							label =
																								"Thumbstick";
																							break;
																						case EmulatorElementType.Dpad:
																							label =
																								"D-Pad";
																							break;
																						case EmulatorElementType.Touchscreen:
																							label =
																								"Touchscreen";
																							break;
																						case EmulatorElementType.Screen:
																							label =
																								"Screen";
																							break;
																						case EmulatorElementType.Default:
																							if (
																								val
																									.data
																									.inputs
																									?.length >
																								0
																							) {
																								label =
																									val.data.inputs.join(
																										", ",
																									);
																							}
																							break;
																					}
																					return label;
																				})()}
																				&quot;
																			</p>
																		</>,
																		() => {},
																		() => {
																			if (
																				args.editingElement >=
																				i
																			)
																				args.setEditingElement(
																					args.editingElement -
																						1,
																				);
																			args.removeElement(
																				i,
																			);
																		},
																	);
																},
															},
														],
														e.pageX,
														e.pageY,
													);
												}}
												onMouseEnter={() => {
													args.setHoverIndex(i);
												}}
												onMouseLeave={() => {
													args.setHoverIndex(-1);
												}}
												showActive={
													args.editingElement === i
												}
											>
												<></>
											</TreeElement>
										);
									},
								)}
							</TreeElement>
						</div>
					</>
				)}
			</div>
			<hr />
			<div>
				{args.layoutData &&
					(args.editingElement >= 0 ? (
						<ElementValues
							setAssets={args.setAssets}
							layoutData={args.layoutData}
							assets={args.assets}
							addAsset={args.addAsset}
							deleteThis={() => {
								args.setEditingElement(args.editingElement - 1);
								args.removeElement(args.editingElement);
							}}
							duplicateThis={() => {
								args.addElementData(
									structuredClone(
										args.elements[args.editingElement],
									),
								);
							}}
							elementData={args.elements[args.editingElement]}
							elementIndex={args.editingElement}
							parentHeight={args.layoutData.canvas.height}
							parentWidth={args.layoutData.canvas.width}
							showPopup={args.showPopup}
							updateElement={(
								data: Spec<EmulatorElement, never>,
							) => {
								args.updateElement(args.editingElement, data);
							}}
						/>
					) : (
						<CanvasValues
							getCurrentBackgroundAssetName={
								args.getCurrentBackgroundAssetName
							}
							setAssets={args.setAssets}
							layoutData={args.layoutData}
							assets={args.assets}
							addAsset={args.addAsset}
							setLayoutData={args.setLayoutData}
						/>
					))}
			</div>
		</div>
	);
}
