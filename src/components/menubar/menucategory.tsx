"use client";
import styles from "./index.module.css";
import React, { Dispatch, PropsWithChildren, SetStateAction } from "react";

export default function MenuCategory(
	args: PropsWithChildren<{
		isActive: boolean;
		label: string;
		setIsActive: Dispatch<SetStateAction<boolean>>;
	}>,
) {
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

			<div className={styles.menudropdown}>{args.children}</div>
		</div>
	);
}
