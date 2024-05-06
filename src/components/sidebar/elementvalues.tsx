"use client";
import styles from "./sidebar.module.css";
import ValueInput from "../inputs/valueinput";
import React from "react";
import Button from "../inputs/button";
import DropdownInput from "../inputs/dropdowninput";
import FileInput from "../inputs/fileinput";
import convertPdfToImage from "@/utils/pdf/pdfToImg";

export default function ElementValues(args: {
    elementIndex: number,
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
    duplicateThis: () => void;
    deleteThis: () => void;
    parentWidth: number;
    parentHeight: number;
    showPopup: (popup: React.JSX.Element, onClose: () => void, onAccept?: () => void) => void;
}) {
    let data: React.JSX.Element[] = [];
    switch (args.elementData.type) {
        case "thumbstick":
            data = [(<ValueInput key="thumbstickname" elementIndex={args.elementIndex} label="Thumbstick Name" value={args.elementData.data.thumbstick.name} onChange={(val: string) => {
                if (!args.elementData.data.thumbstick) {
                    args.elementData.data.thumbstick = {};
                }
                args.elementData.data.thumbstick.name = val;
                args.updateElement(args.elementData);
            }} />), (<FileInput key="thumbstickfile" label="Thumbstick Image" accept="image/*,.pdf" onChange={(val: File) => {
                if (!args.elementData.data.thumbstick) {
                    args.elementData.data.thumbstick = {};
                }
                if (val.name.toLocaleLowerCase().endsWith('.pdf')) {
                    convertPdfToImage(val).then(url => {
                        args.elementData.data.thumbstick.imageUrl = url;
                        args.elementData.data.thumbstick.name = val.name;
                        args.updateElement(args.elementData);
                    }).catch(e => {
                        console.error("Error while reading PDF!", e);
                        args.showPopup(<><h1>Error</h1><p>Unable to read PDF!</p></>, () => {});
                    });
                } else {
                    args.elementData.data.thumbstick.imageUrl = URL.createObjectURL(val);
                    args.elementData.data.thumbstick.name = val.name;
                    args.updateElement(args.elementData);
                }
            }} />), (<ValueInput key="thumbstickwidth" elementIndex={args.elementIndex} type="number" label="Thumbstick Width" minValue={0} value={args.elementData.data.thumbstick.width} onChange={(val: string) => {
                if (!args.elementData.data.thumbstick) {
                    args.elementData.data.thumbstick = {};
                }
                args.elementData.data.thumbstick.width = Number(val);
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="thumbstickheight" elementIndex={args.elementIndex} type="number" label="Thumbstick Height" minValue={0} value={args.elementData.data.thumbstick.height} onChange={(val: string) => {
                if (!args.elementData.data.thumbstick) {
                    args.elementData.data.thumbstick = {};
                }
                args.elementData.data.thumbstick.height = Number(val);
                args.updateElement(args.elementData);
            }} />)];
        case "dpad":
            data = [...data, (<ValueInput key="inputup" elementIndex={args.elementIndex} label="Input Up" value={args.elementData.data.inputsobj.up} onChange={(val: string) => {
                if (!args.elementData.data.inputsobj) {
                    args.elementData.data.inputsobj = {};
                }
                args.elementData.data.inputsobj.up = val;
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="inputdown" elementIndex={args.elementIndex} label="Input Down" value={args.elementData.data.inputsobj.down} onChange={(val: string) => {
                if (!args.elementData.data.inputsobj) {
                    args.elementData.data.inputsobj = {};
                }
                args.elementData.data.inputsobj.down = val;
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="inputleft" elementIndex={args.elementIndex} label="Input Left" value={args.elementData.data.inputsobj.left} onChange={(val: string) => {
                if (!args.elementData.data.inputsobj) {
                    args.elementData.data.inputsobj = {};
                }
                args.elementData.data.inputsobj.left = val;
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="inputright" elementIndex={args.elementIndex} label="Input Right" value={args.elementData.data.inputsobj.right} onChange={(val: string) => {
                if (!args.elementData.data.inputsobj) {
                    args.elementData.data.inputsobj = {};
                }
                args.elementData.data.inputsobj.right = val;
                args.updateElement(args.elementData);
            }} />)];
            break;
        case "touchscreen":
            data = [(<ValueInput key="touchscreenx" elementIndex={args.elementIndex} label="Touchscreen X" value={args.elementData.data.inputsobj.x} onChange={(val: string) => {
                if (!args.elementData.data.inputsobj) {
                    args.elementData.data.inputsobj = {};
                }
                args.elementData.data.inputsobj.x = val;
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="touchscreeny" elementIndex={args.elementIndex} label="Touchscreen Y" value={args.elementData.data.inputsobj.y} onChange={(val: string) => {
                if (!args.elementData.data.inputsobj) {
                    args.elementData.data.inputsobj = {};
                }
                args.elementData.data.inputsobj.y = val;
                args.updateElement(args.elementData);
            }} />)];
            break;
        case "screen":
            data = [(<ValueInput key="screenx" elementIndex={args.elementIndex} type="number" label="Screen X" minValue={0} value={args.elementData.data.screen.x} onChange={(val: string) => {
                if (!args.elementData.data.screen) {
                    args.elementData.data.screen = {};
                }
                args.elementData.data.screen.x = val;
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="screeny" elementIndex={args.elementIndex} type="number" label="Screen Y" minValue={0} value={args.elementData.data.screen.y} onChange={(val: string) => {
                if (!args.elementData.data.screen) {
                    args.elementData.data.screen = {};
                }
                args.elementData.data.screen.y = val;
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="screenwidth" elementIndex={args.elementIndex} type="number" label="Screen Width" minValue={0} value={args.elementData.data.screen.width} onChange={(val: string) => {
                if (!args.elementData.data.screen) {
                    args.elementData.data.screen = {};
                }
                args.elementData.data.screen.width = val;
                args.updateElement(args.elementData);
            }} />), (<ValueInput key="screenheight" elementIndex={args.elementIndex} type="number" label="Screen Height" minValue={0} value={args.elementData.data.screen.height} onChange={(val: string) => {
                if (!args.elementData.data.screen) {
                    args.elementData.data.screen = {};
                }
                args.elementData.data.screen.height = val;
                args.updateElement(args.elementData);
            }} />)];
            break;
        default:
            data = [(<ValueInput key="inputs" elementIndex={args.elementIndex} label="Inputs" value={args.elementData.data.inputs?.join(', ')} onChange={(val: string) => {
                args.elementData.data.inputs = val.replace(/\s/g, '').split(',');
                args.updateElement(args.elementData);
            }} />)];
            break;
    }
    let label = "Not Bound";
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
        <div className={styles.elementValues}>
            <DropdownInput elementIndex={args.elementIndex} label="Type" defaultValue={args.elementData.type} values={{ "": "Button", "dpad": "D-Pad", "thumbstick": "Thumbstick", "touchscreen": "Touchscreen", "screen": "Screen" }} onChange={(val: string) => {
                args.elementData.type = val;
                args.updateElement(args.elementData);
            }} />
            {...data}
            <ValueInput elementIndex={args.elementIndex} type="number" label="X" value={args.elementData.x.toFixed(0)} minValue={0} maxValue={args.parentWidth - args.elementData.width} onChange={(val: string) => {
                args.elementData.x = Number(val);
                args.updateElement(args.elementData);
            }} />
            <ValueInput elementIndex={args.elementIndex} type="number" label="Y" value={args.elementData.y.toFixed(0)} minValue={0} maxValue={args.parentHeight - args.elementData.height} onChange={(val: string) => {
                args.elementData.y = Number(val);
                args.updateElement(args.elementData);
            }} />
            <Button onClick={() => {
                args.elementData.x = Number((args.parentWidth - args.elementData.width) / 2);
                args.updateElement(args.elementData);
            }} label="Center X" />
            <Button onClick={() => {
                args.elementData.y = Number((args.parentHeight - args.elementData.height) / 2);
                args.updateElement(args.elementData);
            }} label="Center Y" />
            <ValueInput elementIndex={args.elementIndex} type="number" label="Width" value={args.elementData.width.toFixed(0)} minValue={0} maxValue={args.parentWidth - args.elementData.x} onChange={(val: string) => {
                args.elementData.width = Number(val);
                args.updateElement(args.elementData);
            }} />
            <ValueInput elementIndex={args.elementIndex} type="number" label="Height" value={args.elementData.height.toFixed(0)} minValue={0} maxValue={args.parentHeight - args.elementData.y} onChange={(val: string) => {
                args.elementData.height = Number(val);
                args.updateElement(args.elementData);
            }} />
            {...(args.elementData.type === "screen" ? [<></>] : [
                (<ValueInput elementIndex={args.elementIndex} key={"paddingtop"} type="number" label="Padding Top" value={args.elementData.paddingTop.toFixed(0)} minValue={0} onChange={(val: string) => {
                    args.elementData.paddingTop = Number(val);
                    args.updateElement(args.elementData);
                }} />),
                (<ValueInput elementIndex={args.elementIndex} key={"paddingbottom"} type="number" label="Padding Bottom" value={args.elementData.paddingBottom.toFixed(0)} minValue={0} onChange={(val: string) => {
                    args.elementData.paddingBottom = Number(val);
                    args.updateElement(args.elementData);
                }} />),
                (<ValueInput elementIndex={args.elementIndex} key={"paddingleft"} type="number" label="Padding Left" value={args.elementData.paddingLeft.toFixed(0)} minValue={0} onChange={(val: string) => {
                    args.elementData.paddingLeft = Number(val);
                    args.updateElement(args.elementData);
                }} />),
                (<ValueInput elementIndex={args.elementIndex} key={"paddingright"} type="number" label="Padding Right" value={args.elementData.paddingRight.toFixed(0)} minValue={0} onChange={(val: string) => {
                    args.elementData.paddingRight = Number(val);
                    args.updateElement(args.elementData);
                }} />)])}
            <Button onClick={() => { args.duplicateThis() }} label="Duplicate Element" />
            <Button onClick={() => {
                args.showPopup(<><h2>Warning</h2><p>Confirm deleting &quot;{label}&quot;</p></>, () => { }, () => {
                    args.deleteThis();
                });
            }} label="Delete Element" />
        </div>
    );
}
