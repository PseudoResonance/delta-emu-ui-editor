"use client";
import styles from "./input.module.css";

export default function Button(args: { onClick: () => void; label: string }) {
	return (
		<div
			className={`${styles.input} ${styles.button}`}
			onClick={() => {
				args.onClick();
			}}
		>
			<div className={styles.inputInner}>{args.label}</div>
		</div>
	);
}
