"use client";
import styles from "./input.module.css";
import React, { useRef, useState } from "react";

export default function CheckboxInput(args: {
	label: string;
	value: boolean;
	onChange: (val: boolean) => void;
}) {
	const value = useRef<boolean>(false);
	const [state, setState] = useState<boolean>(args.value);
	const onChange = () => {
		const val = !state;
		value.current = val;
		setState(val);
		args.onChange(val);
	};
	if (state != value.current) {
		value.current = state;
	}
	return (
		<div
			className={`${styles.input} ${styles.button}${
				state ? " " + styles.checked : ""
			}`}
			onClick={onChange}
		>
			<div className={styles.inputInner}>{args.label}</div>
		</div>
	);
}
