"use client";
import React from "react";
import styles from "./contextmenu.module.css";
import ContextMenu, { ContextMenuEntry } from "./contextmenu";

export default function ContextMenuHolder(args: {
	clear: () => void;
	menu: {
		data: ContextMenuEntry[] | null;
		x: number;
		y: number;
	};
}) {
	return (
		<div
			className={`${styles.contextMenuHolder} ${styles.verticalAlign}${
				args.menu.data != null ? " " + styles.show : ""
			}`}
			onClick={(e) => {
				if (e.currentTarget == e.target) {
					args.clear();
				}
			}}
			onContextMenu={(e) => e.preventDefault()}
		>
			{args.menu.data != null ? (
				<>
					<div
						className={styles.aligner}
						onClick={(e) => {
							if (e.currentTarget == e.target) {
								args.clear();
							}
						}}
						style={{
							flexBasis: `${args.menu.y}px`,
						}}
					/>

					<div
						className={styles.horizontalAlign}
						onClick={(e) => {
							if (e.currentTarget == e.target) {
								args.clear();
							}
						}}
					>
						<div
							className={styles.aligner}
							onClick={(e) => {
								if (e.currentTarget == e.target) {
									args.clear();
								}
							}}
							style={{
								flexBasis: `${args.menu.x}px`,
							}}
						/>

						<div>
							<ContextMenu
								data={args.menu.data}
								removeSelf={args.clear}
							/>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</div>
	);
}
