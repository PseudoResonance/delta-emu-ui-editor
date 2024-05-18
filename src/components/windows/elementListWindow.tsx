"use client";
import visibilityStyles from "./visibility.module.css";
import {
	ContextMenu,
	EmulatorElement,
	EmulatorElementType,
	EmulatorLayout,
} from "@/data/types";
import { getElementLabel } from "../editor/element";
import TreeElement from "../sidebar/treeElement";
import Button from "../inputs/button";
import { Dispatch, SetStateAction } from "react";
import { Spec } from "immutability-helper";

export default function ElementListWindow(args: {
	elements: EmulatorElement[];
	addElement: () => void;
	addElementData: (data: EmulatorElement) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	removeElement: (key: number) => void;
	layoutData: EmulatorLayout | null;
	editingElement: number;
	setEditingElement: (val: number) => void;
	updateAllElements: (elements: Spec<EmulatorElement[], never>) => void;
	hoverIndex: number;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
}) {
	const allHidden = args.elements.reduce<boolean>(
		(prev, cur) => prev && cur.hidden,
		true,
	);

	return (
		<div>
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
							label={
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "stretch",
										position: "relative",
									}}
								>
									<p
										style={{
											margin: 0,
										}}
									>
										Canvas
									</p>
									<div
										className={`${visibilityStyles.visibilityToggle}${allHidden ? " " + visibilityStyles.hidden : ""}`}
										onClick={() => {
											const data: {
												[index: number]: Spec<
													EmulatorElement,
													never
												>;
											} = {};
											args.elements.forEach((_, i) => {
												data[i] = {
													hidden: {
														$set: !allHidden,
													},
												};
											});
											args.updateAllElements(data);
										}}
										style={{
											height: "var(--tree-text-line-height)",
											width: "var(--tree-text-line-height)",
										}}
									></div>
								</div>
							}
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
									const label = getElementLabel(val, true);
									return (
										<TreeElement
											key={i}
											label={
												<div
													style={{
														display: "flex",
														justifyContent:
															"space-between",
														alignItems: "stretch",
														position: "relative",
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
														style={{
															height: "var(--tree-text-line-height)",
															width: "var(--tree-text-line-height)",
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
																			{getElementLabel(
																				val,
																				true,
																			)}
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
											onPointerEnter={() => {
												args.setHoverIndex(i);
											}}
											onPointerLeave={() => {
												args.setHoverIndex(-1);
											}}
											showActive={
												args.editingElement === i
											}
										>
											{val.type ===
											EmulatorElementType.Thumbstick ? (
												<TreeElement
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
																Icon
															</p>
															<div
																className={`${visibilityStyles.visibilityToggle}${args.elements[i].data.thumbstick.hidden ? " " + visibilityStyles.hidden : ""}`}
																onClick={() => {
																	args.updateElement(
																		i,
																		{
																			data: {
																				thumbstick:
																					{
																						hidden: {
																							$set: !args
																								.elements[
																								i
																							]
																								.data
																								.thumbstick
																								.hidden,
																						},
																					},
																			},
																		},
																	);
																}}
																style={{
																	height: "var(--tree-text-line-height)",
																	width: "var(--tree-text-line-height)",
																}}
															></div>
														</div>
													}
													onClick={() => {
														args.setEditingElement(
															i,
														);
													}}
													onContextMenu={(e) => {
														e.preventDefault();
														args.showContextMenu(
															[
																{
																	label: "Duplicate",
																	onClick:
																		() => {
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
																	onClick:
																		() => {
																			args.showPopup(
																				<>
																					<h2>
																						Warning
																					</h2>
																					<p>
																						Confirm
																						deleting
																						&quot;
																						{getElementLabel(
																							val,
																							true,
																						)}
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
													onPointerEnter={() => {
														args.setHoverIndex(i);
													}}
													onPointerLeave={() => {
														args.setHoverIndex(-1);
													}}
													showActive={
														args.editingElement ===
														i
													}
												>
													<></>
												</TreeElement>
											) : (
												<></>
											)}
										</TreeElement>
									);
								},
							)}
						</TreeElement>
					</div>
				</>
			)}
		</div>
	);
}
