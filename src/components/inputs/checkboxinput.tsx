"use client";
import styles from "./input.module.css";
import React, { useState } from "react";
import { MouseEvent } from "react";

export default function CheckboxInput(args: { label: string; defaultValue: boolean; onChange: (val: boolean) => void }) {
    const [defaultValue, setDefaultValue] = useState<boolean>(args.defaultValue);
    const [checked, setChecked] = useState<boolean>(args.defaultValue);
    let onChange = (e: MouseEvent<HTMLInputElement>) => {
        const val = !checked;
        setChecked(val);
        args.onChange(val);
    };
    if (args.defaultValue != defaultValue) {
        setDefaultValue(args.defaultValue);
        setChecked(args.defaultValue);
    }
    return (
        <div className={`${styles.input} ${styles.button}${checked ? ' ' + styles.checked : ''}`} onClick={onChange}>
            <div className={styles.inputInner}>{args.label}</div>
        </div>
    );
}
