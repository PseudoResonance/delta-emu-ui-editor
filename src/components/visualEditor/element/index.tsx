"use client";
import {
	Asset,
	EmulatorElement,
	EmulatorElementType,
	ShowContextMenuFunc,
	ShowPopupFunc,
} from "@/data/types";
import styles from "./index.module.css";
import React, { Dispatch, SetStateAction, useState } from "react";
import * as CONSTANT from "@/data/constants";
import { loadAsset } from "@/utils/readImage";
import { Spec } from "immutability-helper";

const PADDING_EXPANDS_WITH_BOX_MOVE = false;

export default function EmulatorElementComponent(args: {
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	isBackground: boolean;
	pressedKeys: string[];
	parentWidth: number;
	parentHeight: number;
	elementData: EmulatorElement;
	defaultPadding: {
		top: number;
		bottom: number;
		left: number;
		right: number;
	};
	onClick: () => void;
	updateElement: (data: Spec<EmulatorElement, never>) => void;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	isHover: boolean;
	scale: number;
	showPopup: ShowPopupFunc;
	showContextMenu: ShowContextMenuFunc;
	duplicateThis: () => void;
	deleteThis: () => void;
	zIndex: number | null;
	isEditing: boolean[];
	setIsEditing: (val: boolean) => void;
}) {
	const [isActive, setIsActive] = useState<boolean>(false);
	const label = getElementLabel(args.elementData);
	const bgAsset =
		args.elementData.type === EmulatorElementType.Thumbstick &&
		args.assets &&
		args.elementData.data.thumbstick.name in args.assets
			? args.assets[args.elementData.data.thumbstick.name]
			: null;
	if (bgAsset) {
		loadAsset(bgAsset, () => {
			if (
				args.elementData.type === EmulatorElementType.Thumbstick &&
				args.assets &&
				args.elementData.data.thumbstick.name in args.assets
			) {
				const newAssets = Object.assign({}, args.assets);
				newAssets[args.elementData.data.thumbstick.name].attemptLoad =
					true;
				args.setAssets(newAssets);
			}
		}).then((res) => {
			if (res) {
				const newAssets = Object.assign({}, args.assets);
				args.setAssets(newAssets);
			}
		});
	}
	const bgUrl =
		bgAsset && bgAsset.url && bgAsset.url.length > 0 ? bgAsset.url : "";

	const moveHelper = (e: React.PointerEvent, inner: boolean) => {
		if (
			!args.isEditing[0] &&
			(e.pointerType !== "mouse" || e.button === 0)
		) {
			args.onClick();
			e.preventDefault();
			setIsActive(true);
			const xStartMouse = e.clientX;
			const yStartMouse = e.clientY;
			const xStart = args.elementData.x;
			const yStart = args.elementData.y;
			const paddingTopStart = args.elementData.paddingTop;
			const paddingBottomStart = args.elementData.paddingBottom;
			const paddingLeftStart = args.elementData.paddingLeft;
			const paddingRightStart = args.elementData.paddingRight;
			let paddingTop = -1;
			let paddingBottom = -1;
			let paddingLeft = -1;
			let paddingRight = -1;
			const moveHandler = (e: PointerEvent) => {
				if (!args.isEditing[0]) {
					e.preventDefault();
					if (!PADDING_EXPANDS_WITH_BOX_MOVE && inner) {
						paddingTop =
							paddingTopStart +
							(e.clientY - yStartMouse) / args.scale;
						paddingBottom =
							paddingBottomStart -
							(e.clientY - yStartMouse) / args.scale;
						if (paddingTop < 0) {
							paddingTop = 0;
							paddingBottom =
								paddingBottomStart + paddingTopStart;
						} else if (paddingBottom < 0) {
							paddingBottom = 0;
							paddingTop = paddingBottomStart + paddingTopStart;
						}
						paddingLeft =
							paddingLeftStart +
							(e.clientX - xStartMouse) / args.scale;
						paddingRight =
							paddingRightStart -
							(e.clientX - xStartMouse) / args.scale;
						if (paddingLeft < 0) {
							paddingLeft = 0;
							paddingRight = paddingRightStart + paddingLeftStart;
						} else if (paddingRight < 0) {
							paddingRight = 0;
							paddingLeft = paddingRightStart + paddingLeftStart;
						}
					}
					let newTop =
						yStart + (e.clientY - yStartMouse) / args.scale;
					newTop = Math.max(
						newTop,
						PADDING_EXPANDS_WITH_BOX_MOVE || !inner
							? args.elementData.paddingTop
							: 0,
					);
					newTop = Math.min(
						newTop,
						PADDING_EXPANDS_WITH_BOX_MOVE || !inner
							? args.parentHeight -
									(args.elementData.height +
										args.elementData.paddingBottom)
							: args.parentHeight - args.elementData.height,
					);
					let newLeft =
						xStart + (e.clientX - xStartMouse) / args.scale;
					newLeft = Math.max(
						newLeft,
						PADDING_EXPANDS_WITH_BOX_MOVE || !inner
							? args.elementData.paddingLeft
							: 0,
					);
					newLeft = Math.min(
						newLeft,
						PADDING_EXPANDS_WITH_BOX_MOVE || !inner
							? args.parentWidth -
									(args.elementData.width +
										args.elementData.paddingRight)
							: args.parentWidth - args.elementData.width,
					);
					args.updateElement({
						x: {
							$set: Math.round(newLeft),
						},
						y: {
							$set: Math.round(newTop),
						},
						...(paddingTop >= 0 && {
							paddingTop: {
								$set: Math.round(paddingTop),
							},
						}),
						...(paddingBottom >= 0 && {
							paddingBottom: {
								$set: Math.round(paddingBottom),
							},
						}),
						...(paddingLeft >= 0 && {
							paddingLeft: {
								$set: Math.round(paddingLeft),
							},
						}),
						...(paddingRight >= 0 && {
							paddingRight: {
								$set: Math.round(paddingRight),
							},
						}),
					});
				} else {
					document.removeEventListener("pointerup", stopHandler);
					document.removeEventListener("pointermove", moveHandler);
					setIsActive(false);
				}
			};
			const stopHandler = () => {
				document.removeEventListener("pointerup", stopHandler);
				document.removeEventListener("pointermove", moveHandler);
				setIsActive(false);
			};
			document.addEventListener("pointerup", stopHandler);
			document.addEventListener("pointermove", moveHandler);
		}
	};

	const resizeHelper = (
		e: React.PointerEvent,
		yScale: number,
		xScale: number,
		inner: boolean,
	) => {
		if (!args.isEditing[0] && (yScale != 0 || xScale != 0)) {
			if (e.pointerType !== "mouse" || e.button === 0) {
				let padding = !inner;
				if (e.shiftKey) padding = true;
				args.onClick();
				e.preventDefault();
				setIsActive(true);
				const xStartMouse = e.clientX;
				const yStartMouse = e.clientY;
				let paddingTop = -1;
				let paddingBottom = -1;
				let paddingLeft = -1;
				let paddingRight = -1;
				let y = -1;
				let x = -1;
				let width = -1;
				let height = -1;
				const paddingTopStart =
					padding && inner ? 0 : args.elementData.paddingTop;
				const paddingBottomStart =
					padding && inner ? 0 : args.elementData.paddingBottom;
				const paddingLeftStart =
					padding && inner ? 0 : args.elementData.paddingLeft;
				const paddingRightStart =
					padding && inner ? 0 : args.elementData.paddingRight;
				const yStart = args.elementData.y;
				const xStart = args.elementData.x;
				const widthStart = args.elementData.width;
				const heightStart = args.elementData.height;
				const moveHandler = (e: PointerEvent) => {
					if (!args.isEditing[0]) {
						e.preventDefault();
						if (yScale != 0) {
							const diffY =
								((e.clientY - yStartMouse) / args.scale) *
								yScale;
							if (yScale < 0) {
								if (padding) {
									if (paddingTopStart + diffY < 0)
										paddingTop = 0;
									else if (paddingTopStart + diffY > yStart)
										paddingTop = yStart;
									else paddingTop = paddingTopStart + diffY;
								} else {
									if (yStart - diffY <= 0) {
										y = 0;
										height = heightStart + yStart;
									} else if (heightStart + diffY <= 0) {
										y = yStart + heightStart;
										height = 0;
									} else {
										y = yStart - diffY;
										height = heightStart + diffY;
									}
									if (paddingTopStart > 0) {
										paddingTop =
											paddingTopStart +
											(heightStart - height);
										if (paddingTop <= 0) {
											paddingTop = 0;
										}
									}
								}
							} else {
								if (padding) {
									if (paddingBottomStart + diffY < 0)
										paddingBottom = 0;
									else if (
										paddingBottomStart + diffY >
										args.parentHeight - yStart - heightStart
									)
										paddingBottom =
											args.parentHeight -
											yStart -
											heightStart;
									else
										paddingBottom =
											paddingBottomStart + diffY;
								} else {
									if (heightStart + diffY < 0) height = 0;
									else if (
										heightStart + diffY + yStart >=
										args.parentHeight
									) {
										height = args.parentHeight - yStart;
									} else {
										height = heightStart + diffY;
									}
									if (paddingBottomStart > 0) {
										paddingBottom =
											paddingBottomStart +
											(heightStart - height);
										if (paddingBottom <= 0) {
											paddingBottom = 0;
										}
									}
								}
							}
						}
						if (xScale != 0) {
							const diffX =
								((e.clientX - xStartMouse) / args.scale) *
								xScale;
							if (xScale < 0) {
								if (padding) {
									if (paddingLeftStart + diffX < 0)
										paddingLeft = 0;
									else if (paddingLeftStart + diffX > xStart)
										paddingLeft = xStart;
									else paddingLeft = paddingLeftStart + diffX;
								} else {
									if (xStart - diffX <= 0) {
										x = 0;
										width = widthStart + xStart;
									} else if (widthStart + diffX <= 0) {
										x = xStart + widthStart;
										width = 0;
									} else {
										x = xStart - diffX;
										width = widthStart + diffX;
									}
									if (paddingLeftStart > 0) {
										paddingLeft =
											paddingLeftStart +
											(widthStart - width);
										if (paddingLeft <= 0) {
											paddingLeft = 0;
										}
									}
								}
							} else {
								if (padding) {
									if (paddingRightStart + diffX < 0)
										paddingRight = 0;
									else if (
										paddingRightStart + diffX >
										args.parentWidth - xStart - widthStart
									)
										paddingRight =
											args.parentWidth -
											xStart -
											widthStart;
									else
										paddingRight =
											paddingRightStart + diffX;
								} else {
									if (widthStart + diffX < 0) width = 0;
									else if (
										widthStart + diffX + xStart >=
										args.parentWidth
									) {
										width = args.parentWidth - xStart;
									} else {
										width = widthStart + diffX;
									}
									if (paddingRightStart > 0) {
										paddingRight =
											paddingRightStart +
											(widthStart - width);
										if (paddingRight <= 0) {
											paddingRight = 0;
										}
									}
								}
							}
						}
						args.updateElement({
							...(paddingTop >= 0 && {
								paddingTop: {
									$set: Math.round(paddingTop),
								},
							}),
							...(paddingBottom >= 0 && {
								paddingBottom: {
									$set: Math.round(paddingBottom),
								},
							}),
							...(paddingLeft >= 0 && {
								paddingLeft: {
									$set: Math.round(paddingLeft),
								},
							}),
							...(paddingRight >= 0 && {
								paddingRight: {
									$set: Math.round(paddingRight),
								},
							}),
							...(x >= 0 && {
								x: {
									$set: Math.round(x),
								},
							}),
							...(y >= 0 && {
								y: {
									$set: Math.round(y),
								},
							}),
							...(width >= 0 && {
								width: {
									$set: Math.round(width),
								},
							}),
							...(height >= 0 && {
								height: {
									$set: Math.round(height),
								},
							}),
						});
					} else {
						document.removeEventListener("pointerup", stopHandler);
						document.removeEventListener(
							"pointermove",
							moveHandler,
						);
						setIsActive(false);
					}
				};
				const stopHandler = () => {
					document.removeEventListener("pointerup", stopHandler);
					document.removeEventListener("pointermove", moveHandler);
					setIsActive(false);
				};
				document.addEventListener("pointerup", stopHandler);
				document.addEventListener("pointermove", moveHandler);
			}
		}
	};

	return (
		<div
			className={`${styles.element}${
				isActive ? " " + styles.active : ""
			}${args.isHover || isActive ? " " + styles.hover : ""}${args.elementData.hidden ? " " + styles.hidden : ""}`}
			onContextMenu={(e) => {
				e.preventDefault();
				args.showContextMenu(
					[
						{
							label: "Hide",
							onClick: () => {
								args.updateElement({
									hidden: {
										$set: true,
									},
								});
							},
						},
						{
							label: "Duplicate",
							onClick: () => {
								args.duplicateThis();
							},
						},
						{
							label: "Delete",
							onClick: () => {
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
							},
						},
					],
					e.pageX,
					e.pageY,
				);
			}}
			style={{
				width: Math.max(
					0,
					(args.elementData.width +
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingLeft +
								args.elementData.paddingRight)) *
						args.scale -
						2 * CONSTANT.ELEMENT_BORDER_WIDTH,
				),
				height: Math.max(
					0,
					(args.elementData.height +
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingTop +
								args.elementData.paddingBottom)) *
						args.scale -
						2 * CONSTANT.ELEMENT_BORDER_WIDTH,
				),
				top:
					(args.elementData.y -
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingTop)) *
						args.scale -
					CONSTANT.ELEMENT_BORDER_WIDTH,
				left:
					(args.elementData.x -
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingLeft)) *
						args.scale -
					CONSTANT.ELEMENT_BORDER_WIDTH,
				zIndex: args.zIndex !== null ? args.zIndex : "auto",
			}}
		>
			<div className={styles.expandGrid}>
				<div
					onPointerDown={(e) => {
						resizeHelper(e, -1, -1, false);
					}}
					style={{ cursor: "nw-resize" }}
				></div>

				<div
					onPointerDown={(e) => {
						resizeHelper(e, -1, 0, false);
					}}
					style={{ cursor: "n-resize" }}
				></div>

				<div
					onPointerDown={(e) => {
						resizeHelper(e, -1, 1, false);
					}}
					style={{ cursor: "ne-resize" }}
				></div>

				<div
					onPointerDown={(e) => {
						resizeHelper(e, 0, -1, false);
					}}
					style={{ cursor: "w-resize" }}
				></div>

				<div
					onPointerDown={(e) => {
						moveHelper(e, false);
					}}
					style={{ cursor: "move" }}
				></div>

				<div
					onPointerDown={(e) => {
						resizeHelper(e, 0, 1, false);
					}}
					style={{ cursor: "e-resize" }}
				></div>

				<div
					onPointerDown={(e) => {
						resizeHelper(e, 1, -1, false);
					}}
					style={{ cursor: "sw-resize" }}
				></div>

				<div
					onPointerDown={(e) => {
						resizeHelper(e, 1, 0, false);
					}}
					style={{ cursor: "s-resize" }}
				></div>

				<div
					onPointerDown={(e) => {
						resizeHelper(e, 1, 1, false);
					}}
					style={{ cursor: "se-resize" }}
				></div>
			</div>

			<div
				className={styles.padding}
				style={{
					paddingTop:
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingTop) * args.scale,
					paddingBottom:
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingBottom) * args.scale,
					paddingLeft:
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingLeft) * args.scale,
					paddingRight:
						(args.elementData.type === EmulatorElementType.Screen
							? 0
							: args.elementData.paddingRight) * args.scale,
				}}
			>
				<div
					className={styles.inner}
					style={{
						display: "block",
						position: "absolute",
						width: Math.max(
							0,
							args.elementData.width * args.scale -
								2 * CONSTANT.ELEMENT_BORDER_WIDTH,
						),
						height: Math.max(
							0,
							args.elementData.height * args.scale -
								2 * CONSTANT.ELEMENT_BORDER_WIDTH,
						),
						top:
							(args.elementData.type ===
							EmulatorElementType.Screen
								? 0
								: args.elementData.paddingTop) *
								args.scale -
							CONSTANT.ELEMENT_BORDER_WIDTH,
						left:
							(args.elementData.type ===
							EmulatorElementType.Screen
								? 0
								: args.elementData.paddingLeft) *
								args.scale -
							CONSTANT.ELEMENT_BORDER_WIDTH,
					}}
				>
					{args.elementData.type === EmulatorElementType.Dpad ||
					args.elementData.type === EmulatorElementType.Thumbstick ? (
						<div className={styles.padStickOverlay}>
							<div></div>

							<div></div>

							<div></div>

							<div></div>

							<div></div>

							<div></div>

							<div></div>

							<div></div>

							<div></div>
						</div>
					) : (
						<></>
					)}

					{args.elementData.type ===
					EmulatorElementType.Thumbstick ? (
						<div
							className={`${styles.thumbstickImage}${
								bgUrl.length > 0
									? ""
									: " " + styles.thumbstickImageEmpty
							}${args.elementData.data.thumbstick.hidden ? " " + styles.hidden : ""}`}
						>
							<div
								style={{
									width:
										args.elementData.data.thumbstick &&
										args.elementData.data.thumbstick.width
											? `${args.elementData.data.thumbstick.width * args.scale}px`
											: "0",
									height:
										args.elementData.data.thumbstick &&
										args.elementData.data.thumbstick.height
											? `${args.elementData.data.thumbstick.height * args.scale}px`
											: "0",
									position: "absolute",
									backgroundImage: `url(${bgUrl})`,
									backgroundSize: "100% 100%",
									backgroundPosition: "center",
								}}
							></div>
						</div>
					) : (
						<></>
					)}

					<div className={styles.expandGrid}>
						<div
							onPointerDown={(e) => {
								resizeHelper(e, -1, -1, true);
							}}
							style={{ cursor: "nw-resize" }}
						></div>

						<div
							onPointerDown={(e) => {
								resizeHelper(e, -1, 0, true);
							}}
							style={{ cursor: "n-resize" }}
						></div>

						<div
							onPointerDown={(e) => {
								resizeHelper(e, -1, 1, true);
							}}
							style={{ cursor: "ne-resize" }}
						></div>

						<div
							onPointerDown={(e) => {
								resizeHelper(e, 0, -1, true);
							}}
							style={{ cursor: "w-resize" }}
						></div>

						<div
							onPointerDown={(e) => {
								moveHelper(e, true);
							}}
							style={{ cursor: "move" }}
						></div>

						<div
							onPointerDown={(e) => {
								resizeHelper(e, 0, 1, true);
							}}
							style={{ cursor: "e-resize" }}
						></div>

						<div
							onPointerDown={(e) => {
								resizeHelper(e, 1, -1, true);
							}}
							style={{ cursor: "sw-resize" }}
						></div>

						<div
							onPointerDown={(e) => {
								resizeHelper(e, 1, 0, true);
							}}
							style={{ cursor: "s-resize" }}
						></div>

						<div
							onPointerDown={(e) => {
								resizeHelper(e, 1, 1, true);
							}}
							style={{ cursor: "se-resize" }}
						></div>
					</div>

					<div className={styles.labelDiv}>
						<div
							className={`${styles.inputsDescription}${
								!args.isBackground
									? " " + styles.emptyImage
									: ""
							}`}
						>
							{label}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const getElementLabel = (
	e: EmulatorElement,
	showButtonDefault?: boolean,
) => {
	let label = "";
	switch (e.type) {
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
			if (e.data.inputs?.length > 0) {
				label = e.data.inputs.join(", ");
			}
			break;
	}
	if (
		showButtonDefault &&
		e.type === EmulatorElementType.Default &&
		label.trim().length === 0
	)
		label = "Not Bound";
	return label;
};
