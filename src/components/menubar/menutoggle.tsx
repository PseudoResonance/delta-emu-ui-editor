"use client";
import styles from "./index.module.css";
import React from "react";

export default function MenuToggle(args: {
	className?: string;
	disabled?: boolean;
	label: string | React.JSX.Element;
	onClick: () => void;
	style?: React.CSSProperties;
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
