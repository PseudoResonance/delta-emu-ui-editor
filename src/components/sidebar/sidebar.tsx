"use client";
import styles from "./sidebar.module.css";
import React from "react";
import { ContextMenu, InfoFile } from "@/data/types";
import { Spec } from "immutability-helper";
import SkinInfoWindow from "../windows/skinInfoWindow";
import RepresentationTreeWindow from "../windows/representationTreeWindow";

export default function Sidebar(args: {
	infoFile: InfoFile;
	setInfoFile: (stateUpdate: Spec<InfoFile, never>) => void;
	applyRepresentation: (key: string) => void;
	currentRepresentation: string;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
	deleteNode: (key: string) => void;
	createNode: (key: string, isLayout: boolean) => void;
	hiddenNarrow: boolean;
}) {
	return (
		<div
			className={`${styles.sidebar} ${styles.sidebarLeft} ${args.hiddenNarrow ? styles.hideNarrow : styles.showNarrow}`}
		>
			<div>
				<SkinInfoWindow
					infoFile={args.infoFile}
					setInfoFile={args.setInfoFile}
				/>
			</div>
			<hr />
			<div>
				<RepresentationTreeWindow
					applyRepresentation={args.applyRepresentation}
					createNode={args.createNode}
					currentRepresentation={args.currentRepresentation}
					deleteNode={args.deleteNode}
					infoFile={args.infoFile}
					showContextMenu={args.showContextMenu}
					showPopup={args.showPopup}
				/>
			</div>
		</div>
	);
}
