"use client";
import { Dispatch, SetStateAction } from "react";
import EmulatorWindow from "./window";
import styles from "./editor.module.css";

export default function MainEditor(args: {
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
    layoutData: {
        background: {
            url: string,
            naturalHeight: number,
            naturalWidth: number,
            lockRatio: boolean,
        },
        assets: Record<string, string>,
        canvas: {
            width: number,
            height: number,
        },
        padding: {
            top: number,
            bottom: number,
            left: number,
            right: number,
        },
        translucent: boolean,
    };
    setLayoutData: Dispatch<SetStateAction<{
        background: {
            url: string,
            naturalHeight: number,
            naturalWidth: number,
            lockRatio: boolean,
        },
        assets: Record<string, string>,
        canvas: {
            width: number,
            height: number,
        },
        padding: {
            top: number,
            bottom: number,
            left: number,
            right: number,
        },
        translucent: boolean,
    }>>;
    editingElement: number;
    setEditingElement: Dispatch<SetStateAction<number>>;
    scale: number;
    setScale: Dispatch<SetStateAction<number>>;
    xOffset: number;
    setXOffset: Dispatch<SetStateAction<number>>;
    yOffset: number;
    setYOffset: Dispatch<SetStateAction<number>>;
    hoverIndex: number;
    showPopup: (popup: React.JSX.Element, onClose: () => void, onAccept?: () => void) => void;
    showContextMenu: (data: {
        label: string,
        onClick: () => void,
    }[], x: number, y: number) => void;
}) {
    let xStart = 0, yStart = 0, xStartMouse = 0, yStartMouse = 0;
    let dragging = false;
    const stopDragging = () => {
        dragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
    };
    const setWidthHeight = (width: number, height: number) => {
        const newLayout = JSON.parse(JSON.stringify(args.layoutData));
        newLayout.background.naturalWidth = width;
        newLayout.background.naturalHeight = height;
        args.setLayoutData(newLayout);
    };
    return (
        <div className={styles.editor} onWheel={(e) => {
            let newVal = 0;
            const delta = Math.sign(e.deltaY);
            if (delta > 0) {
                newVal = (args.scale - 0.01);
                if (0 != undefined && Number(newVal) < 0)
                    newVal = 0;
            } else if (delta < 0) {
                newVal = (args.scale + 0.01);
            }
            args.setScale(newVal);
        }} onMouseDown={(e) => {
            if (args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight")) {
                e.preventDefault();
                dragging = true;
                xStartMouse = e.clientX;
                yStartMouse = e.clientY;
                xStart = args.xOffset;
                yStart = args.yOffset;
                document.onmouseup = stopDragging;
                document.onmousemove = (e) => {
                    e.preventDefault();
                    let newY = yStart + (e.clientY - yStartMouse);
                    let newX = xStart + (e.clientX - xStartMouse);
                    args.setXOffset(newX);
                    args.setYOffset(newY);
                };
            }
        }} onContextMenu={(e) => {
            if (e.target == e.currentTarget) {
                e.preventDefault();
                args.showContextMenu([
                    {
                        label: 'Return to Center',
                        onClick: () => {
                            args.setXOffset(0);
                            args.setYOffset(0);
                        },
                    }, {
                        label: 'Reset Zoom',
                        onClick: () => {
                            args.setScale(1);
                        },
                    },
                ], e.pageX, e.pageY);
            }
        }}>
            <EmulatorWindow addElementData={args.addElementData} removeElement={args.removeElement} editingElement={args.editingElement} showPopup={args.showPopup} showContextMenu={args.showContextMenu} background={args.layoutData.background.url} hoverIndex={args.hoverIndex} setWidthHeight={setWidthHeight} setEditingElement={args.setEditingElement} pressedKeys={args.pressedKeys} updateElement={args.updateElement} style={{transform: `translate(${args.xOffset}px, ${args.yOffset}px)`}} elements={args.elements} scale={args.scale} width={args.layoutData.canvas.width} height={args.layoutData.canvas.height} padding={args.layoutData.padding} />
        </div>
    );
}
