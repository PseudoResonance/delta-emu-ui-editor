"use client";
import React, { useMemo } from "react";
import styles from "../input.module.css";

export default function Button(args: {
	onClick: () => void;
	label: string | React.JSX.Element;
}) {
	const id = useMemo(() => (Math.random() + 1).toString(36).substring(2), []);
	return (
		<form className={`${styles.input} ${styles.button}`}>
			<span
				style={{
					overflow: "hidden",
					width: 0,
					height: 0,
					padding: 0,
					margin: -1,
					position: "fixed",
				}}
			>
				<button id={id} onClick={args.onClick} type="button"></button>
			</span>
			<label className={styles.inputInner} htmlFor={id}>
				<span>{args.label}</span>
			</label>
		</form>
	);
}
