"use client";
import React from "react";
import styles from "./input.module.css";

export default function Button(args: {
	onClick: () => void;
	label: string | React.JSX.Element;
}) {
	return (
		<div
			className={`${styles.input} ${styles.button}`}
			onClick={() => {
				args.onClick();
			}}
		>
			<div className={styles.inputInner}>{args.label}</div>
		</div>
	);
}
