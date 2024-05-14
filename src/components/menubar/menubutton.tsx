"use client";
import styles from "./menu.module.css";
import React from "react";

export default function MenuButton(args: {
	label: string;
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			className={`${styles.menubutton}${args.disabled ? " " + styles.disabled : ""}`}
			onClick={() => {
				if (!args.disabled) args.onClick();
			}}
		>
			{args.label}
		</button>
	);
}
