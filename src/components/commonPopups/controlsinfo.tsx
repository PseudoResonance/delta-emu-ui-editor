"use client";
import React from "react";
import styles from "./controls.module.css";
import * as CONSTANT from "@/data/constants";

export default function ControlsInfo() {
	return (
		<>
			<h2>Controls</h2>
			<hr />
			{Object.keys(CONSTANT.CONTROLS).map((val, i) => (
				<div key={i}>
					<ControlEntry
						action={val}
						controls={CONSTANT.CONTROLS[val]}
					/>
					<hr />
				</div>
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
					<div className={styles.keyWrapper} key={i}>
						{keys.reduce<React.JSX.Element[]>(
							(prev, key, i, arr) => (
								prev.push(
									...[
										<kbd className={styles.key} key={i}>
											{key}
										</kbd>,
										...(i + 1 < arr.length
											? [<p key={`p${i}`}>+</p>]
											: []),
									],
								),
								prev
							),
							[],
						)}
					</div>
				))}
			</div>
		</div>
	);
};
