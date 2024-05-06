"use client";
import styles from "./menu.module.css";
import React, { Dispatch, SetStateAction, useState } from "react";

export default function MenuCategory(args: {
    label: string;
    subElements: React.JSX.Element[];
    isActive: boolean;
    setIsActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [isActive, setIsActive] = useState<boolean>(false);
    return (
        <div className={`${styles.menucategory}${isActive ? ' ' + styles.active : ''}`}>
            <button className={styles.label} onFocus={() => {
                setIsActive(true);
                args.setIsActive(true);
            }} onBlur={(e) => {
                if (!e.currentTarget?.parentElement?.contains(e.relatedTarget)) {
                    setIsActive(false);
                    args.setIsActive(false);
                }
            }}>
                {args.label}
            </button>
            <div className={styles.menudropdown}>
                {args.subElements}
            </div>
        </div>
    );
}
