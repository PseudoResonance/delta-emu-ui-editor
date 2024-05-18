"use client";
import styles from "./controls.module.css";

const CONTROLS_DATA: Record<string, string[][]> = {
	Copy: [["Ctrl", "C"]],
	Paste: [["Ctrl", "V"]],
	Undo: [
		["Ctrl", "Z"],
		["Ctrl", "Shift", "Y"],
	],
	Redo: [
		["Ctrl", "Y"],
		["Ctrl", "Shift", "Z"],
	],
	Zoom: [["Scroll Editor"]],
	Pan: [
		["Ctrl", "Drag"],
		["Middle Mouse", "Drag"],
	],
	"Resize Padding": [["Shift", "Drag Edge"]],
	"Nudge Element": [["Arrow Key"]],
	"Fast Nudge Element": [["Shift", "Arrow Key"]],
	"Delete Element": [["Backspace"], ["Delete"]],
};

export default function ControlsInfo() {
	return (
		<>
			<h2>Controls</h2>
			<hr />
			{Object.keys(CONTROLS_DATA).map((val) => (
				<>
					<ControlEntry action={val} controls={CONTROLS_DATA[val]} />
					<hr />
				</>
			))}
		</>
	);
}

const ControlEntry = (args: { action: string; controls: string[][] }) => {
	return (
		<div className={styles.controlEntry}>
			<p>{args.action}</p>
			<div className={styles.controls}>
				{args.controls.map((keys) => (
					<div>
						{keys.map((key, i) => (
							<>
								<p className={styles.key}>{key}</p>
								{i + 1 < keys.length && <p>+</p>}
							</>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
