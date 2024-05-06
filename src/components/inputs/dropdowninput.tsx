"use client";
import styles from "./input.module.css";
import React, { useState } from "react";

export default function DropdownInput(args: {
    elementIndex: number;
    label: string;
    defaultValue: string;
    values: Record<string, string>;
    onChange: (val: string) => void
}) {
    const [defaultValue, setDefaultValue] = useState<string>(args.defaultValue);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [value, setValue] = useState<string>(args.defaultValue);
    if (defaultValue != args.defaultValue) {
        setDefaultValue(args.defaultValue);
        setValue(args.defaultValue);
    }
    return (
        <div className={styles.input}>
            <p className={styles.label}>{args.label}</p>
            <div tabIndex={0} className={`${styles.inputInner} ${styles.select}${isActive ? ' ' + styles.active : ''}`} onFocus={() => {
                setIsActive(true);
            }} onBlur={(e) => {
                if (!e.currentTarget?.parentElement?.contains(e.relatedTarget)) {
                    setIsActive(false);
                }
            }}>
                {args.values[value]}
                <div tabIndex={0} className={`${styles.selectItems}${isActive ? ' ' + styles.selectActive : ''}`}>
                    {Object.keys(args.values).map((val: string, i: number) => <div onClick={() => {
                        setValue(val);
                        setIsActive(false);
                        if (val != value) {
                            args.onChange(val);
                        }
                    }} key={i}>{args.values[val]}</div>)}
                </div>
            </div>
        </div>
    );
}
