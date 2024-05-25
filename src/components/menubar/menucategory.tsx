"use client";
import styles from "./menu.module.css";
import React, { Dispatch, SetStateAction } from "react";

export default function MenuCategory(args: {
	label: string;
	subElements: React.JSX.Element[];
	isActive: boolean;
	setIsActive: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div className={`${styles.menucategory}`}>
			<button
				className={styles.label}
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

			<div className={styles.menudropdown}>{args.subElements}</div>
		</div>
	);
}
