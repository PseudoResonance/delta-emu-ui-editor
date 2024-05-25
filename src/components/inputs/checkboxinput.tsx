"use client";
import styles from "./input.module.css";
import icons from "@/utils/icons.module.css";
import checkboxStyles from "./checkbox.module.css";
import React, { useEffect, useState } from "react";

export default function CheckboxInput(args: {
	label: string;
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
			className={`${styles.input} ${styles.button}${
				state ? " " + styles.checked : ""
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
				<span
					className={`${icons.icon} ${state ? icons.checkboxChecked : icons.checkboxUnchecked}`}
					style={{
						height: "var(--icon-size)",
						width: "var(--icon-size)",
					}}
				/>
				<span>{args.label}</span>
			</label>
		</form>
	);
}
