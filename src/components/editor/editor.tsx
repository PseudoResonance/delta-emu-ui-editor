"use client";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import EmulatorWindow from "./window";
import styles from "./editor.module.css";
import {
	Asset,
	ContextMenu,
	EmulatorElement,
	EmulatorLayout,
} from "@/data/types";
import { Spec } from "immutability-helper";
import { getReactProps } from "@/utils/reactInternals";

export default function MainEditor(args: {
	getCurrentBackgroundAssetName: () => string;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	pressedKeys: string[];
	elements: EmulatorElement[];
	addElementData: (data: EmulatorElement) => void;
	removeElement: (key: number) => void;
	updateElement: (key: number, data: Spec<EmulatorElement, never>) => void;
	layoutData: EmulatorLayout | null;
	editingElement: number;
	setEditingElement: Dispatch<SetStateAction<number>>;
	scale: number;
	setScale: Dispatch<SetStateAction<number>>;
	xOffset: number;
	setXOffset: Dispatch<SetStateAction<number>>;
	yOffset: number;
	setYOffset: Dispatch<SetStateAction<number>>;
	hoverIndex: number;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
}) {
	let xStart = 0,
		yStart = 0,
		xStartMouse = 0,
		yStartMouse = 0;
	const stopDragging = () => {
		document.onmouseup = null;
		document.onmousemove = null;
	};
	const ref = useRef<HTMLDivElement>(null);

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
									args.setXOffset(0);
									args.setYOffset(0);
								},
							},
							{
								label: "Reset Zoom",
								onClick: () => {
									args.setScale(1);
								},
							},
						],
						e.pageX,
						e.pageY,
					);
				}
			}}
			onMouseDown={(e) => {
				if (
					args.pressedKeys.includes("ControlLeft") ||
					args.pressedKeys.includes("ControlRight")
				) {
					e.preventDefault();
					xStartMouse = e.clientX;
					yStartMouse = e.clientY;
					xStart = args.xOffset;
					yStart = args.yOffset;
					document.onmouseup = stopDragging;
					document.onmousemove = (e) => {
						e.preventDefault();
						const newY = yStart + (e.clientY - yStartMouse);
						const newX = xStart + (e.clientX - xStartMouse);
						args.setXOffset(newX);
						args.setYOffset(newY);
					};
				}
			}}
			onWheel={(e) => {
				if (ref.current && args.layoutData) {
					let newScale = 0;
					const delta = Math.sign(e.deltaY);
					const oldScale = args.scale;
					if (delta > 0) {
						newScale = args.scale / 1.05;
						if (newScale < 0) newScale = 0;
					} else if (delta < 0) {
						newScale = args.scale * 1.05;
					}
					const bounds = ref.current.getBoundingClientRect();
					const mouseX =
						e.clientX - bounds.x - bounds.width / 2 - args.xOffset;
					const mouseY =
						e.clientY - bounds.y - bounds.height / 2 - args.yOffset;
					args.setScale(newScale);
					args.setXOffset(
						args.xOffset - mouseX * (newScale / oldScale) + mouseX,
					);
					args.setYOffset(
						args.yOffset - mouseY * (newScale / oldScale) + mouseY,
					);
				}
			}}
		>
			{args.layoutData ? (
				<EmulatorWindow
					getCurrentBackgroundAssetName={
						args.getCurrentBackgroundAssetName
					}
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
					scale={args.scale}
					setEditingElement={args.setEditingElement}
					showContextMenu={args.showContextMenu}
					showPopup={args.showPopup}
					style={{
						transform: `translate(${args.xOffset}px, ${args.yOffset}px)`,
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
