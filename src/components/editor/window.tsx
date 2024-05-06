"use client";
import { Dispatch, SetStateAction } from "react";
import EmulatorElement from "./element";
import styles from "./editor.module.css";

const BORDER_WIDTH = 2;

export default function EmulatorWindow(args: {
    pressedKeys: String[];
    elements: {
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
    }[];
    addElementData: (data: {
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
    }) => void;
    removeElement: (key: number) => void;
    updateElement: (key: number, data: {
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
    }) => void;
    setWidthHeight: (width: number, height: number) => void;
    background: string;
    editingElement: number;
    setEditingElement: Dispatch<SetStateAction<number>>;
    style: Object;
    scale: number;
    width: number;
    height: number;
    hoverIndex: number;
    padding: { top: number, bottom: number, left: number, right: number };
    showPopup: (popup: React.JSX.Element, onClose: () => void, onAccept?: () => void) => void;
    showContextMenu: (data: {
        label: string,
        onClick: () => void,
    }[], x: number, y: number) => void;
}) {
    return (
        <div className={styles.window} style={{
            ...args.style,
            width: (args.width + args.padding.left + args.padding.right) * args.scale - 2 * BORDER_WIDTH,
            height: (args.height + args.padding.top + args.padding.bottom) * args.scale - 2 * BORDER_WIDTH,
        }}>
            <div className={styles.windowInner} style={{
                width: args.width * args.scale - 2 * BORDER_WIDTH,
                height: args.height * args.scale - 2 * BORDER_WIDTH,
                marginTop: args.padding.top * args.scale - BORDER_WIDTH,
                marginBottom: args.padding.bottom * args.scale,
                marginLeft: args.padding.left * args.scale - BORDER_WIDTH,
                marginRight: args.padding.right * args.scale,
            }}>
                {
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    <img onLoad={(e) => {
                        args.setWidthHeight(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight);
                    }} src={args.background} style={{
                        display: args.background ? 'inherit' : 'none',
                        width: args.width * args.scale - 2 * BORDER_WIDTH,
                        height: args.height * args.scale - 2 * BORDER_WIDTH,
                    }} />
                }
                {args.elements.map((val: {
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
                }, i: number) => <EmulatorElement showPopup={args.showPopup} showContextMenu={args.showContextMenu} onClick={() => {
                    args.setEditingElement(i);
                }} pressedKeys={args.pressedKeys} key={i} isHover={i === args.hoverIndex} updateElement={(data: {
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
                }) => { args.updateElement(i, data) }} deleteThis={() => {
                    if (args.editingElement >= i)
                        args.setEditingElement(args.editingElement - 1);
                    args.removeElement(i);
                }} duplicateThis={() => {
                    args.addElementData(JSON.parse(JSON.stringify(args.elements[i])));
                }} parentWidth={args.width} parentHeight={args.height} elementData={val} scale={args.scale} />)}
            </div>
        </div>
    );
}
