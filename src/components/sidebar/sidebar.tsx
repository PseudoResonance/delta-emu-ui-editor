"use client";
import styles from "./sidebar.module.css";
import React from "react";

export default function Sidebar(args: {
	hiddenNarrow: boolean;
	children?: React.JSX.Element | React.JSX.Element[];
	position: SidebarPosition;
}) {
	return (
		<div
			className={`${styles.sidebar} ${getStyle(args.position)} ${args.hiddenNarrow ? styles.hideNarrow : styles.showNarrow}`}
		>
			{...(args.children
				? args.children instanceof Array
					? args.children
					: [args.children]
				: []
			).reduce<React.JSX.Element[]>(
				(val, elem, i, arr) => (
					val.push(
						elem,
						...(i + 1 < arr.length ? [<hr key={i} />] : []),
					),
					val
				),
				[],
			)}
		</div>
	);
}

const getStyle = (position: SidebarPosition) => {
	switch (position) {
		case SidebarPosition.LEFT:
			return styles.sidebarLeft;
		case SidebarPosition.RIGHT:
			return styles.sidebarRight;
	}
};

export enum SidebarPosition {
	LEFT,
	RIGHT,
}
