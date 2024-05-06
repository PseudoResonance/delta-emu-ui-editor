"use client";
import React, { useRef } from "react";
import styles from "./contextmenu.module.css";
import ContextMenu from "./contextmenu";

export default function ContextMenuHolder(args:
    {
        clear: () => void;
        menu: {
            data: {
                label: string,
                onClick: () => void,
            }[] | null,
            x: number,
            y: number,
        },
    }) {
    return (
        <div className={`${styles.contextMenuHolder} ${styles.verticalAlign}${args.menu.data != null ? ' ' + styles.show : ''}`} onClick={(e) => {
            if (e.currentTarget == e.target) {
                args.clear();
            }
        }} onContextMenu={(e) => e.preventDefault()}>
            {args.menu.data != null ?
                <>
                    <div className={styles.aligner} style={{
                        flexBasis: `${args.menu.y}px`,
                    }} onClick={(e) => {
                        if (e.currentTarget == e.target) {
                            args.clear();
                        }
                    }} />
                    <div className={styles.horizontalAlign} onClick={(e) => {
                        if (e.currentTarget == e.target) {
                            args.clear();
                        }
                    }}>
                        <div className={styles.aligner} style={{
                            flexBasis: `${args.menu.x}px`,
                        }} onClick={(e) => {
                            if (e.currentTarget == e.target) {
                                args.clear();
                            }
                        }} />
                        <div>
                            <ContextMenu removeSelf={args.clear} data={args.menu.data} />
                        </div>
                    </div>
                </>
                : <></>}
        </div>
    );
}
