"use client";
import styles from "./index.module.css";

export interface ContextMenuEntry {
	label: string;
	onClick: () => void;
}

export default function ContextMenu(args: {
	data: ContextMenuEntry[];
	removeSelf: () => void;
}) {
	return (
		<div className={styles.contextMenu} role="menu">
			{args.data.map((val, i) => (
				<button
					key={i}
					onClick={() => {
						val.onClick();
						args.removeSelf();
					}}
					role="menuitem"
				>
					{val.label}
				</button>
			))}
		</div>
	);
}
