"use client";
import styles from "./popup.module.css";

export default function Popup(args:
    {
        children?: React.JSX.Element | React.JSX.Element[],
        removeSelf: () => void,
        onClose: () => void,
        onAccept?: () => void,
    }) {
    return (
        <div className={styles.popup}>
            <div>
                {...(args.children ? (args.children instanceof Array ? args.children : [args.children]) : [])}
            </div>
            <div className={styles.buttons}>
                <button className={`${styles.button} ${typeof args.onAccept === "function" ? styles.cancel : styles.close}`} onClick={() => {args.onClose(); args.removeSelf();}}>{typeof args.onAccept === "function" ? "Cancel" : "Close"}</button>
                {// @ts-ignore: Object is possibly 'null'.
                typeof args.onAccept === 'function' ? <button className={`${styles.button} ${styles.confirm}`} onClick={() => {args.onAccept(); args.removeSelf();}}>Confirm</button> : <></>}
            </div>
        </div>
    );
}
