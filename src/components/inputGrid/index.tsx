"use client";
import { CSSProperties, PropsWithChildren } from "react";
import styles from "./index.module.css";

export default function InputGrid(
	args: PropsWithChildren<{
		style?: CSSProperties;
	}>,
) {
	return (
		<div className={styles.inputGrid} style={args.style}>
			{args.children}
		</div>
	);
}
