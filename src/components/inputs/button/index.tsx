"use client";
import React, { CSSProperties, PropsWithChildren, useMemo } from "react";
import styles from "../input.module.css";

export default function Button(
	args: PropsWithChildren<{
		label?: string;
		onClick: () => void;
		style?: CSSProperties;
	}>,
) {
	const id = useMemo(() => (Math.random() + 1).toString(36).substring(2), []);
	return (
		<form
			className={`${styles.input} ${styles.button}`}
			style={{ ...args.style }}
		>
			<span
				style={{
					height: 0,
					margin: -1,
					overflow: "hidden",
					padding: 0,
					position: "fixed",
					width: 0,
				}}
			>
				<button id={id} onClick={args.onClick} type="button"></button>
			</span>
			<label
				aria-label={"label" in args ? args.label : undefined}
				className={styles.inputInner}
				htmlFor={id}
				style={{ gridColumn: "start / end" }}
				title={"label" in args ? args.label : undefined}
			>
				<span>{args.children}</span>
			</label>
		</form>
	);
}
