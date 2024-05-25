"use client";
import styles from "./input.module.css";
import checkboxStyles from "./checkbox.module.css";
import React, { useEffect, useState } from "react";

export default function IconCheckboxInput(args: {
	icon: React.JSX.Element;
	value: boolean;
	onChange: (val: boolean) => void;
}) {
	const id = (Math.random() + 1).toString(36).substring(2);
	const [state, setState] = useState<boolean>(false);
	const onChange = () => {
		const val = !state;
		setState(val);
		args.onChange(val);
	};
	useEffect(() => {
		if (state != args.value) {
			setState(args.value);
		}
	}, [args.value]);
	return (
		<form
			className={`${styles.input} ${checkboxStyles.iconState} ${styles.button}${
				state ? " " + checkboxStyles.checked : ""
			}`}
		>
			<span
				style={{
					overflow: "hidden",
					width: 0,
					height: 0,
					padding: 0,
					margin: -1,
					position: "fixed",
				}}
			>
				<input
					checked={state}
					id={id}
					onChange={() => {
						onChange();
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") onChange();
					}}
					type="checkbox"
				/>
			</span>
			<label
				className={`${styles.inputInner} ${checkboxStyles.container}`}
				htmlFor={id}
			>
				{args.icon}
			</label>
		</form>
	);
}
