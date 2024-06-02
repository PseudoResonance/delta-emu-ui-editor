"use client";
import styles from "./input.module.css";
import React, { CSSProperties, useEffect, useMemo } from "react";
import { ChangeEvent, KeyboardEvent, WheelEvent, useRef } from "react";

const nonBlockingKeys = [
	"F1",
	"F2",
	"F3",
	"F4",
	"F5",
	"F6",
	"F7",
	"F8",
	"F9",
	"F10",
	"F11",
	"F12",
	"F13",
	"F14",
	"F15",
	"F16",
	"F17",
	"F18",
	"F19",
	"F20",
	"F21",
	"F22",
	"F23",
	"F24",
];
const editorKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const decimalKeys = ["."];
const shortcuts = (e: KeyboardEvent<unknown>) => {
	if (
		nonBlockingKeys ||
		(e.ctrlKey &&
			(e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x"))
	)
		return true;
	return false;
};

const clamp = (
	min: number | undefined,
	input: number,
	max: number | undefined,
) => {
	if (min !== undefined && input <= min) return min;
	else if (max !== undefined && input >= max) return max;
	return input;
};

export default function ValueInput(args: {
	ariaLabel?: string;
	context: string;
	debounce?: number;
	increment?: number;
	label: string;
	maxValue?: number;
	minValue?: number;
	onChange: (val: string) => void;
	onFocusLost?: (val: string) => void;
	places?: number;
	style?: CSSProperties;
	suggestionsId?: string;
	type?: string;
	value: string;
}) {
	const id = useMemo(() => (Math.random() + 1).toString(36).substring(2), []);
	const wheelLock = useRef<unknown>(null);
	const value = useRef<string>("");
	const debounceTimeout: NodeJS.Timeout[] = [];
	const ref = useRef<HTMLInputElement>(null);
	const contextRef = useRef<string | null>(null);
	const onChangeRef = useRef<((val: string) => void) | null>(null);
	const onFocusLostRef = useRef<((val: string) => void) | null>(null);
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if ("debounce" in args) {
			if (debounceTimeout.length > 0) {
				clearTimeout(debounceTimeout[0]);
				delete debounceTimeout[0];
			}
			debounceTimeout[0] = setTimeout(() => {
				if (args.type === "number" || args.type === "float") {
					const valNum = clamp(
						args.minValue,
						Number(e.target.value),
						args.maxValue,
					);
					let val;
					if (args.type === "number" || args.places !== undefined) {
						val = valNum.toFixed(
							args.type === "number" ? 0 : args.places,
						);
					} else {
						val = String(valNum);
					}
					value.current = val;
					args.onChange(val);
				} else {
					value.current = e.target.value;
					args.onChange(e.target.value);
				}
			}, args.debounce);
		} else {
			if (args.type === "number" || args.type === "float") {
				const valNum = clamp(
					args.minValue,
					Number(e.target.value),
					args.maxValue,
				);
				let val;
				if (args.type === "number" || args.places !== undefined) {
					val = valNum.toFixed(
						args.type === "number" ? 0 : args.places,
					);
				} else {
					val = String(valNum);
				}
				args.onChange(val);
			} else {
				args.onChange(e.target.value);
			}
		}
	};
	let onKeyDown = (_: KeyboardEvent<HTMLInputElement>) => {};
	let onWheel = (_: WheelEvent<HTMLInputElement>) => {};
	let inputmode:
		| "text"
		| "numeric"
		| "decimal"
		| "search"
		| "none"
		| "tel"
		| "url"
		| "email"
		| undefined = "text";
	switch (args.type) {
		case "number":
			inputmode = "numeric";
			onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
				let newVal;
				if (e.key === "Tab") return;
				else if (
					!(
						editorKeys.includes(e.key) ||
						numberKeys.includes(e.key) ||
						shortcuts(e)
					)
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
			inputmode = "decimal";
			onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
				let newVal;
				if (e.key === "Tab") return;
				else if (
					!(
						editorKeys.includes(e.key) ||
						numberKeys.includes(e.key) ||
						decimalKeys.includes(e.key) ||
						shortcuts(e)
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
	if (contextRef.current !== null && args.context != contextRef.current) {
		if (value.current != args.value && debounceTimeout.length <= 0) {
			if (onChangeRef.current) onChangeRef.current(value.current);
			if (onFocusLostRef.current) onFocusLostRef.current(value.current);
		}
		onChangeRef.current = args.onChange;
		if (args.onFocusLost) onFocusLostRef.current = args.onFocusLost;
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
	if (args.suggestionsId) {
		attrs.list = args.suggestionsId;
	}
	return (
		<div className={styles.input} style={args.style}>
			<label
				aria-label={args.ariaLabel ? args.ariaLabel : undefined}
				className={styles.label}
				htmlFor={id}
				style={{ alignSelf: "center" }}
			>
				{args.label}
			</label>

			<input
				className={styles.inputInner}
				defaultValue={args.value}
				id={id}
				inputMode={inputmode}
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
				style={{ gridColumn: "label / end" }}
			/>
		</div>
	);
}
