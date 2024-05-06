"use client";
import styles from "./element.module.css";
import { useRef, useState } from "react";

const BORDER_WIDTH = 2;

export default function EmulatorElement(args: {
    pressedKeys: String[];
    parentWidth: number;
    parentHeight: number;
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
    onClick: () => void;
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
    }) => void;
    isHover: boolean;
    scale: number;
    showPopup: (popup: React.JSX.Element, onClose: () => void, onAccept?: () => void) => void;
    showContextMenu: (data: {
        label: string,
        onClick: () => void,
    }[], x: number, y: number) => void;
    duplicateThis: () => void;
    deleteThis: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    let xStart = 0, yStart = 0, xStartMouse = 0, yStartMouse = 0, widthStart = 0, heightStart = 0, paddingLeftStart = 0, paddingRightStart = 0, paddingTopStart = 0, paddingBottomStart = 0;
    let dragging = false;
    let resizing = false;
    const stopDragging = () => {
        dragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        setIsActive(false);
    };
    const stopResizing = () => {
        resizing = false;
        document.onmouseup = null;
        document.onmousemove = null;
        setIsActive(false);
    };
    let label = "";
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
    return (
        <div className={`${styles.element}${isActive ? ' ' + styles.active : ''}${args.isHover ? ' ' + styles.hover : ''}`} ref={ref} style={{
            width: (args.elementData.width + (args.elementData.type === "screen" ? 0 : args.elementData.paddingLeft + args.elementData.paddingRight)) * args.scale - 2 * BORDER_WIDTH,
            height: (args.elementData.height + (args.elementData.type === "screen" ? 0 : args.elementData.paddingTop + args.elementData.paddingBottom)) * args.scale - 2 * BORDER_WIDTH,
            top: (args.elementData.y - (args.elementData.type === "screen" ? 0 : args.elementData.paddingTop)) * args.scale,
            left: (args.elementData.x - (args.elementData.type === "screen" ? 0 : args.elementData.paddingLeft)) * args.scale,
        }} onContextMenu={(e) => {
            e.preventDefault();
            args.showContextMenu([
                {
                    label: 'Duplicate',
                    onClick: () => {
                        args.duplicateThis();
                    },
                }, {
                    label: 'Delete',
                    onClick: () => {
                        args.showPopup(<><h2>Warning</h2><p>Confirm deleting &quot;{label}&quot;</p></>, () => { }, () => {
                            args.deleteThis();
                        });
                    },
                },
            ], e.pageX, e.pageY);
        }}>
            <div className={styles.expandGrid}>
                <div style={{ cursor: 'nw-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            yStartMouse = e.clientY;
                            paddingTopStart = args.elementData.paddingTop;
                            paddingBottomStart = args.elementData.paddingBottom;
                            xStartMouse = e.clientX;
                            paddingLeftStart = args.elementData.paddingLeft;
                            paddingRightStart = args.elementData.paddingRight;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diffY = ((e.clientY - yStartMouse) / args.scale) * -1;
                                e.preventDefault();
                                if (paddingTopStart + diffY < 0) {
                                    diffY = -paddingTopStart;
                                }
                                args.elementData.paddingTop = paddingTopStart + diffY;
                                let diffX = ((e.clientX - xStartMouse) / args.scale) * -1;
                                e.preventDefault();
                                if (paddingLeftStart + diffX < 0) {
                                    diffX = -paddingLeftStart;
                                }
                                args.elementData.paddingLeft = paddingLeftStart + diffX;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
                <div style={{ cursor: 'n-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            yStartMouse = e.clientY;
                            paddingTopStart = args.elementData.paddingTop;
                            paddingBottomStart = args.elementData.paddingBottom;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diff = ((e.clientY - yStartMouse) / args.scale) * -1;
                                e.preventDefault();
                                if (paddingTopStart + diff < 0) {
                                    diff = -paddingTopStart;
                                }
                                args.elementData.paddingTop = paddingTopStart + diff;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
                <div style={{ cursor: 'ne-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            yStartMouse = e.clientY;
                            paddingTopStart = args.elementData.paddingTop;
                            paddingBottomStart = args.elementData.paddingBottom;
                            xStartMouse = e.clientX;
                            paddingLeftStart = args.elementData.paddingLeft;
                            paddingRightStart = args.elementData.paddingRight;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diffY = ((e.clientY - yStartMouse) / args.scale) * -1;
                                e.preventDefault();
                                if (paddingTopStart + diffY < 0) {
                                    diffY = -paddingTopStart;
                                }
                                args.elementData.paddingTop = paddingTopStart + diffY;
                                let diffX = ((e.clientX - xStartMouse) / args.scale);
                                e.preventDefault();
                                if (paddingRightStart + diffX < 0) {
                                    diffX = -paddingRightStart;
                                }
                                args.elementData.paddingRight = paddingRightStart + diffX;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
                <div style={{ cursor: 'w-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            xStartMouse = e.clientX;
                            paddingLeftStart = args.elementData.paddingLeft;
                            paddingRightStart = args.elementData.paddingRight;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diff = ((e.clientX - xStartMouse) / args.scale) * -1;
                                e.preventDefault();
                                if (paddingLeftStart + diff < 0) {
                                    diff = -paddingLeftStart;
                                }
                                args.elementData.paddingLeft = paddingLeftStart + diff;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
                <div style={{ cursor: 'move' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        args.onClick();
                        e.preventDefault();
                        dragging = true;
                        setIsActive(true);
                        xStartMouse = e.clientX;
                        yStartMouse = e.clientY;
                        xStart = args.elementData.x;
                        yStart = args.elementData.y;
                        document.onmouseup = stopDragging;
                        document.onmousemove = (e) => {
                            e.preventDefault();
                            let newTop = yStart + ((e.clientY - yStartMouse) / args.scale);
                            if (newTop < 0) {
                                newTop = 0;
                            } else if (newTop + args.elementData.height > args.parentHeight) {
                                newTop = args.parentHeight - args.elementData.height;
                            }
                            let newLeft = xStart + ((e.clientX - xStartMouse) / args.scale);
                            if (newLeft < 0) {
                                newLeft = 0;
                            } else if (newLeft + args.elementData.width > args.parentWidth) {
                                newLeft = args.parentWidth - args.elementData.width;
                            }
                            args.elementData.x = newLeft;
                            args.elementData.y = newTop;
                            args.updateElement(args.elementData);
                        };
                    }
                }}></div>
                <div style={{ cursor: 'e-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            xStartMouse = e.clientX;
                            paddingLeftStart = args.elementData.paddingLeft;
                            paddingRightStart = args.elementData.paddingRight;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diff = ((e.clientX - xStartMouse) / args.scale);
                                e.preventDefault();
                                if (paddingRightStart + diff < 0) {
                                    diff = -paddingRightStart;
                                }
                                args.elementData.paddingRight = paddingRightStart + diff;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
                <div style={{ cursor: 'sw-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            yStartMouse = e.clientY;
                            paddingTopStart = args.elementData.paddingTop;
                            paddingBottomStart = args.elementData.paddingBottom;
                            xStartMouse = e.clientX;
                            paddingLeftStart = args.elementData.paddingLeft;
                            paddingRightStart = args.elementData.paddingRight;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diffY = ((e.clientY - yStartMouse) / args.scale);
                                e.preventDefault();
                                if (paddingBottomStart + diffY < 0) {
                                    diffY = -paddingBottomStart;
                                }
                                args.elementData.paddingBottom = paddingBottomStart + diffY;
                                let diffX = ((e.clientX - xStartMouse) / args.scale) * -1;
                                e.preventDefault();
                                if (paddingLeftStart + diffX < 0) {
                                    diffX = -paddingLeftStart;
                                }
                                args.elementData.paddingLeft = paddingLeftStart + diffX;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
                <div style={{ cursor: 's-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            yStartMouse = e.clientY;
                            paddingTopStart = args.elementData.paddingTop;
                            paddingBottomStart = args.elementData.paddingBottom;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diff = ((e.clientY - yStartMouse) / args.scale);
                                e.preventDefault();
                                if (paddingBottomStart + diff < 0) {
                                    diff = -paddingBottomStart;
                                }
                                args.elementData.paddingBottom = paddingBottomStart + diff;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
                <div style={{ cursor: 'se-resize' }} onMouseDown={(e) => {
                    if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                        if (ref.current) {
                            args.onClick();
                            e.preventDefault();
                            resizing = true;
                            setIsActive(true);
                            yStartMouse = e.clientY;
                            paddingTopStart = args.elementData.paddingTop;
                            paddingBottomStart = args.elementData.paddingBottom;
                            xStartMouse = e.clientX;
                            paddingLeftStart = args.elementData.paddingLeft;
                            paddingRightStart = args.elementData.paddingRight;
                            document.onmouseup = stopResizing;
                            document.onmousemove = (e) => {
                                let diffY = ((e.clientY - yStartMouse) / args.scale);
                                e.preventDefault();
                                if (paddingBottomStart + diffY < 0) {
                                    diffY = -paddingBottomStart;
                                }
                                args.elementData.paddingBottom = paddingBottomStart + diffY;
                                let diffX = ((e.clientX - xStartMouse) / args.scale);
                                e.preventDefault();
                                if (paddingRightStart + diffX < 0) {
                                    diffX = -paddingRightStart;
                                }
                                args.elementData.paddingRight = paddingRightStart + diffX;
                                args.updateElement(args.elementData);
                            };
                        }
                    }
                }}></div>
            </div>
            <div className={styles.padding} style={{
                paddingTop: args.elementData.type === "screen" ? 0 : args.elementData.paddingTop * args.scale,
                paddingBottom: args.elementData.type === "screen" ? 0 : args.elementData.paddingBottom * args.scale,
                paddingLeft: args.elementData.type === "screen" ? 0 : args.elementData.paddingLeft * args.scale,
                paddingRight: args.elementData.type === "screen" ? 0 : args.elementData.paddingRight * args.scale,
            }}>
                <div className={styles.inner} style={{
                    display: 'block',
                    position: 'absolute',
                    width: args.elementData.width * args.scale - 2 * BORDER_WIDTH,
                    height: args.elementData.height * args.scale - 2 * BORDER_WIDTH,
                    top: args.elementData.type === "screen" ? 0 : args.elementData.paddingTop * args.scale - BORDER_WIDTH,
                    left: args.elementData.type === "screen" ? 0 : args.elementData.paddingLeft * args.scale - BORDER_WIDTH,
                }}>{(args.elementData.type === "dpad" || args.elementData.type === "thumbstick") ? <div className={styles.padStickOverlay}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : <></>}
                    {// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                        args.elementData.type === "thumbstick" ? <div className={`${styles.thumbstickImage}${args.elementData.data.thumbstick && args.elementData.data.thumbstick.width ? ' ' + styles.thumbstickImageEmpty : ''}`}><div style={{
                            width: args.elementData.data.thumbstick && args.elementData.data.thumbstick.width ? `${args.elementData.data.thumbstick.width * args.scale}px` : "0",
                            height: args.elementData.data.thumbstick && args.elementData.data.thumbstick.height ? `${args.elementData.data.thumbstick.height * args.scale}px` : "0",
                            position: 'absolute',
                            backgroundImage: `url(${args.elementData.data?.thumbstick?.imageUrl})`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                        }}></div></div> : <></>}
                    <div className={styles.expandGrid}>
                        <div style={{ cursor: 'nw-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    yStartMouse = e.clientY;
                                    yStart = args.elementData.y;
                                    heightStart = args.elementData.height;
                                    xStartMouse = e.clientX;
                                    xStart = args.elementData.x;
                                    widthStart = args.elementData.width;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diffY = ((e.clientY - yStartMouse) / args.scale) * -1;
                                        let diffX = ((e.clientX - xStartMouse) / args.scale) * -1;
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diffY < 0) {
                                                diffY = 0;
                                            }
                                            args.elementData.paddingTop = diffY;
                                            if (diffX < 0) {
                                                diffX = 0;
                                            }
                                            args.elementData.paddingLeft = diffX;
                                        } else {
                                            if (heightStart + diffY < 0) {
                                                diffY = -heightStart;
                                            }
                                            args.elementData.y = yStart - diffY;
                                            args.elementData.height = heightStart + diffY;
                                            if (widthStart + diffX < 0) {
                                                diffX = -widthStart;
                                            }
                                            args.elementData.x = xStart - diffX;
                                            args.elementData.width = widthStart + diffX;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                        <div style={{ cursor: 'n-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    yStartMouse = e.clientY;
                                    yStart = args.elementData.y;
                                    heightStart = args.elementData.height;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diff = ((e.clientY - yStartMouse) / args.scale) * -1;
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diff < 0) {
                                                diff = 0;
                                            }
                                            args.elementData.paddingTop = diff;
                                        } else {
                                            if (heightStart + diff < 0) {
                                                diff = -heightStart;
                                            }
                                            args.elementData.y = yStart - diff;
                                            args.elementData.height = heightStart + diff;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                        <div style={{ cursor: 'ne-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    yStartMouse = e.clientY;
                                    yStart = args.elementData.y;
                                    heightStart = args.elementData.height;
                                    xStartMouse = e.clientX;
                                    xStart = args.elementData.x;
                                    widthStart = args.elementData.width;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diffY = ((e.clientY - yStartMouse) / args.scale) * -1;
                                        let diffX = ((e.clientX - xStartMouse) / args.scale);
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diffY < 0) {
                                                diffY = 0;
                                            }
                                            args.elementData.paddingTop = diffY;
                                            if (diffX < 0) {
                                                diffX = 0;
                                            }
                                            args.elementData.paddingRight = diffX;
                                        } else {
                                            if (heightStart + diffY < 0) {
                                                diffY = -heightStart;
                                            }
                                            args.elementData.y = yStart - diffY;
                                            args.elementData.height = heightStart + diffY;
                                            if (widthStart + diffX < 0) {
                                                diffX = -widthStart;
                                            }
                                            args.elementData.width = widthStart + diffX;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                        <div style={{ cursor: 'w-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    xStartMouse = e.clientX;
                                    xStart = args.elementData.x;
                                    widthStart = args.elementData.width;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diff = ((e.clientX - xStartMouse) / args.scale) * -1;
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diff < 0) {
                                                diff = 0;
                                            }
                                            args.elementData.paddingLeft = diff;
                                        } else {
                                            if (widthStart + diff < 0) {
                                                diff = -widthStart;
                                            }
                                            args.elementData.x = xStart - diff;
                                            args.elementData.width = widthStart + diff;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                        <div style={{ cursor: 'move' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                args.onClick();
                                e.preventDefault();
                                dragging = true;
                                setIsActive(true);
                                xStartMouse = e.clientX;
                                yStartMouse = e.clientY;
                                xStart = args.elementData.x;
                                yStart = args.elementData.y;
                                document.onmouseup = stopDragging;
                                document.onmousemove = (e) => {
                                    e.preventDefault();
                                    let newTop = yStart + ((e.clientY - yStartMouse) / args.scale);
                                    if (newTop < 0) {
                                        newTop = 0;
                                    } else if (newTop + args.elementData.height > args.parentHeight) {
                                        newTop = args.parentHeight - args.elementData.height;
                                    }
                                    let newLeft = xStart + ((e.clientX - xStartMouse) / args.scale);
                                    if (newLeft < 0) {
                                        newLeft = 0;
                                    } else if (newLeft + args.elementData.width > args.parentWidth) {
                                        newLeft = args.parentWidth - args.elementData.width;
                                    }
                                    args.elementData.x = newLeft;
                                    args.elementData.y = newTop;
                                    args.updateElement(args.elementData);
                                };
                            }
                        }}></div>
                        <div style={{ cursor: 'e-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    xStartMouse = e.clientX;
                                    xStart = args.elementData.x;
                                    widthStart = args.elementData.width;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diff = ((e.clientX - xStartMouse) / args.scale);
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diff < 0) {
                                                diff = 0;
                                            }
                                            args.elementData.paddingRight = diff;
                                        } else {
                                            if (widthStart + diff < 0) {
                                                diff = -widthStart;
                                            }
                                            args.elementData.width = widthStart + diff;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                        <div style={{ cursor: 'sw-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    yStartMouse = e.clientY;
                                    yStart = args.elementData.y;
                                    heightStart = args.elementData.height;
                                    xStartMouse = e.clientX;
                                    xStart = args.elementData.x;
                                    widthStart = args.elementData.width;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diffY = ((e.clientY - yStartMouse) / args.scale);
                                        let diffX = ((e.clientX - xStartMouse) / args.scale) * -1;
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diffY < 0) {
                                                diffY = 0;
                                            }
                                            args.elementData.paddingBottom = diffY;
                                            if (diffX < 0) {
                                                diffX = 0;
                                            }
                                            args.elementData.paddingLeft = diffX;
                                        } else {
                                            if (heightStart + diffY < 0) {
                                                diffY = -heightStart;
                                            }
                                            args.elementData.height = heightStart + diffY;
                                            if (widthStart + diffX < 0) {
                                                diffX = -widthStart;
                                            }
                                            args.elementData.x = xStart - diffX;
                                            args.elementData.width = widthStart + diffX;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                        <div style={{ cursor: 's-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    yStartMouse = e.clientY;
                                    yStart = args.elementData.y;
                                    heightStart = args.elementData.height;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diff = ((e.clientY - yStartMouse) / args.scale);
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diff < 0) {
                                                diff = 0;
                                            }
                                            args.elementData.paddingBottom = diff;
                                        } else {
                                            if (heightStart + diff < 0) {
                                                diff = -heightStart;
                                            }
                                            args.elementData.height = heightStart + diff;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                        <div style={{ cursor: 'se-resize' }} onMouseDown={(e) => {
                            if (!(args.pressedKeys.includes("ControlLeft") || args.pressedKeys.includes("ControlRight"))) {
                                if (ref.current) {
                                    args.onClick();
                                    e.preventDefault();
                                    resizing = true;
                                    setIsActive(true);
                                    yStartMouse = e.clientY;
                                    yStart = args.elementData.y;
                                    heightStart = args.elementData.height;
                                    xStartMouse = e.clientX;
                                    xStart = args.elementData.x;
                                    widthStart = args.elementData.width;
                                    document.onmouseup = stopResizing;
                                    document.onmousemove = (e) => {
                                        let diffX = ((e.clientX - xStartMouse) / args.scale);
                                        let diffY = ((e.clientY - yStartMouse) / args.scale);
                                        e.preventDefault();
                                        if (args.pressedKeys.includes("ShiftLeft") || args.pressedKeys.includes("ShiftRight")) {
                                            if (diffY < 0) {
                                                diffY = 0;
                                            }
                                            args.elementData.paddingBottom = diffY;
                                            if (diffX < 0) {
                                                diffX = 0;
                                            }
                                            args.elementData.paddingRight = diffX;
                                        } else {
                                            if (heightStart + diffY < 0) {
                                                diffY = -heightStart;
                                            }
                                            args.elementData.height = heightStart + diffY;
                                            if (widthStart + diffX < 0) {
                                                diffX = -widthStart;
                                            }
                                            args.elementData.width = widthStart + diffX;
                                        }
                                        args.updateElement(args.elementData);
                                    };
                                }
                            }
                        }}></div>
                    </div>
                    <div className={styles.labelDiv}><div className={styles.inputsDescription}>{label}</div></div>
                </div>
            </div>
        </div>
    );
}
