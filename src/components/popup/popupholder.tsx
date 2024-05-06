"use client";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./popup.module.css";
import Popup from "./popup";

export default function PopupHolder(args:
    {
        elements: {
            data: React.JSX.Element,
            onClose: () => void,
            onAccept?: () => void,
        }[],
        setPopups: Dispatch<SetStateAction<{
            data: React.JSX.Element,
            onClose: () => void,
            onAccept?: () => void,
        }[]>>;
    }) {
    return (
        <div className={`${styles.popupHolder}${args.elements.length > 0 ? ' ' + styles.show : ''}`}>
            {args.elements.map((val, i) => 
                <Popup key={i} removeSelf={() => {
                    const newElements = args.elements.slice();
                    newElements.splice(i, 1);
                    args.setPopups(newElements);
                }} onClose={val.onClose} onAccept={val.onAccept}>{val.data}</Popup>
            )}
        </div>
    );
}
