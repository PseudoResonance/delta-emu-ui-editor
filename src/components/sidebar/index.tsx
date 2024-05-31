"use client";
import styles from "./index.module.css";
import React, { useEffect, useRef } from "react";

export default function Sidebar(args: {
	children?: React.JSX.Element | React.JSX.Element[];
	hiddenNarrow: boolean;
	position: SidebarPosition;
	requestVisible: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const onFocus = () => {
			args.requestVisible();
		};
		ref.current?.addEventListener("focusin", onFocus);
		return () => {
			ref.current?.removeEventListener("focusin", onFocus);
		};
	});
	return (
		<div
			className={`${styles.sidebar} ${getStyle(args.position)} ${args.hiddenNarrow ? styles.hideNarrow : styles.showNarrow}`}
			ref={ref}
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
