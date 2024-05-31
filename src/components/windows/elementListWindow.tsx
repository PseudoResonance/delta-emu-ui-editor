"use client";
import icons from "@/utils/icons.module.css";
import {
	ShowContextMenuFunc,
	EmulatorElement,
	EmulatorElementType,
	EmulatorLayout,
	ShowPopupFunc,
} from "@/data/types";
import { getElementLabel } from "../visualEditor/element";
import Button from "../inputs/button";
import { Dispatch, SetStateAction } from "react";
import { Spec } from "immutability-helper";
import * as Tree from "../objectTree";

export default function ElementListWindow(args: {
	addElement: () => void;
	addElementData: (data: EmulatorElement) => void;
	editingElement: number;
	elements: EmulatorElement[];
	hoverIndex: number;
	layoutData: EmulatorLayout | null;
	removeElement: (key: number) => void;
	setEditingElement: (val: number) => void;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	showContextMenu: ShowContextMenuFunc;
	showPopup: ShowPopupFunc;
	updateAllElements: (elements: Spec<EmulatorElement[], never>) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
}) {
	const allHidden = args.elements.reduce<boolean>(
		(prev, cur) => prev && cur.hidden,
		args.elements.length > 0,
	);

	return (
		<div>
			{args.layoutData && (
				<>
					<Button
						onClick={() => {
							args.addElement();
						}}
					>
						Add Element
					</Button>
					<Tree.Wrapper
						ariaLabel={"Element list"}
						style={{ padding: "3px 5px" }}
					>
						<Tree.Item
							label={
								<div
									role="none"
									style={{
										alignItems: "stretch",
										display: "flex",
										justifyContent: "space-between",
										position: "relative",
									}}
								>
									<p
										role="none"
										style={{
											margin: 0,
										}}
									>
										Canvas
									</p>
									<menu
										role="menu"
										style={{
											listStyle: "none",
											margin: 0,
											padding: 0,
										}}
									>
										<div
											aria-label="Toggle Canvas Visibility"
											className={`${icons.icon} ${allHidden ? icons.visibilityHidden : icons.visibilityShown}`}
											onClick={() => {
												const data: {
													[index: number]: Spec<
														EmulatorElement,
														never
													>;
												} = {};
												args.elements.forEach(
													(_, i) => {
														data[i] = {
															hidden: {
																$set: !allHidden,
															},
														};
													},
												);
												args.updateAllElements(data);
											}}
											role="menuitem"
											style={{
												height: "var(--icon-size)",
												width: "var(--icon-size)",
											}}
											title="Toggle Canvas Visibility"
										/>
									</menu>
								</div>
							}
							onClick={() => {
								args.setEditingElement(-1);
								args.setHoverIndex(-1);
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
										<Tree.Item
											key={i}
											label={
												<div
													role="none"
													style={{
														alignItems: "stretch",
														display: "flex",
														justifyContent:
															"space-between",
														position: "relative",
													}}
												>
													<p
														role="none"
														style={{
															margin: 0,
														}}
													>
														{label}
													</p>
													<menu
														role="menu"
														style={{
															listStyle: "none",
															margin: 0,
															padding: 0,
														}}
													>
														<div
															aria-label={`Toggle ${label} Visibility`}
															className={`${icons.icon} ${args.elements[i].hidden ? icons.visibilityHidden : icons.visibilityShown}`}
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
															role="menuitem"
															style={{
																height: "var(--icon-size)",
																width: "var(--icon-size)",
															}}
															title={`Toggle ${label} Visibility`}
														/>
													</menu>
												</div>
											}
											onClick={() => {
												args.setEditingElement(i);
												args.setHoverIndex(i);
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
																		args.setHoverIndex(
																			-1,
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
												args.setHoverIndex(
													args.editingElement,
												);
											}}
											showActive={
												args.editingElement === i
											}
										>
											{val.type ===
												EmulatorElementType.Thumbstick && (
												<Tree.Item
													label={
														<div
															role="none"
															style={{
																alignItems:
																	"stretch",
																display: "flex",
																justifyContent:
																	"space-between",
																position:
																	"relative",
															}}
														>
															<p
																aria-label="Thumbstick Icon"
																role="none"
																style={{
																	margin: 0,
																}}
															>
																Icon
															</p>
															<menu
																aria-label="Thumbstick Icon"
																role="menu"
																style={{
																	listStyle:
																		"none",
																	margin: 0,
																	padding: 0,
																}}
															>
																<div
																	aria-label="Toggle Thumbstick Icon Visibility"
																	className={`${icons.icon} ${args.elements[i].data.thumbstick.hidden ? icons.visibilityHidden : icons.visibilityShown}`}
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
																	role="menuitem"
																	style={{
																		height: "var(--icon-size)",
																		width: "var(--icon-size)",
																	}}
																	title="Toggle Thumbstick Icon Visibility"
																/>
															</menu>
														</div>
													}
													onClick={() => {
														args.setEditingElement(
															i,
														);
														args.setHoverIndex(i);
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
																					args.setHoverIndex(
																						-1,
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
														args.setHoverIndex(
															args.editingElement,
														);
													}}
													showActive={
														args.editingElement ===
														i
													}
												/>
											)}
										</Tree.Item>
									);
								},
							)}
						</Tree.Item>
					</Tree.Wrapper>
				</>
			)}
		</div>
	);
}
