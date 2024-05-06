"use client";
import styles from "./contextmenu.module.css";

export default function ContextMenu(args:
    {
        data: {
            label: string,
            onClick: () => void,
        }[],
        removeSelf: () => void,
    }) {
    return (
        <div className={styles.contextMenu}>
            {args.data.map((val, i) => 
            <button key={i} onClick={() => {val.onClick(); args.removeSelf();}}>{val.label}</button>
            )}
        </div>
    );
}
