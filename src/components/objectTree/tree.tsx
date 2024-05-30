"use client";
import styles from "./index.module.css";
import React, { MouseEvent, SyntheticEvent } from "react";

interface BaseArgs {
	label: string | React.JSX.Element;
	showActive?: boolean;
	onClick?: (e: SyntheticEvent<HTMLDivElement>) => void;
	onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
	onPointerEnter?: (e: SyntheticEvent<HTMLDivElement>) => void;
	onPointerLeave?: (e: SyntheticEvent<HTMLDivElement>) => void;
}

interface ChildrenDefined extends BaseArgs {
	children?: string | React.JSX.Element | React.JSX.Element[] | false;
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
	const children =
		"getChildren" in args
			? args.getChildren(args.data, args.keyStr, args.depth)
			: args.children instanceof Array
				? args.children && args.children
				: args.children
					? [args.children]
					: [];
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
			aria-expanded={true}
			aria-selected={
				typeof args.onClick === "function"
					? args.showActive
						? true
						: false
					: undefined
			}
			className={`${styles.tree}${
				args.showActive ? " " + styles.active : ""
			}`}
			data-type={"tree-node"}
			onBlur={(e) => {
				if (args.onPointerLeave) args.onPointerLeave(e);
			}}
			onClick={(e) => {
				if (args.onClick) {
					args.onClick(e);
					e.stopPropagation();
				}
			}}
			onContextMenu={(e) => {
				if (e.target === e.currentTarget && args.onContextMenu) {
					args.onContextMenu(e);
					e.preventDefault();
				}
			}}
			onFocus={(e) => {
				if (args.onPointerEnter) args.onPointerEnter(e);
			}}
			onKeyDown={(e) => {
				if (e.target === e.currentTarget) {
					const elem = e.target as HTMLElement;
					let children;
					switch (e.key) {
						case "ArrowUp":
							if (
								elem.previousElementSibling?.getAttribute(
									"data-type",
								) === "tree-node"
							) {
								(
									elem.previousElementSibling as HTMLElement
								).focus();
								e.preventDefault();
							} else if (
								elem.parentElement?.parentElement?.getAttribute(
									"data-type",
								) === "tree-node"
							) {
								elem.parentElement?.parentElement.focus();
								e.preventDefault();
							}
							break;
						case "ArrowDown":
							if (
								elem.nextElementSibling?.getAttribute(
									"data-type",
								) === "tree-node"
							) {
								(
									elem.nextElementSibling as HTMLElement
								).focus();
								e.preventDefault();
							} else {
								children = elem.querySelector(
									'[data-type="tree-children"]',
								);
								if (
									children &&
									children.children.length > 0 &&
									children.children[0].getAttribute(
										"data-type",
									) === "tree-node"
								) {
									(
										children.children[0] as HTMLElement
									).focus();
									e.preventDefault();
								}
							}
							break;
						case "ArrowLeft":
							if (
								elem.parentElement?.parentElement?.getAttribute(
									"data-type",
								) === "tree-node"
							) {
								elem.parentElement?.parentElement.focus();
								e.preventDefault();
							}
							break;
						case "ArrowRight":
							children = elem.querySelector(
								'[data-type="tree-children"]',
							);
							if (
								children &&
								children.children.length > 0 &&
								children.children[0].getAttribute(
									"data-type",
								) === "tree-node"
							) {
								(children.children[0] as HTMLElement).focus();
								e.preventDefault();
							}
							break;
						case "Enter":
							if (args.onClick) args.onClick(e);
							break;
					}
				}
			}}
			role="treeitem"
			tabIndex={-1}
		>
			{Object.keys(actionHandlers).length > 0 ? (
				typeof args.label !== "string" ? (
					<div
						className={`${styles.label} ${styles.clickable}`}
						role="none"
						{...actionHandlers}
					>
						{args.label}
					</div>
				) : (
					<p
						className={`${styles.label} ${styles.clickable}`}
						role="none"
						{...actionHandlers}
					>
						{args.label.length > 0 ? args.label : "\u00A0"}
					</p>
				)
			) : typeof args.label !== "string" ? (
				<div className={styles.label} role="none">
					{args.label}
				</div>
			) : (
				<p className={styles.label} role="none">
					{args.label.length > 0 ? args.label : "\u00A0"}
				</p>
			)}

			{children.length > 0 && (
				<div
					className={styles.treeChildren}
					data-type={"tree-children"}
					role="group"
				>
					{...children}
				</div>
			)}
		</div>
	);
}
