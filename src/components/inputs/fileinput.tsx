"use client";
import styles from "./input.module.css";
import React from "react";
import { ChangeEvent, useRef } from "react";

export default function FileInput(args: {
	label: string;
	accept?: string;
	onChange: (val: File) => void;
}) {
	const ref = useRef<HTMLInputElement>(null);
	const id = (Math.random() + 1).toString(36).substring(2);
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			args.onChange(e.target.files[0]);
		}
	};
	return (
		<div className={styles.input}>
			<label className={styles.label}>{args.label}</label>
			<label className={styles.inputInner} htmlFor={id}>
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
