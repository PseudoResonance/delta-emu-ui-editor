"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import styles from "./index.module.css";
import Popup from "./popup";

export default function PopupWrapper(args: {
	elements: {
		alert: boolean;
		data: React.JSX.Element;
		onAccept?: () => void;
		onClose: () => void;
		title: string;
	}[];
	setPopups: Dispatch<
		SetStateAction<
			{
				alert: boolean;
				data: React.JSX.Element;
				onAccept?: () => void;
				onClose: () => void;
				title: string;
			}[]
		>
	>;
}) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (args.elements.length > 0 && e.key === "Escape") {
				args.setPopups((oldElements) =>
					oldElements.slice(0, oldElements.length - 1),
				);
			}
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("keydown", onKey);
		};
	}, []);

	return (
		<div
			className={`${styles.popupHolder}${
				args.elements.length > 0 ? " " + styles.show : ""
			}`}
		>
			{args.elements.map((val, i) => {
				return (
					<Popup
						alert={val.alert}
						key={i}
						onAccept={val.onAccept}
						onClose={val.onClose}
						removeSelf={() => {
							args.setPopups((oldElements) => {
								const newElements = oldElements.slice();
								newElements.splice(i, 1);
								return newElements;
							});
						}}
						title={val.title}
					>
						{val.data}
					</Popup>
				);
			})}
		</div>
	);
}
