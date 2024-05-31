"use client";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./index.module.css";
import Popup from "./popup";

export default function PopupWrapper(args: {
	elements: {
		data: React.JSX.Element;
		onAccept?: () => void;
		onClose: () => void;
	}[];
	setPopups: Dispatch<
		SetStateAction<
			{
				data: React.JSX.Element;
				onAccept?: () => void;
				onClose: () => void;
			}[]
		>
	>;
}) {
	return (
		<div
			className={`${styles.popupHolder}${
				args.elements.length > 0 ? " " + styles.show : ""
			}`}
		>
			{args.elements.map((val, i) => (
				<Popup
					key={i}
					onAccept={val.onAccept}
					onClose={val.onClose}
					removeSelf={() => {
						const newElements = args.elements.slice();
						newElements.splice(i, 1);
						args.setPopups(newElements);
					}}
				>
					{val.data}
				</Popup>
			))}
		</div>
	);
}
