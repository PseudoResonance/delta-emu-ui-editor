"use client";
import styles from "./index.module.css";
import React, { Dispatch, SetStateAction } from "react";

export default function MenuCategory(args: {
	label: string;
	children?: React.JSX.Element | React.JSX.Element[];
	isActive: boolean;
	setIsActive: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div className={`${styles.menucategory}`}>
			<button
				className={styles.label}
				data-type={"menu-category"}
				onClick={() => {
					args.setIsActive(true);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") args.setIsActive(true);
				}}
				onPointerOut={() => {
					if (args.isActive && document.activeElement)
						(document.activeElement as HTMLElement).blur();
				}}
			>
				{args.label}
			</button>

			<div className={styles.menudropdown}>
				{...args.children
					? args.children instanceof Array
						? args.children
						: [args.children]
					: []}
			</div>
		</div>
	);
}
