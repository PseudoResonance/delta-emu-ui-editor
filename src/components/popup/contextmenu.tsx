"use client";
import styles from "./contextmenu.module.css";

export interface ContextMenuEntry {
	label: string;
	onClick: () => void;
}

export default function ContextMenu(args: {
	data: ContextMenuEntry[];
	removeSelf: () => void;
}) {
	return (
		<div className={styles.contextMenu}>
			{args.data.map((val, i) => (
				<button
					key={i}
					onClick={() => {
						val.onClick();
						args.removeSelf();
					}}
				>
					{val.label}
				</button>
			))}
		</div>
	);
}
