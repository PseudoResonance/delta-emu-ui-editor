"use client";
import styles from "./tree.module.css";
import React from "react";
import { MouseEvent } from "react";

interface BaseArgs {
	label: string | React.JSX.Element;
	showActive?: boolean;
	onClick?: (e: MouseEvent<HTMLDivElement>) => void;
	onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
	onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
	onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
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

export default function TreeElement(args: Args) {
	const actionHandlers: Record<string, object> = {};
	if (typeof args.onClick === "function")
		actionHandlers.onClick = args.onClick;
	if (typeof args.onContextMenu === "function")
		actionHandlers.onContextMenu = args.onContextMenu;
	if (typeof args.onMouseEnter === "function")
		actionHandlers.onMouseEnter = args.onMouseEnter;
	if (typeof args.onMouseLeave === "function")
		actionHandlers.onMouseLeave = args.onMouseLeave;
	return (
		<div
			className={`${styles.tree}${
				args.showActive ? " " + styles.active : ""
			}`}
		>
			{Object.keys(actionHandlers).length > 0 ? (
				typeof args.label !== "string" ? (
					<div className={styles.clickable} {...actionHandlers}>
						{args.label}
					</div>
				) : (
					<p className={styles.clickable} {...actionHandlers}>
						{args.label.length > 0 ? args.label : "\u00A0"}
					</p>
				)
			) : typeof args.label !== "string" ? (
				<div>{args.label}</div>
			) : (
				<p>{args.label.length > 0 ? args.label : "\u00A0"}</p>
			)}

			<div className={styles.treeSub}>
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
