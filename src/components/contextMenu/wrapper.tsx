"use client";
import React, { useEffect, useRef } from "react";
import styles from "./index.module.css";
import ContextMenu, { ContextMenuEntry } from "./contextmenu";

export default function ContextMenuWrapper(args: {
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
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") args.clear();
		};
		document.addEventListener("pointerdown", onClick);
		window.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("pointerdown", onClick);
			window.removeEventListener("keydown", onKey);
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
							flexBasis: `${args.menu.y}px`,
							pointerEvents: "none",
						}}
					/>

					<div className={styles.horizontalAlign}>
						<div
							className={styles.aligner}
							style={{
								flexBasis: `${args.menu.x}px`,
								pointerEvents: "none",
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
