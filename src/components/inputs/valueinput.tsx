"use client";
import styles from "./input.module.css";
import React, { useEffect } from "react";
import { ChangeEvent, KeyboardEvent, WheelEvent, useRef } from "react";

const editorKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const decimalKeys = ["."];

export default function ValueInput(args: {
	elementIndex: number;
	label: string;
	increment?: number;
	places?: number;
	minValue?: number;
	maxValue?: number;
	value: string;
	type?: string;
	onChange: (val: string) => void;
	onFocusLost?: (val: string) => void;
	debounce?: number;
}) {
	const wheelLock = useRef<unknown>(null);
	const value = useRef<string>("");
	const debounceTimeout: NodeJS.Timeout[] = [];
	const ref = useRef<HTMLInputElement>(null);
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if ("debounce" in args) {
			if (debounceTimeout.length > 0) {
				clearTimeout(debounceTimeout[0]);
				delete debounceTimeout[0];
			}
			debounceTimeout[0] = setTimeout(() => {
				value.current = e.target.value;
				args.onChange(e.target.value);
				console.log(e.target.value);
			}, args.debounce);
		} else {
			args.onChange(e.target.value);
			console.log(e.target.value);
		}
	};
	let onKeyDown = (_: KeyboardEvent<HTMLInputElement>) => {};
	let onWheel = (_: WheelEvent<HTMLInputElement>) => {};
	switch (args.type) {
		case "number":
			onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
				let newVal;
				if (e.key === "Tab") return;
				else if (
					!(editorKeys.includes(e.key) || numberKeys.includes(e.key))
				)
					e.preventDefault();
				if (ref.current != null) {
					switch (e.key) {
						case "ArrowUp":
							newVal = (
								Number(ref.current.value) +
								(args.increment ? args.increment : 1)
							).toFixed(0);
							if (
								args.maxValue != undefined &&
								Number(newVal) > args.maxValue
							)
								newVal = String(args.maxValue);
							ref.current.value = newVal;
							args.onChange(newVal);
							break;
						case "ArrowDown":
							newVal = (
								Number(ref.current.value) -
								(args.increment ? args.increment : 1)
							).toFixed(0);
							if (
								args.minValue != undefined &&
								Number(newVal) < args.minValue
							)
								newVal = String(args.minValue);
							ref.current.value = newVal;
							args.onChange(newVal);
							break;
					}
				}
			};
			onWheel = (e: WheelEvent<HTMLInputElement>) => {
				let newVal;
				if (ref.current != null) {
					const delta = Math.sign(e.deltaY);
					if (delta > 0) {
						newVal = (
							Number(ref.current.value) -
							(args.increment ? args.increment : 1)
						).toFixed(0);
						if (
							args.minValue != undefined &&
							Number(newVal) < args.minValue
						)
							newVal = String(args.minValue);
						ref.current.value = newVal;
						args.onChange(newVal);
					} else if (delta < 0) {
						newVal = (
							Number(ref.current.value) +
							(args.increment ? args.increment : 1)
						).toFixed(0);
						if (
							args.maxValue != undefined &&
							Number(newVal) > args.maxValue
						)
							newVal = String(args.maxValue);
						ref.current.value = newVal;
						args.onChange(newVal);
					}
				}
			};
			break;
		case "float":
			onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
				let newVal;
				if (e.key === "Tab") return;
				else if (
					!(
						editorKeys.includes(e.key) ||
						numberKeys.includes(e.key) ||
						decimalKeys.includes(e.key)
					)
				)
					e.preventDefault();
				if (ref.current != null) {
					switch (e.key) {
						case "ArrowUp":
							newVal = (
								Number(ref.current.value) +
								(args.increment ? args.increment : 1)
							).toFixed(args.places ? args.places : 1);
							if (
								args.maxValue != undefined &&
								Number(newVal) > args.maxValue
							)
								newVal = String(args.maxValue);
							ref.current.value = newVal;
							args.onChange(newVal);
							break;
						case "ArrowDown":
							newVal = (
								Number(ref.current.value) -
								(args.increment ? args.increment : 1)
							).toFixed(args.places ? args.places : 1);
							if (
								args.minValue != undefined &&
								Number(newVal) < args.minValue
							)
								newVal = String(args.minValue);
							ref.current.value = newVal;
							args.onChange(newVal);
							break;
					}
				}
			};
			onWheel = (e: WheelEvent<HTMLInputElement>) => {
				let newVal;
				if (ref.current != null) {
					const delta = Math.sign(e.deltaY);
					if (delta > 0) {
						newVal = (
							Number(ref.current.value) -
							(args.increment ? args.increment : 1)
						).toFixed(args.places ? args.places : 1);
						if (
							args.minValue != undefined &&
							Number(newVal) < args.minValue
						)
							newVal = String(args.minValue);
						ref.current.value = newVal;
						args.onChange(newVal);
					} else if (delta < 0) {
						newVal = (
							Number(ref.current.value) +
							(args.increment ? args.increment : 1)
						).toFixed(args.places ? args.places : 1);
						if (
							args.maxValue != undefined &&
							Number(newVal) > args.maxValue
						)
							newVal = String(args.maxValue);
						ref.current.value = newVal;
						args.onChange(newVal);
					}
				}
			};
			break;
		default:
			break;
	}
	if (value.current != args.value && debounceTimeout.length <= 0) {
		value.current = args.value;
		clearTimeout(debounceTimeout[0]);
		delete debounceTimeout[0];
		if (ref.current) {
			ref.current.value = args.value;
		}
	}
	useEffect(() => {
		const cancelWheel = (e: MouseEvent) => {
			wheelLock.current && e.preventDefault();
		};
		document.body.addEventListener("wheel", cancelWheel, {
			passive: false,
		});
		return () => document.body.removeEventListener("wheel", cancelWheel);
	}, []);

	const attrs: Record<string, unknown> = {};
	if (typeof args.onFocusLost === "function") {
		attrs.onBlur = () => {
			if (args.onFocusLost) args.onFocusLost(value.current);
		};
	}

	return (
		<div className={styles.input}>
			<p className={styles.label}>{args.label}</p>

			<input
				className={styles.inputInner}
				defaultValue={args.value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				onMouseEnter={() => {
					wheelLock.current = true;
				}}
				onMouseLeave={() => {
					wheelLock.current = false;
				}}
				{...attrs}
				onWheel={onWheel}
				ref={ref}
			/>
		</div>
	);
}
