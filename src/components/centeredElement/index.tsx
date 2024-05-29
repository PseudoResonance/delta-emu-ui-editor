"use client";
import styles from "./index.module.css";

export default function CenteredElement(args: {
	children?: React.JSX.Element | React.JSX.Element[];
}) {
	return (
		<div className={styles.popupHolder}>
			{...args.children
				? args.children instanceof Array
					? args.children
					: [args.children]
				: []}
		</div>
	);
}
