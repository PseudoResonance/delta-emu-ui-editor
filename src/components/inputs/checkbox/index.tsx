"use client";
import inputStyles from "../input.module.css";
import styles from "./index.module.css";
import icons from "@/utils/icons.module.css";
import React, { useEffect, useMemo, useState } from "react";

interface BaseArgs {
	value: boolean;
	onChange: (val: boolean) => void;
}

interface IconArgs extends BaseArgs {
	iconClassFalse: string;
	iconClassTrue: string;
}

interface TextArgs extends BaseArgs {
	label: string;
}

type Args = TextArgs | IconArgs;

export default function CheckboxInput(args: Args) {
	const id = useMemo(() => (Math.random() + 1).toString(36).substring(2), []);
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
			className={`${inputStyles.input} ${"label" in args ? "" : styles.iconState} ${inputStyles.button} ${
				state ? inputStyles.checked : ""
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
				className={`${inputStyles.inputInner} ${styles.container}`}
				htmlFor={id}
			>
				<span
					className={`${icons.icon} ${state ? ("iconClassTrue" in args ? args.iconClassTrue : icons.checkboxChecked) : "iconClassFalse" in args ? args.iconClassFalse : icons.checkboxUnchecked}`}
					style={{
						height: "var(--icon-size)",
						width: "var(--icon-size)",
					}}
				/>
				{"label" in args && <span>{args.label}</span>}
			</label>
		</form>
	);
}
