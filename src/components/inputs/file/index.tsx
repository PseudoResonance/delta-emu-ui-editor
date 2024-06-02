"use client";
import styles from "../input.module.css";
import React, { CSSProperties, useMemo } from "react";
import { ChangeEvent, useRef } from "react";

export default function FileInput(args: {
	accept?: string;
	label: string;
	onChange: (val: File) => void;
	style?: CSSProperties;
}) {
	const id = useMemo(() => (Math.random() + 1).toString(36).substring(2), []);
	const ref = useRef<HTMLInputElement>(null);
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			args.onChange(e.target.files[0]);
		}
	};
	return (
		<div className={`${styles.input} ${styles.button}`} style={args.style}>
			<label
				className={styles.label}
				htmlFor={id}
				style={{ alignSelf: "center" }}
			>
				{args.label}
			</label>
			<label
				className={styles.inputInner}
				htmlFor={id}
				onKeyDown={(e) => {
					if (e.key === "Enter") (e.target as HTMLElement).click();
				}}
				tabIndex={0}
			>
				Choose File
			</label>
			<input
				accept={args.accept}
				id={id}
				onChange={onChange}
				ref={ref}
				style={{ display: "none" }}
				type="file"
			/>
		</div>
	);
}
