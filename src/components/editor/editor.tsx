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
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
}) {
	const ref = useRef<HTMLDivElement>(null);

	const pointerCache: PointerEvent[] = [];

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
	}, []);

	const pointerDown = (e: React.PointerEvent) => {
		pointerCache.push(e.nativeEvent);
		if (pointerCache.length === 1) {
			let moveHandler: (e: PointerEvent) => void;
			if (e.ctrlKey) {
				e.preventDefault();
				const xStartMouse = e.clientX;
				const yStartMouse = e.clientY;
				const xStart = args.scale.xOffset;
				const yStart = args.scale.yOffset;
				moveHandler = (e: PointerEvent) => {
					const i = pointerCache.findIndex(
						(ev) => ev.pointerId === e.pointerId,
					);
					pointerCache[i] = e;
					e.preventDefault();
					const newY = yStart + (e.clientY - yStartMouse);
					const newX = xStart + (e.clientX - xStartMouse);
					args.setScale({
						scale: args.scale.scale,
						xOffset: newX,
						yOffset: newY,
					});
				};
			} else {
				let previousDiff = -1;
				let previousX: number | null = null;
				let previousY: number | null = null;
				moveHandler = (e: PointerEvent) => {
					const i = pointerCache.findIndex(
						(ev) => ev.pointerId === e.pointerId,
					);
					pointerCache[i] = e;
					e.preventDefault();
					if (pointerCache.length === 2) {
						const pointerDiff = Math.sqrt(
							(pointerCache[0].clientX -
								pointerCache[1].clientX) **
								2 +
								(pointerCache[0].clientY -
									pointerCache[1].clientY) **
									2,
						);
						if (previousDiff > 0 && ref.current) {
							const delta = pointerDiff - previousDiff;
							const mouseX =
								(pointerCache[0].clientX +
									pointerCache[1].clientX) /
								2;
							const mouseY =
								(pointerCache[0].clientY +
									pointerCache[1].clientY) /
								2;
							let xDiff = 0;
							let yDiff = 0;
							if (previousX !== null && previousY !== null) {
								xDiff = mouseX - previousX;
								yDiff = mouseY - previousY;
							}
							previousX = mouseX;
							previousY = mouseY;
							args.setScale((oldScale) => {
								return {
									scale: oldScale.scale * (1 + delta / 300),
									xOffset: oldScale.xOffset + xDiff,
									yOffset: oldScale.yOffset + yDiff,
								};
							});
						}
						previousDiff = pointerDiff;
					}
				};
			}
			const stopHandler = () => {
				document.removeEventListener("pointerup", stopHandler);
				if (moveHandler)
					document.removeEventListener("pointermove", moveHandler);
			};
			document.addEventListener("pointerup", stopHandler);
			if (moveHandler)
				document.addEventListener("pointermove", moveHandler);
		}
	};

	const pointerUp = (e: React.PointerEvent) => {
		const i = pointerCache.findIndex(
			(ev) => ev.pointerId === e.nativeEvent.pointerId,
		);
		pointerCache.splice(i, 1);
	};

	return (
		<div
			ref={ref}
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
			onPointerDown={pointerDown}
			onPointerUp={pointerUp}
			onWheel={(e) => {
				if (ref.current && args.layoutData) {
					let newScale = 0;
					const delta = Math.sign(e.deltaY);
					if (delta > 0) {
						newScale = args.scale.scale / 1.05;
						if (newScale < 0) newScale = 0;
					} else if (delta < 0) {
						newScale = args.scale.scale * 1.05;
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
		>
			{args.layoutData ? (
				<EmulatorWindow
					getCurrentBackgroundAssetName={
						args.getCurrentBackgroundAssetName
					}
					focusState={args.focusState}
					assets={args.assets}
					setAssets={args.setAssets}
					addElementData={args.addElementData}
					editingElement={args.editingElement}
					elements={args.elements}
					height={args.layoutData.canvas.height}
					hoverIndex={args.hoverIndex}
					padding={args.layoutData.padding}
					pressedKeys={args.pressedKeys}
					removeElement={args.removeElement}
					scale={args.scale.scale}
					setEditingElement={args.setEditingElement}
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
