"use client";
import styles from "./controls.module.css";
import * as CONSTANT from "@/utils/constants";

export default function ControlsInfo() {
	return (
		<>
			<h2>Controls</h2>
			<hr />
			{Object.keys(CONSTANT.CONTROLS).map((val, i) => (
				<>
					<ControlEntry
						action={val}
						controls={CONSTANT.CONTROLS[val]}
						key={i}
					/>
					<hr key={`hr${i}`} />
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
				{args.controls.map((keys, i) => (
					<div key={i}>
						{keys.map((key, i) => (
							<>
								<p className={styles.key} key={i}>
									{key}
								</p>
								{i + 1 < keys.length && <p key={`p${i}`}>+</p>}
							</>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
