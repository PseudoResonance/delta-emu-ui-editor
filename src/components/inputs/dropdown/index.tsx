"use client";
import inputStyles from "../input.module.css";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef, useState } from "react";

const recurseOffsetHeight: (elem: HTMLElement) => number = (
	elem: HTMLElement,
) => {
	if (elem.offsetParent === null) {
		return elem.offsetHeight - elem.offsetTop;
	} else {
		return (
			recurseOffsetHeight(elem.offsetParent as HTMLElement) -
			elem.offsetTop
		);
	}
};

export default function DropdownInput(args: {
	label: string;
	onChange: (val: string) => void;
	value: string;
	values: Record<string, string>;
}) {
	const innerRef = useRef<HTMLSelectElement>(null);
	const elem = useRef<HTMLDivElement>(null);
	const elemDropdown = useRef<HTMLDivElement>(null);
	const id = useMemo(() => (Math.random() + 1).toString(36).substring(2), []);
	const [state, setState] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isHover, setIsHover] = useState<boolean>(false);
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [dropdownPos, setDropdownPos] = useState<{
		heightLeft: number;
		left: number;
		top: number;
		width: number;
	}>({ heightLeft: 0, left: 0, top: 0, width: 0 });
	const onChange = (val: string) => {
		setIsOpen(false);
		setState(val);
		args.onChange(val);
	};
	useEffect(() => {
		if (state != args.value) {
			setState(args.value);
		}
	}, [args.value]);
	useEffect(() => {
		const onClick = (e: PointerEvent) => {
			if (
				elem.current &&
				!elem.current.contains(e.target as HTMLElement) &&
				elemDropdown.current &&
				!elemDropdown.current.contains(e.target as HTMLElement)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("pointerdown", onClick);
		return () => {
			document.removeEventListener("pointerdown", onClick);
		};
	}, []);
	useEffect(() => {
		if (elem.current) {
			setDropdownPos({
				heightLeft:
					recurseOffsetHeight(elem.current) -
					elem.current.offsetHeight,
				left: elem.current.offsetLeft,
				top: elem.current.offsetTop + elem.current.offsetHeight,
				width: elem.current.offsetWidth,
			});
		}
	}, [elem]);
	useEffect(() => {
		const onResize = () => {
			if (elem.current) {
				setDropdownPos({
					heightLeft:
						recurseOffsetHeight(elem.current) -
						elem.current.offsetHeight,
					left: elem.current.offsetLeft,
					top: elem.current.offsetTop + elem.current.offsetHeight,
					width: elem.current.offsetWidth,
				});
			}
		};
		window.addEventListener("resize", onResize);
		document.addEventListener("scroll", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
			document.removeEventListener("scroll", onResize);
		};
	}, []);
	return (
		<form className={styles.input}>
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
				<select
					id={id}
					onBlur={(e) => {
						setIsFocus(false);
						if (e.relatedTarget) setIsOpen(false);
					}}
					onChange={(e) => {
						onChange(e.target.value);
					}}
					onFocus={() => {
						setIsFocus(true);
					}}
					ref={innerRef}
					value={state}
				>
					{...Object.keys(args.values).map((key) => (
						<option key={key} value={key}>
							{args.values[key]}
						</option>
					))}
				</select>
			</span>
			<div className={inputStyles.input}>
				<label
					className={inputStyles.label}
					htmlFor={id}
					onClick={() => {
						setIsOpen(true);
						if (innerRef.current) innerRef.current.focus();
					}}
					onPointerOut={() => {
						setIsHover(false);
					}}
					onPointerOver={() => {
						setIsHover(true);
					}}
				>
					{args.label}
				</label>

				<div
					className={`${inputStyles.inputInner} ${styles.dropdown} ${
						isOpen ? styles.active : ""
					} ${isHover || isFocus ? styles.hover : ""}`}
					onClick={() => {
						setIsOpen(true);
						if (innerRef.current) innerRef.current.focus();
					}}
					ref={elem}
				>
					<div
						style={{
							position: "absolute",
						}}
					>
						{args.values[state]}
					</div>
					{/* Hack to ensure dropdown is wide enough to fit the longest value */}
					<div className={styles.dropdownWidthHack}>
						{Object.keys(args.values).map((val: string) => (
							<div key={val}>{args.values[val]}</div>
						))}
					</div>
				</div>

				{isOpen && (
					<div
						className={styles.horizontalAlign}
						ref={elemDropdown}
						style={{
							height: dropdownPos.heightLeft,
							top: dropdownPos.top,
						}}
					>
						<div
							style={{
								flexBasis: dropdownPos.left,
								pointerEvents: "none",
							}}
						/>
						<div
							className={styles.dropdownItems}
							style={{
								maxHeight: dropdownPos.heightLeft,
								width: dropdownPos.width,
							}}
						>
							{Object.keys(args.values).map((val: string) => (
								<div
									key={val}
									onClick={() => {
										if (val != state) {
											onChange(val);
										}
									}}
								>
									{args.values[val]}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</form>
	);
}
