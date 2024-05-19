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
		<div
			className={`${styles.input} ${styles.button}${
				state ? " " + styles.checked : ""
			}`}
			onClick={onChange}
		>
			<div className={`${styles.inputInner} ${checkboxStyles.container}`}>
				<div
					className={`${icons.icon} ${state ? icons.checkboxChecked : icons.checkboxUnchecked}`}
					style={{
						height: "var(--icon-size)",
						width: "var(--icon-size)",
					}}
				/>
				<p>{args.label}</p>
			</div>
		</div>
	);
}
