"use client";
import styles from "./input.module.css";
import React, { useEffect, useState } from "react";
import { ChangeEvent, KeyboardEvent, WheelEvent, useRef } from "react";

const editorKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"]
const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const decimalKeys = ["."];

export default function ValueInput(args: { elementIndex: number; label: string; increment?: number; places?: number; minValue?: number; maxValue?: number; value: string; type?: string; onChange: (val: string) => void }) {
    const wheelLock = useRef<any>(null);
    const [currentValue, setCurrentValue] = useState<string>(args.value);
    const ref = useRef<HTMLInputElement>(null);
    let onChange = (e: ChangeEvent<HTMLInputElement>) => { };
    let onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { };
    let onWheel = (e: WheelEvent<HTMLInputElement>) => { };
    switch (args.type) {
        case "number":
            onChange = (e: ChangeEvent<HTMLInputElement>) => {
                args.onChange(e.target.value);
            };
            onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
                let newVal;
                if (e.key === "Tab")
                    return;
                else if (!(editorKeys.includes(e.key) || numberKeys.includes(e.key)))
                    e.preventDefault();
                if (ref.current != null) {
                    switch (e.key) {
                        case "ArrowUp":
                            newVal = (Number(ref.current.value) + (args.increment ? args.increment : 1)).toFixed(0);
                            if (args.maxValue != undefined && Number(newVal) > args.maxValue)
                                newVal = String(args.maxValue);
                            ref.current.value = newVal;
                            args.onChange(newVal);
                            break;
                        case "ArrowDown":
                            newVal = (Number(ref.current.value) - (args.increment ? args.increment : 1)).toFixed(0);
                            if (args.minValue != undefined && Number(newVal) < args.minValue)
                                newVal = String(args.minValue);
                            ref.current.value = newVal;
                            args.onChange(newVal);
                            break;
                    }
                }
            };
            onWheel = (e: WheelEvent<HTMLInputElement>) => {
                let newVal;
                if (ref.current != null) {
                    const delta = Math.sign(e.deltaY);
                    if (delta > 0) {
                        newVal = (Number(ref.current.value) - (args.increment ? args.increment : 1)).toFixed(0);
                        if (args.minValue != undefined && Number(newVal) < args.minValue)
                            newVal = String(args.minValue);
                        ref.current.value = newVal;
                        args.onChange(newVal);
                    } else if (delta < 0) {
                        newVal = (Number(ref.current.value) + (args.increment ? args.increment : 1)).toFixed(0);
                        if (args.maxValue != undefined && Number(newVal) > args.maxValue)
                            newVal = String(args.maxValue);
                        ref.current.value = newVal;
                        args.onChange(newVal);
                    }
                }
            };
            break;
        case "float":
            onChange = (e: ChangeEvent<HTMLInputElement>) => {
                args.onChange(e.target.value);
            };
            onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
                let newVal;
                if (e.key === "Tab")
                    return;
                else if (!(editorKeys.includes(e.key) || numberKeys.includes(e.key) || decimalKeys.includes(e.key)))
                    e.preventDefault();
                if (ref.current != null) {
                    switch (e.key) {
                        case "ArrowUp":
                            newVal = (Number(ref.current.value) + (args.increment ? args.increment : 1)).toFixed(args.places ? args.places : 1);
                            if (args.maxValue != undefined && Number(newVal) > args.maxValue)
                                newVal = String(args.maxValue);
                            ref.current.value = newVal;
                            args.onChange(newVal);
                            break;
                        case "ArrowDown":
                            newVal = (Number(ref.current.value) - (args.increment ? args.increment : 1)).toFixed(args.places ? args.places : 1);
                            if (args.minValue != undefined && Number(newVal) < args.minValue)
                                newVal = String(args.minValue);
                            ref.current.value = newVal;
                            args.onChange(newVal);
                            break;
                    }
                }
            };
            onWheel = (e: WheelEvent<HTMLInputElement>) => {
                let newVal;
                if (ref.current != null) {
                    const delta = Math.sign(e.deltaY);
                    if (delta > 0) {
                        newVal = (Number(ref.current.value) - (args.increment ? args.increment : 1)).toFixed(args.places ? args.places : 1);
                        if (args.minValue != undefined && Number(newVal) < args.minValue)
                            newVal = String(args.minValue);
                        ref.current.value = newVal;
                        args.onChange(newVal);
                    } else if (delta < 0) {
                        newVal = (Number(ref.current.value) + (args.increment ? args.increment : 1)).toFixed(args.places ? args.places : 1);
                        if (args.maxValue != undefined && Number(newVal) > args.maxValue)
                            newVal = String(args.maxValue);
                        ref.current.value = newVal;
                        args.onChange(newVal);
                    }
                }
            };
            break;
        default:
            onChange = (e: ChangeEvent<HTMLInputElement>) => {
                args.onChange(e.target.value);
            };
            break;
    }
    if (currentValue != args.value) {
        setCurrentValue(args.value);
        if (ref.current) {
            ref.current.value = args.value;
        }
    }

    useEffect(() => {
        const cancelWheel = (e: MouseEvent) => {
            wheelLock.current && e.preventDefault();
        };
        document.body.addEventListener('wheel', cancelWheel, {
            passive: false
        });
        return () => document.body.removeEventListener('wheel', cancelWheel);
    }, []);

    return (
        <div className={styles.input}>
            <p className={styles.label}>{args.label}</p>
            <input className={styles.inputInner} ref={ref} defaultValue={args.value} onChange={onChange} onKeyDown={onKeyDown} onWheel={onWheel} onMouseEnter={() => {
                wheelLock.current = true;
            }} onMouseLeave={() => {
                wheelLock.current = false;
            }}/>
        </div>
    );
}
