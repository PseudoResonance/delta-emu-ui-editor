"use client";
import { useEffect, useRef } from "react";
import styles from "./index.module.css";

export default function Popup(args: {
	children?: React.JSX.Element | React.JSX.Element[];
	onAccept?: () => void;
	onClose: () => void;
	removeSelf: () => void;
}) {
	const defaultButton = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		defaultButton.current?.focus({ focusVisible: true } as FocusOptions);
	}, []);
	return (
		<div className={styles.popup} role="dialog">
			<div className={styles.content}>
				{...args.children
					? args.children instanceof Array
						? args.children
						: [args.children]
					: []}
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
