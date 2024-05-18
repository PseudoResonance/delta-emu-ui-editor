"use client";
import styles from "./input.module.css";
import checkboxStyles from "./checkbox.module.css";
import React, { useEffect, useState } from "react";

export default function IconCheckboxInput(args: {
	icon: React.JSX.Element;
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
			className={`${styles.input} ${checkboxStyles.iconState} ${styles.button}${
				state ? " " + checkboxStyles.checked : ""
			}`}
			onClick={onChange}
		>
			<div className={`${styles.inputInner} ${checkboxStyles.container}`}>
				{args.icon}
			</div>
		</div>
	);
}
