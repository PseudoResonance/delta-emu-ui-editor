"use client";
import styles from "./menu.module.css";
import React from "react";

export default function MenuButton(args: {
    label: string;
    onClick: () => void;
}) {
    return (
        <button className={styles.menubutton} onClick={() => {
            args.onClick();
        }}>
            {args.label}
        </button>
    );
}
