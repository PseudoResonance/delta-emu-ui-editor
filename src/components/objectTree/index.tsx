"use client";
import styles from "./index.module.css";
import React, { MouseEvent, PointerEvent } from "react";

interface BaseArgs {
	label: string | React.JSX.Element;
	showActive?: boolean;
	onClick?: (e: MouseEvent<HTMLDivElement>) => void;
	onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
	onPointerEnter?: (e: PointerEvent<HTMLDivElement>) => void;
	onPointerLeave?: (e: PointerEvent<HTMLDivElement>) => void;
}

interface ChildrenDefined extends BaseArgs {
	children: React.JSX.Element | React.JSX.Element[];
}

interface ChildrenFunction extends BaseArgs {
	getChildren: (
		e: Record<string, unknown>,
		keyStr: string,
		depth: number,
	) => React.JSX.Element[];
	data: Record<string, unknown>;
	keyStr: string;
	depth: number;
}

type Args = ChildrenDefined | ChildrenFunction;

export default function TreeItem(args: Args) {
	const actionHandlers: Record<string, object> = {};
	if (typeof args.onClick === "function")
		actionHandlers.onClick = args.onClick;
	if (typeof args.onContextMenu === "function")
		actionHandlers.onContextMenu = args.onContextMenu;
	if (typeof args.onPointerEnter === "function")
		actionHandlers.onMouseEnter = args.onPointerEnter;
	if (typeof args.onPointerLeave === "function")
		actionHandlers.onMouseLeave = args.onPointerLeave;
	return (
		<div
			className={`${styles.tree}${
				args.showActive ? " " + styles.active : ""
			}`}
		>
			{Object.keys(actionHandlers).length > 0 ? (
				typeof args.label !== "string" ? (
					<div
						className={`${styles.label} ${styles.clickable}`}
						{...actionHandlers}
					>
						{args.label}
					</div>
				) : (
					<p
						className={`${styles.label} ${styles.clickable}`}
						{...actionHandlers}
					>
						{args.label.length > 0 ? args.label : "\u00A0"}
					</p>
				)
			) : typeof args.label !== "string" ? (
				<div className={styles.label}>{args.label}</div>
			) : (
				<p className={styles.label}>
					{args.label.length > 0 ? args.label : "\u00A0"}
				</p>
			)}

			<div className={styles.treeChildren}>
				{..."getChildren" in args
					? args.getChildren(args.data, args.keyStr, args.depth)
					: args.children instanceof Array
						? args.children
						: args.children
							? [args.children]
							: []}
			</div>
		</div>
	);
}
