"use client";
import React from "react";
import styles from "./input.module.css";

export default function Button(args: {
	onClick: () => void;
	label: string | React.JSX.Element;
}) {
	return (
		<button
			className={`${styles.input} ${styles.button}`}
			onClick={() => {
				args.onClick();
			}}
		>
			<span className={styles.inputInner}>{args.label}</span>
		</button>
	);
}
