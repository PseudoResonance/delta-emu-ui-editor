"use client";
import styles from "./sidebar.module.css";
import { MouseEvent } from "react";

export default function ElementSelector(args: {
    onClick: () => void,
    editingElement: number,
    index: number,
    updateElement: (data: {
        type: string,
        data: Record<string, any>,
        x: number,
        y: number,
        width: number,
        height: number,
        paddingTop: number,
        paddingBottom: number,
        paddingLeft: number,
        paddingRight: number,
    }) => void,
    elementData: {
        type: string,
        data: Record<string, any>,
        x: number,
        y: number,
        width: number,
        height: number,
        paddingTop: number,
        paddingBottom: number,
        paddingLeft: number,
        paddingRight: number,
    };
    setHoverIndex: (val: boolean) => void;
    onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
}) {
    let label = "Not Bound";
    if (args.index === -1) {
        label = "Canvas";
    }
    switch (args.elementData.type) {
        case "thumbstick":
            label = "Thumbstick";
            break;
        case "dpad":
            label = "D-Pad";
            break;
        case "touchscreen":
            label = "Touchscreen";
            break;
        case "screen":
            label = "Screen";
            break;
        default:
            if (args.elementData.data.inputs?.length > 0) {
                label = args.elementData.data.inputs.join(", ");
            }
            break;
    }
    const attrs: Record<string, any> = {};
    if (typeof args.onContextMenu === 'function')
        attrs.onContextMenu = args.onContextMenu;
    return (
        <div className={`${styles.elementSelector}${args.editingElement == args.index ? ' ' + styles.active : ''}`} {...attrs} onMouseEnter={() => {
            args.setHoverIndex(true);
        }} onMouseLeave={() => {
            args.setHoverIndex(false);
        }} onClick={() => {args.onClick()}}>
            {label}
        </div>
    );
}
