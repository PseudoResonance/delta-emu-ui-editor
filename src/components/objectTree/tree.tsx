"use client";
import styles from "./index.module.css";
import React, { MouseEvent, SyntheticEvent } from "react";

interface BaseArgs {
	label: string | React.JSX.Element;
	onClick?: (e: SyntheticEvent<HTMLDivElement>) => void;
	onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
	onPointerEnter?: (e: SyntheticEvent<HTMLDivElement>) => void;
	onPointerLeave?: (e: SyntheticEvent<HTMLDivElement>) => void;
	showActive?: boolean;
}

interface ChildrenDefined extends BaseArgs {
	children?: string | React.JSX.Element | React.JSX.Element[] | false;
}

interface ChildrenFunction extends BaseArgs {
	data: Record<string, unknown>;
	depth: number;
	getChildren: (
		e: Record<string, unknown>,
		keyStr: string,
		depth: number,
	) => React.JSX.Element[];
	keyStr: string;
}

type Args = ChildrenDefined | ChildrenFunction;

const getChildNode: (e: HTMLElement, lowestNode: boolean) => HTMLElement | null = (e: HTMLElement, lowestNode: boolean) => {
	if (e.children.length > 0) {
		if (lowestNode) {
			for (let i = e.children.length - 1; i >= 0; i--) {
				const node = getChildNode(e.children[i] as HTMLElement, lowestNode);
				if (node) {
					return node;
				}
			}
		} else {
			for (let i = 0; i < e.children.length; i++) {
				if (e.children[i].getAttribute("data-type") === "tree-node") {
					return e.children[i] as HTMLElement;
				}
				const node = getChildNode(e.children[i] as HTMLElement, lowestNode);
				if (node) {
					return node;
				}
			}
		}
	}
	if (e.getAttribute("data-type") === "tree-node") {
		return e;
	}
	return null;
};

const getParentNode: (e: HTMLElement) => HTMLElement | null = (e: HTMLElement) => {
	const parent = e.parentElement;
	if (parent && parent.getAttribute("data-type") !== "tree-wrapper") {
		if (parent.getAttribute("data-type") === "tree-node") {
			return parent;
		} else {
			return getParentNode(parent);
		}
	}
	return null;
};

const getAboveNode: (e: HTMLElement) => HTMLElement | null = (e: HTMLElement) => {
	const testElem = e.previousElementSibling;
	if (testElem) {
		const node = getChildNode(testElem as HTMLElement, true);
		if (node) {
			return node;
		}
		return getAboveNode(testElem as HTMLElement);
	} else if (e.getAttribute("data-type") !== "tree-wrapper") {
		return getParentNode(e);
	}
	return null;
};

const getBelowNode: (e: HTMLElement, tryChildren: boolean) => HTMLElement | null = (e: HTMLElement, tryChildren: boolean) => {
	let testElem;
	if (tryChildren && e.getAttribute("data-type") === "tree-node") {
		testElem = getChildNode(e, false);
		if (testElem && testElem !== e) {
			return testElem;
		}
	}
	testElem = e.nextElementSibling as HTMLElement;
	if (testElem) {
		if (testElem.getAttribute("data-type") === "tree-node") {
			return testElem;
		} else {
			return getBelowNode(testElem, true);
		}
	}
	if (e.getAttribute("data-type") !== "tree-wrapper") {
		const parent = getParentNode(e);
		if (parent) {
			return getBelowNode(parent, false);
		}
	}
	return null;
};

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
					let newFocus;
					switch (e.key) {
						case "ArrowUp":
							newFocus = getAboveNode(e.target as HTMLElement);
							if (newFocus) {
								newFocus.focus();
								e.preventDefault();
							}
							break;
						case "ArrowDown":
							newFocus = getBelowNode(e.target as HTMLElement, true);
							if (newFocus) {
								newFocus.focus();
								e.preventDefault();
							}
							break;
						case "ArrowLeft":
							newFocus = getParentNode(e.target as HTMLElement);
							if (newFocus) {
								newFocus.focus();
								e.preventDefault();
							}
							break;
						case "ArrowRight":
							newFocus = getChildNode(e.target as HTMLElement, false);
							if (newFocus) {
								newFocus.focus();
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
