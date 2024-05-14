"use client";
import styles from "./controls.module.css";

export default function ControlsInfo() {
	return (
		<>
			<h2>Controls</h2>

			<hr />
			<div className={styles.controlEntry}>
				<p>Copy</p>
				<div className={styles.controls}>
					<p className={styles.key}>Ctrl</p>
					<p>+</p>
					<p className={styles.key}>C</p>
				</div>
			</div>
			<hr />
			<div className={styles.controlEntry}>
				<p>Paste</p>
				<div className={styles.controls}>
					<p className={styles.key}>Ctrl</p>
					<p>+</p>
					<p className={styles.key}>V</p>
				</div>
			</div>
			<hr />
			<div className={styles.controlEntry}>
				<p>Zoom</p>
				<div className={styles.controls}>
					<p className={styles.key}>Scroll Editor</p>
				</div>
			</div>
			<hr />
			<div className={styles.controlEntry}>
				<p>Pan</p>
				<div className={styles.controls}>
					<p className={styles.key}>Ctrl</p>
					<p>+</p>
					<p className={styles.key}>Drag</p>
				</div>
			</div>
			<hr />
			<div className={styles.controlEntry}>
				<p>Resize Padding</p>
				<div className={styles.controls}>
					<p className={styles.key}>Shift</p>
					<p>+</p>
					<p className={styles.key}>Drag Edge</p>
				</div>
			</div>
			<hr />
		</>
	);
}
