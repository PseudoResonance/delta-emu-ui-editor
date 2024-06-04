"use client";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import styles from "./index.module.css";

export default function Popup(
	args: PropsWithChildren<{
		alert: boolean;
		onAccept?: () => void;
		onClose: () => void;
		removeSelf: () => void;
		title: string;
	}>,
) {
	const titleId = useMemo(
		() => (Math.random() + 1).toString(36).substring(2),
		[],
	);
	const contentId = useMemo(
		() => (Math.random() + 1).toString(36).substring(2),
		[],
	);
	const defaultButton = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		defaultButton.current?.focus({ focusVisible: true } as FocusOptions);
	}, []);
	return (
		<div
			aria-describedby={contentId}
			aria-labelledby={titleId}
			aria-modal={true}
			className={styles.popup}
			role={args.alert ? "alertdialog" : "dialog"}
		>
			<h2 id={titleId}>{args.title}</h2>
			<div className={styles.content} id={contentId}>
				{args.children}
			</div>

			<menu className={styles.buttons}>
				<li>
					<button
						className={`${styles.button} ${
							typeof args.onAccept === "function"
								? styles.cancel
								: styles.close
						}`}
						onClick={() => {
							args.onClose();
							args.removeSelf();
						}}
						ref={defaultButton}
					>
						{typeof args.onAccept === "function"
							? "Cancel"
							: "Close"}
					</button>
				</li>

				{typeof args.onAccept === "function" ? (
					<li>
						<button
							className={`${styles.button} ${styles.confirm}`}
							onClick={() => {
								if (args.onAccept) args.onAccept();
								args.removeSelf();
							}}
						>
							Confirm
						</button>
					</li>
				) : (
					<></>
				)}
			</menu>
		</div>
	);
}
