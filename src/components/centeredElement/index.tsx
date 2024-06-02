"use client";
import { PropsWithChildren } from "react";
import styles from "./index.module.css";

export default function CenteredElement(args: PropsWithChildren) {
	return <div className={styles.popupHolder}>{args.children}</div>;
}
