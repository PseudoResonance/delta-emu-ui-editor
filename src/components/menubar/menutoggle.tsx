"use client";
import styles from "./index.module.css";
import React from "react";

export default function MenuToggle(args: {
	label: string | React.JSX.Element;
	onClick: () => void;
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
}) {
	return (
		<button
			className={`${styles.menutoggle} ${args.className}`}
			onClick={() => {
				args.onClick();
			}}
			style={args.style}
		>
			{args.label}
		</button>
	);
}
