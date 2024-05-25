"use client";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import EmulatorWindow from "./window";
import styles from "./editor.module.css";
import {
	Asset,
	ContextMenu,
	EmulatorElement,
	EmulatorLayout,
	FocusState,
	ScaleData,
} from "@/data/types";
import { Spec } from "immutability-helper";
import { getReactProps } from "@/utils/reactInternals";
import { getElementLabel } from "./element";
import * as CONSTANT from "@/utils/constants";

const TOUCH_ZOOM_SCALE = 0.0035;

export default function MainEditor(args: {
	getCurrentBackgroundAssetName: () => string;
	focusState: FocusState;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	pressedKeys: string[];
	elements: EmulatorElement[];
	addElementData: (data: EmulatorElement) => void;
	removeElement: (key: number) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	layoutData: EmulatorLayout | null;
	editingElement: number;
	setEditingElement: (val: number) => void;
	scale: ScaleData;
	setScale: Dispatch<SetStateAction<ScaleData>>;
	hoverIndex: number;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const focused = useRef<boolean>(false);

	const pointerCache = useRef<PointerEvent[]>([]);

	useEffect(() => {
		const onScroll = (e: Event) => {
			e.preventDefault();
		};
		if (ref.current) {
			ref.current.addEventListener("mousewheel", onScroll);
			ref.current.addEventListener("wheel", onScroll);
			return () => {
				if (ref.current) {
					ref.current.removeEventListener("mousewheel", onScroll);
					ref.current.removeEventListener("wheel", onScroll);
				}
			};
		}
	}, [args.elements, args.editingElement]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const nodeType = e.target
				? (e.target as HTMLElement).nodeName.toLocaleLowerCase()
				: "";
			if (
				!(nodeType === "input" || nodeType === "textarea") &&
				focused.current
			) {
				if (args.editingElement > -1 && args.layoutData) {
					const elem = args.elements[args.editingElement];
					const delta = e.shiftKey ? 10 : 1;
					switch (e.key) {
						case "Delete":
						case "Backspace":
							args.showPopup(
								<>
									<h2>Warning</h2>
									<p>
										Confirm deleting &quot;
										{getElementLabel(elem, true)}
										&quot;
									</p>
								</>,
								() => {},
								() => {
									args.setEditingElement(
										args.editingElement - 1,
									);
									args.removeElement(args.editingElement);
								},
							);
							break;
						case "ArrowUp":
							if (elem.y - elem.paddingTop > 0)
								args.updateElement(args.editingElement, {
									y: {
										$set: Math.max(
											elem.y - delta,
											elem.paddingTop,
										),
									},
								});
							break;
						case "ArrowDown":
							if (
								elem.y + elem.height + elem.paddingBottom <
								args.layoutData.canvas.height
							)
								args.updateElement(args.editingElement, {
									y: {
										$set: Math.min(
											args.layoutData.canvas.height -
												(elem.paddingBottom +
													elem.height),
											elem.y + delta,
										),
									},
								});
							break;
						case "ArrowLeft":
							if (elem.x - elem.paddingLeft > 0)
								args.updateElement(args.editingElement, {
									x: {
										$set: Math.max(
											elem.x - delta,
											elem.paddingLeft,
										),
									},
								});
							break;
						case "ArrowRight":
							if (
								elem.x + elem.width + elem.paddingRight <
								args.layoutData.canvas.width
							)
								args.updateElement(args.editingElement, {
									x: {
										$set: Math.min(
											args.layoutData.canvas.width -
												(elem.paddingRight +
													elem.width),
											elem.x + delta,
										),
									},
								});
							break;
					}
				}
			}
		};
		const onPointerDown = (e: PointerEvent) => {
			if (
				ref.current &&
				e.target &&
				ref.current.contains(e.target as HTMLElement)
			) {
				focused.current = true;
			} else {
				focused.current = false;
			}
		};
		if (ref.current) {
			window.addEventListener("keydown", onKeyDown);
			window.addEventListener("pointerdown", onPointerDown);
			return () => {
				if (ref.current) {
					window.removeEventListener("keydown", onKeyDown);
					window.removeEventListener("pointerdown", onPointerDown);
				}
			};
		}
	}, [args.elements, args.editingElement]);

	const pointerDown = (e: React.PointerEvent) => {
		pointerCache.current.push(e.nativeEvent);
		let moveHandler: ((e: PointerEvent) => void) | null = null;
		if (
			(pointerCache.current.length === 1 &&
				e.ctrlKey &&
				(e.pointerType !== "mouse" || e.button === 0)) ||
			(e.button === 1 && e.pointerType === "mouse") ||
			(e.pointerType === "pen" && e.pressure === 0)
		) {
			e.preventDefault();
			e.stopPropagation();
			const xStartMouse = e.clientX;
			const yStartMouse = e.clientY;
			const xStart = args.scale.xOffset;
			const yStart = args.scale.yOffset;
			moveHandler = (e: PointerEvent) => {
				const i = pointerCache.current.findIndex(
					(ev) => ev.pointerId === e.pointerId,
				);
				pointerCache.current[i] = e;
				e.preventDefault();
				e.stopPropagation();
				const newY = yStart + (e.clientY - yStartMouse);
				const newX = xStart + (e.clientX - xStartMouse);
				args.setScale({
					scale: args.scale.scale,
					xOffset: newX,
					yOffset: newY,
				});
			};
		} else if (
			pointerCache.current.length >= 2 &&
			e.pointerType === "touch"
		) {
			e.preventDefault();
			e.stopPropagation();
			let prevPointerDistance = -1;
			let previousX: number | null = null;
			let previousY: number | null = null;
			moveHandler = (e: PointerEvent) => {
				const i = pointerCache.current.findIndex(
					(ev) => ev.pointerId === e.pointerId,
				);
				pointerCache.current[i] = e;
				e.preventDefault();
				e.stopPropagation();
				if (pointerCache.current.length === 2) {
					const pointerDistance = Math.sqrt(
						(pointerCache.current[0].clientX -
							pointerCache.current[1].clientX) **
							2 +
							(pointerCache.current[0].clientY -
								pointerCache.current[1].clientY) **
								2,
					);
					if (prevPointerDistance > 0 && ref.current) {
						const delta = pointerDistance - prevPointerDistance;
						const mouseX =
							(pointerCache.current[0].clientX +
								pointerCache.current[1].clientX) /
							2;
						const mouseY =
							(pointerCache.current[0].clientY +
								pointerCache.current[1].clientY) /
							2;
						let xDiff = 0;
						let yDiff = 0;
						if (previousX !== null && previousY !== null) {
							xDiff = mouseX - previousX;
							yDiff = mouseY - previousY;
						}
						previousX = mouseX;
						previousY = mouseY;
						const bounds = ref.current.getBoundingClientRect();
						const zoomX =
							mouseX -
							bounds.x -
							bounds.width / 2 -
							args.scale.xOffset;
						const zoomY =
							mouseY -
							bounds.y -
							bounds.height / 2 -
							args.scale.yOffset;
						args.setScale((oldScale) => {
							const newScale = Math.min(
								Math.max(
									oldScale.scale *
										(1 + delta * TOUCH_ZOOM_SCALE),
									CONSTANT.ZOOM_MIN,
								),
								CONSTANT.ZOOM_MAX,
							);
							return {
								scale: newScale,
								xOffset:
									oldScale.xOffset -
									zoomX * (newScale / oldScale.scale) +
									zoomX +
									xDiff,
								yOffset:
									oldScale.yOffset -
									zoomY * (newScale / oldScale.scale) +
									zoomY +
									yDiff,
							};
						});
					}
					prevPointerDistance = pointerDistance;
				} else {
					prevPointerDistance = -1;
				}
			};
		}
		if (moveHandler) {
			const stopHandler: () => void = () => {
				e.preventDefault();
				e.stopPropagation();
				if (pointerCache.current.length < 1) {
					document.removeEventListener("pointerup", stopHandler, {
						capture: true,
					});
					document.removeEventListener("pointermove", moveHandler, {
						capture: true,
					});
				}
			};
			document.addEventListener("pointerup", stopHandler, {
				capture: true,
				passive: false,
			});
			document.addEventListener("pointermove", moveHandler, {
				capture: true,
				passive: false,
			});
		}
	};

	const pointerUp = (e: React.PointerEvent) => {
		const i = pointerCache.current.findIndex(
			(ev) => ev.pointerId === e.nativeEvent.pointerId,
		);
		pointerCache.current.splice(i, 1);
	};

	return (
		<div
			className={styles.editor}
			onContextMenu={(e) => {
				const hasOnContextMenu: (elem: HTMLElement) => boolean = (
					elem: HTMLElement,
				) => {
					if (elem === e.currentTarget) {
						return false;
					} else {
						const props = getReactProps(elem);
						if (props && props.onContextMenu) {
							return true;
						} else if (elem.parentElement) {
							return hasOnContextMenu(elem.parentElement);
						}
						return false;
					}
				};
				if (!hasOnContextMenu(e.target as HTMLElement)) {
					e.preventDefault();
					args.showContextMenu(
						[
							{
								label: "Return to Center",
								onClick: () => {
									args.setScale((oldScale) => {
										return {
											scale: oldScale.scale,
											xOffset: 0,
											yOffset: 0,
										};
									});
								},
							},
							{
								label: "Reset Zoom",
								onClick: () => {
									args.setScale((oldScale) => {
										return {
											scale: 1,
											xOffset: oldScale.xOffset,
											yOffset: oldScale.yOffset,
										};
									});
								},
							},
						],
						e.pageX,
						e.pageY,
					);
				}
			}}
			onPointerDownCapture={pointerDown}
			onPointerUpCapture={pointerUp}
			onWheel={(e) => {
				if (ref.current && args.layoutData) {
					let newScale = 0;
					const delta = Math.sign(e.deltaY);
					if (delta > 0) {
						newScale = Math.max(
							args.scale.scale / 1.05,
							CONSTANT.ZOOM_MIN,
						);
					} else if (delta < 0) {
						newScale = Math.min(
							args.scale.scale * 1.05,
							CONSTANT.ZOOM_MAX,
						);
					}

					const bounds = ref.current.getBoundingClientRect();
					const mouseX =
						e.clientX -
						bounds.x -
						bounds.width / 2 -
						args.scale.xOffset;
					const mouseY =
						e.clientY -
						bounds.y -
						bounds.height / 2 -
						args.scale.yOffset;
					args.setScale((oldScale) => {
						return {
							scale: newScale,
							xOffset:
								oldScale.xOffset -
								mouseX * (newScale / oldScale.scale) +
								mouseX,
							yOffset:
								oldScale.yOffset -
								mouseY * (newScale / oldScale.scale) +
								mouseY,
						};
					});
				}
			}}
			ref={ref}
		>
			{args.layoutData ? (
				<EmulatorWindow
					addElementData={args.addElementData}
					assets={args.assets}
					defaultPadding={args.layoutData.padding}
					editingElement={args.editingElement}
					elements={args.elements}
					focusState={args.focusState}
					getCurrentBackgroundAssetName={
						args.getCurrentBackgroundAssetName
					}
					height={args.layoutData.canvas.height}
					hoverIndex={args.hoverIndex}
					pressedKeys={args.pressedKeys}
					removeElement={args.removeElement}
					scale={args.scale.scale}
					setAssets={args.setAssets}
					setEditingElement={args.setEditingElement}
					setHoverIndex={args.setHoverIndex}
					showContextMenu={args.showContextMenu}
					showPopup={args.showPopup}
					style={{
						transform: `translate(${args.scale.xOffset}px, ${args.scale.yOffset}px)`,
					}}
					updateElement={args.updateElement}
					width={args.layoutData.canvas.width}
				/>
			) : (
				<></>
			)}
		</div>
	);
}
