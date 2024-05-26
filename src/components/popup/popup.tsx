"use client";
import styles from "./index.module.css";

export default function Popup(args: {
	children?: React.JSX.Element | React.JSX.Element[];
	removeSelf: () => void;
	onClose: () => void;
	onAccept?: () => void;
}) {
	return (
		<div className={styles.popup}>
			<div className={styles.content}>
				{...args.children
					? args.children instanceof Array
						? args.children
						: [args.children]
					: []}
			</div>

			<div className={styles.buttons}>
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
				>
					{typeof args.onAccept === "function" ? "Cancel" : "Close"}
				</button>

				{typeof args.onAccept === "function" ? (
					<button
						className={`${styles.button} ${styles.confirm}`}
						onClick={() => {
							if (args.onAccept) args.onAccept();
							args.removeSelf();
						}}
					>
						Confirm
					</button>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
