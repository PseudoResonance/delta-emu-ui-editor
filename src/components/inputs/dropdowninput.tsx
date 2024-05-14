"use client";
import styles from "./input.module.css";
import React, { useRef, useState } from "react";

export default function DropdownInput(args: {
	elementIndex: number;
	label: string;
	value: string;
	values: Record<string, string>;
	onChange: (val: string) => void;
}) {
	const value = useRef<string>("");
	const [isActive, setIsActive] = useState<boolean>(false);
	if (args.value != value.current) {
		value.current = args.value;
	}
	return (
		<div className={styles.input}>
			<p className={styles.label}>{args.label}</p>

			<div
				className={`${styles.inputInner} ${styles.dropdown}${
					isActive ? " " + styles.active : ""
				}`}
				onBlur={(e) => {
					if (
						!e.currentTarget?.parentElement?.contains(
							e.relatedTarget,
						)
					) {
						setIsActive(false);
					}
				}}
				onFocus={() => {
					setIsActive(true);
				}}
				tabIndex={0}
			>
				{args.values[value.current]}

				<div
					className={`${styles.dropdownItems}${
						isActive ? " " + styles.dropdownActive : ""
					}`}
					tabIndex={0}
				>
					{Object.keys(args.values).map((val: string, i: number) => (
						<div
							key={i}
							onClick={() => {
								setIsActive(false);
								if (val != value.current) {
									value.current = val;
									args.onChange(val);
								}
							}}
						>
							{args.values[val]}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
