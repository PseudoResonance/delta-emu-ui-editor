"use client";
import inputStyles from "../input.module.css";
import styles from "./index.module.css";
import icons from "@/utils/icons.module.css";
import React, {
	CSSProperties,
	PropsWithChildren,
	useEffect,
	useMemo,
	useState,
} from "react";

interface BaseArgs {
	onChange: (val: boolean) => void;
	style?: CSSProperties;
	value: boolean;
}

interface IconArgs extends BaseArgs {
	iconClassFalse: string;
	iconClassTrue: string;
	label: string;
}

type TextArgs = PropsWithChildren<BaseArgs>;

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
			className={`${inputStyles.input} ${inputStyles.button}`}
			style={args.style}
		>
			<span
				style={{
					height: 0,
					margin: -1,
					overflow: "hidden",
					padding: 0,
					position: "fixed",
					width: 0,
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
				aria-label={"label" in args ? args.label : undefined}
				className={`${inputStyles.inputInner} ${styles.container}`}
				htmlFor={id}
				style={{ gridColumn: "start / end" }}
				title={"label" in args ? args.label : undefined}
			>
				<span
					className={`${icons.icon} ${state ? ("iconClassTrue" in args ? args.iconClassTrue : icons.checkboxChecked) : "iconClassFalse" in args ? args.iconClassFalse : icons.checkboxUnchecked}`}
					style={{
						height: "var(--icon-size)",
						width: "var(--icon-size)",
					}}
				/>
				{"children" in args && <span>{args.children}</span>}
			</label>
		</form>
	);
}
