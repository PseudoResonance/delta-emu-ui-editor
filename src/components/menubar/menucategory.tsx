"use client";
import styles from "./menu.module.css";
import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

export default function MenuCategory(args: {
	label: string;
	subElements: React.JSX.Element[];
	isActive: boolean;
	setIsActive: Dispatch<SetStateAction<boolean>>;
}) {
	const [isActive, setIsActive] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
				setIsActive((val) => {
					if (val) {
						args.setIsActive(false);
						return false;
					}
					return val;
				});
			}
		};
		document.addEventListener("click", onClick);

		return () => {
			document.removeEventListener("click", onClick);
		};
	}, []);

	return (
		<div
			className={`${styles.menucategory}${
				isActive ? " " + styles.active : ""
			}`}
			ref={ref}
		>
			<button
				className={styles.label}
				onBlur={(e) => {
					if (
						!e.currentTarget?.parentElement?.contains(
							e.relatedTarget,
						)
					) {
						setIsActive(false);
						args.setIsActive(false);
					}
				}}
				onFocus={() => {
					setIsActive(true);
					args.setIsActive(true);
				}}
			>
				{args.label}
			</button>

			<div className={styles.menudropdown}>{args.subElements}</div>
		</div>
	);
}
