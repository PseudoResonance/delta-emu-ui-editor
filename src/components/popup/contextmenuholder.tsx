"use client";
import React, { useEffect, useRef } from "react";
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
	const elem = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const onClick = (e: PointerEvent) => {
			if (elem.current) {
				if (!elem.current.contains(e.target as HTMLElement)) {
					args.clear();
				}
			}
		};
		document.addEventListener("pointerdown", onClick);
		return () => {
			document.removeEventListener("pointerdown", onClick);
		};
	}, []);
	return (
		<div
			className={`${styles.contextMenuHolder} ${styles.verticalAlign}${
				args.menu.data != null ? " " + styles.show : ""
			}`}
			onContextMenu={(e) => e.preventDefault()}
			style={{
				pointerEvents: "none",
			}}
		>
			{args.menu.data != null ? (
				<>
					<div
						className={styles.aligner}
						style={{
							pointerEvents: "none",
							flexBasis: `${args.menu.y}px`,
						}}
					/>

					<div className={styles.horizontalAlign}>
						<div
							className={styles.aligner}
							style={{
								pointerEvents: "none",
								flexBasis: `${args.menu.x}px`,
							}}
						/>

						<div
							ref={elem}
							style={{
								pointerEvents: "initial",
							}}
						>
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
