"use client";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";
import EmulatorWindow from "./display";
import styles from "./index.module.css";
import {
	Asset,
	ShowContextMenuFunc,
	EmulatorElement,
	EmulatorLayout,
	FocusState,
	ScaleData,
	ShowPopupFunc,
} from "@/data/types";
import { Spec } from "immutability-helper";
import { getReactProps } from "@/utils/reactInternals";
import { getElementLabel } from "./element";
import * as CONSTANT from "@/data/constants";

export default function VisualEditor(args: {
	addElementData: (data: EmulatorElement) => void;
	assets: Record<string, Asset> | null;
	editingElement: number;
	elements: EmulatorElement[];
	focusState: FocusState;
	getCurrentBackgroundAssetName: () => string;
	hoverIndex: number;
	layoutData: EmulatorLayout | null;
	pressedKeys: string[];
	removeElement: (key: number) => void;
	scale: ScaleData;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	setEditingElement: (val: number) => void;
	setHoverIndex: Dispatch<SetStateAction<number>>;
	setScale: Dispatch<SetStateAction<ScaleData>>;
	showContextMenu: ShowContextMenuFunc;
	showPopup: ShowPopupFunc;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
}) {
	const panZoom = useCallback(
		(
			bounds: DOMRect,
			xPos: number,
			yPos: number,
			deltaZoom: number,
			deltaX: number = 0,
			deltaY: number = 0,
		) => {
			args.setScale((oldScale) => {
				const newScale = Math.min(
					Math.max(
						oldScale.scale * (1 + deltaZoom),
						CONSTANT.ZOOM_MIN,
					),
					CONSTANT.ZOOM_MAX,
				);
				const mouseX =
					xPos - bounds.x - bounds.width / 2 - oldScale.xOffset;
				const mouseY =
					yPos - bounds.y - bounds.height / 2 - oldScale.yOffset;
				return {
					scale: newScale,
					xOffset:
						oldScale.xOffset -
						mouseX * (newScale / oldScale.scale) +
						mouseX +
						deltaX,
					yOffset:
						oldScale.yOffset -
						mouseY * (newScale / oldScale.scale) +
						mouseY +
						deltaY,
				};
			});
		},
		[],
	);

	const ref = useRef<HTMLDivElement>(null);
	const focused = useRef<boolean>(false);

	const pointerCache = useRef<PointerEvent[]>([]);

	const editLock = useMemo(() => [false], []);

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
		const onClear = () => {
			pointerCache.current.splice(0);
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
			window.addEventListener("blur", onClear);
			return () => {
				if (ref.current) {
					window.removeEventListener("keydown", onKeyDown);
					window.removeEventListener("pointerdown", onPointerDown);
					window.removeEventListener("blur", onClear);
				}
			};
		}
	}, [args.elements, args.editingElement]);

	const pointerDown = (e: React.PointerEvent) => {
		pointerCache.current.push(e.nativeEvent);
		let moveHandler: ((e: PointerEvent) => void) | null = null;
		const stopHandler: () => void = () => {
			if (pointerCache.current.length === 0) {
				editLock[0] = false;
				document.removeEventListener("pointerup", stopHandler, {
					capture: true,
				});
				if (moveHandler)
					document.removeEventListener("pointermove", moveHandler, {
						capture: true,
					});
			}
		};
		if (
			!editLock[0] &&
			pointerCache.current.length === 1 &&
			((e.ctrlKey && (e.pointerType !== "mouse" || e.button === 0)) ||
				(e.button === 1 && e.pointerType === "mouse") ||
				(e.pointerType === "pen" && e.pressure === 0))
		) {
			editLock[0] = true;
			e.preventDefault();
			e.stopPropagation();
			const xStartMouse = e.clientX;
			const yStartMouse = e.clientY;
			const xStart = args.scale.xOffset;
			const yStart = args.scale.yOffset;
			moveHandler = (e: PointerEvent) => {
				if (pointerCache.current.length === 0) {
					editLock[0] = false;
					document.removeEventListener("pointerup", stopHandler, {
						capture: true,
					});
					if (moveHandler)
						document.removeEventListener(
							"pointermove",
							moveHandler,
							{
								capture: true,
							},
						);
					return false;
				}
				const i = pointerCache.current.findIndex(
					(ev) => ev.pointerId === e.pointerId,
				);
				pointerCache.current[i] = e;
				e.preventDefault();
				const newY = yStart + (e.clientY - yStartMouse);
				const newX = xStart + (e.clientX - xStartMouse);
				args.setScale({
					scale: args.scale.scale,
					xOffset: newX,
					yOffset: newY,
				});
			};
		} else if (
			!editLock[0] &&
			pointerCache.current.length >= 2 &&
			e.pointerType === "touch"
		) {
			e.preventDefault();
			let prevPointerDistance: number | null = null;
			let previousX: number | null = null;
			let previousY: number | null = null;
			moveHandler = (e: PointerEvent) => {
				if (
					pointerCache.current.length === 0 ||
					pointerCache.current.length > 2
				) {
					editLock[0] = false;
					document.removeEventListener("pointerup", stopHandler, {
						capture: true,
					});
					if (moveHandler)
						document.removeEventListener(
							"pointermove",
							moveHandler,
							{
								capture: true,
							},
						);
					return false;
				}
				const i = pointerCache.current.findIndex(
					(ev) => ev.pointerId === e.pointerId,
				);
				pointerCache.current[i] = e;
				e.preventDefault();
				if (pointerCache.current.length === 2) {
					editLock[0] = true;
					const pointerDistance = Math.sqrt(
						(pointerCache.current[0].screenX -
							pointerCache.current[1].screenX) **
							2 +
							(pointerCache.current[0].screenY -
								pointerCache.current[1].screenY) **
								2,
					);
					const clientX =
						(pointerCache.current[0].clientX +
							pointerCache.current[1].clientX) /
						2;
					const clientY =
						(pointerCache.current[0].clientY +
							pointerCache.current[1].clientY) /
						2;
					if (
						prevPointerDistance !== null &&
						previousX !== null &&
						previousY !== null &&
						ref.current
					) {
						panZoom(
							ref.current.getBoundingClientRect(),
							clientX,
							clientY,
							(pointerDistance - prevPointerDistance) *
								CONSTANT.TOUCH_ZOOM_SCALE,
							clientX - previousX,
							clientY - previousY,
						);
					}
					prevPointerDistance = pointerDistance;
					previousX = clientX;
					previousY = clientY;
				} else {
					prevPointerDistance = null;
					previousX = null;
					previousY = null;
				}
			};
		}
		if (moveHandler) {
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
			onPointerDown={(e) => {
				const hasOnClick: (elem: HTMLElement) => boolean = (
					elem: HTMLElement,
				) => {
					if (elem === e.currentTarget) {
						return false;
					} else {
						const props = getReactProps(elem);
						if (
							props &&
							(props.onClick ||
								props.onClickCapture ||
								props.onPointerDown ||
								props.onPointerDownCapture)
						) {
							return true;
						} else if (elem.parentElement) {
							return hasOnClick(elem.parentElement);
						}
						return false;
					}
				};
				if (!hasOnClick(e.target as HTMLElement)) {
					args.setEditingElement(-1);
					args.setHoverIndex(-1);
				}
			}}
			onPointerDownCapture={pointerDown}
			onPointerUpCapture={pointerUp}
			onWheel={(e) => {
				if (ref.current && args.layoutData) {
					panZoom(
						ref.current.getBoundingClientRect(),
						e.clientX,
						e.clientY,
						-Math.sign(e.deltaY) * 0.05,
					);
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
					isEditing={editLock}
					pressedKeys={args.pressedKeys}
					removeElement={args.removeElement}
					scale={args.scale.scale}
					setAssets={args.setAssets}
					setEditingElement={args.setEditingElement}
					setHoverIndex={args.setHoverIndex}
					setIsEditing={(val: boolean) => {
						editLock[0] = val;
					}}
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
