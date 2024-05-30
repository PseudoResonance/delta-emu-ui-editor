"use client";
import styles from "./index.module.css";
import React from "react";

export default function MenuButton(args: {
	label: string | React.JSX.Element;
	onClick: () => void;
	disabled?: boolean;
	style?: React.CSSProperties;
}) {
	return (
		<button
			className={`${styles.menubutton}${args.disabled ? " " + styles.disabled : ""}`}
			onClick={() => {
				if (!args.disabled) args.onClick();
			}}
			style={args.style}
			tabIndex={-1}
		>
			{args.label}
		</button>
	);
}
