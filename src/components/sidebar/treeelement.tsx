"use client";
import styles from "./tree.module.css";
import React from "react";
import { MouseEvent } from "react";

export default function TreeElement(args: {
    getChildren?: (e: Record<string, any>, keyStr: string, depth: number) => React.JSX.Element[],
    children?: React.JSX.Element | React.JSX.Element[],
    keyStr: string,
    depth: number,
    data: Record<string, any>,
    label: string,
    onClick?: (e: MouseEvent<HTMLDivElement>) => void,
    onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void,
    className?: string,
}) {
    const attrs: Record<string, any> = {};
    if (typeof args.onClick === 'function')
        attrs.onClick = args.onClick;
    if (typeof args.onContextMenu === 'function')
        attrs.onContextMenu = args.onContextMenu;
    return (
        <div className={`${styles.tree}${args.className ? ' ' + args.className : ''}`}>
            {// @ts-ignore: Object is possibly 'null'.
            Object.keys(attrs).length > 0 ? <p className={styles.clickable} {...attrs}>{args.label}</p> : <p>{args.label}</p>}
            <div className={styles.treeSub}>
                {...(typeof args.getChildren === 'function' ? args.getChildren(args.data, args.keyStr, args.depth) : (
                    args.children instanceof Array ? args.children : (
                        args.children ? [args.children] : []
                    )
                ))}
            </div>
        </div>
    );
}
