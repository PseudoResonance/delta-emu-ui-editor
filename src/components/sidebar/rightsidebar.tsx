"use client";
import styles from "./sidebar.module.css";
import ElementValues from "./elementvalues";
import React, { Dispatch, SetStateAction } from "react";
import ElementSelector from "./elementselector";
import ValueInput from "../inputs/valueinput";
import DropdownInput from "../inputs/dropdowninput";
import Button from "../inputs/button";
import CheckboxInput from "../inputs/checkboxinput";
import FileInput from "../inputs/fileinput";
import convertPdfToImage from "@/utils/pdf/pdfToImg";

export default function RightSidebar(args: {
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
    addElement: () => void;
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
    setElements: (data: {
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
    }[]) => void;
    removeElement: (key: number) => void;
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
    hoverIndex: number;
    setHoverIndex: Dispatch<SetStateAction<number>>;
    showPopup: (popup: React.JSX.Element, onClose: () => void, onAccept?: () => void) => void;
    showContextMenu: (data: {
        label: string,
        onClick: () => void,
    }[], x: number, y: number) => void;
}) {
    return (
        <div className={styles.sidebar}>
            <div>
                <ValueInput elementIndex={0} type="float" label="Zoom" value={args.scale.toFixed(4)} increment={0.01} minValue={0} places={4} onChange={(val: string) => { args.setScale(Number(val)) }} />
                <Button onClick={() => { args.addElement() }} label="Add Element" />
                <div className={styles.sidebarElements}>
                    <ElementSelector editingElement={args.editingElement} index={-1} setHoverIndex={(val: boolean) => args.setHoverIndex(-1)} updateElement={(data: {
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
                    }) => { }} onClick={() => {
                        args.setEditingElement(-1);
                    }} key={-1} elementData={{
                        type: "",
                        data: {},
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                    }} />
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
                    }, i: number) => <ElementSelector editingElement={args.editingElement} index={i} setHoverIndex={(val: boolean) => args.setHoverIndex(val ? i : -1)} updateElement={(data: {
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
                    }) => { args.updateElement(i, data) }} onClick={() => {
                        args.setEditingElement(i);
                    }} onContextMenu={(e) => {
                        e.preventDefault();
                        args.showContextMenu([
                            {
                                label: 'Duplicate',
                                onClick: () => {
                                    args.addElementData(JSON.parse(JSON.stringify(args.elements[i])));
                                },
                            }, {
                                label: 'Delete',
                                onClick: () => {
                                    args.showPopup(<><h2>Warning</h2><p>Confirm deleting &quot;{(() => {
                                        let label = "Not Bound";
                                        switch (val.type) {
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
                                                if (val.data.inputs?.length > 0) {
                                                    label = val.data.inputs.join(", ");
                                                }
                                                break;
                                        }
                                        return label;
                                    })()}&quot;</p></>, () => { }, () => {
                                        if (args.editingElement >= i)
                                            args.setEditingElement(args.editingElement - 1);
                                        args.removeElement(i);
                                    });
                                },
                            },
                        ], e.pageX, e.pageY);
                    }} key={i} elementData={val} />)}
                </div>
            </div>
            <hr />
            <div>
                {
                    args.editingElement >= 0 ? (
                        <>
                            <ElementValues showPopup={args.showPopup} elementIndex={args.editingElement} elementData={args.elements[args.editingElement]} updateElement={(data: {
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
                            }) => { args.updateElement(args.editingElement, data) }} parentWidth={args.layoutData.canvas.width} parentHeight={args.layoutData.canvas.height} deleteThis={() => {
                                args.setEditingElement(args.editingElement - 1);
                                args.removeElement(args.editingElement);
                            }} duplicateThis={() => {
                                args.addElementData(JSON.parse(JSON.stringify(args.elements[args.editingElement])));
                            }} />
                        </>
                    ) : (<>
                        <DropdownInput elementIndex={0} label="Asset Type" defaultValue={args.layoutData.assets.type ? args.layoutData.assets.type : "pdf"} values={{ "pdf": "PDF", "png": "PNG" }} onChange={(val: string) => {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            newLayout.assets.type = val;
                            args.setLayoutData(newLayout);
                        }} />
                        {args.layoutData.assets.type === "png" ?
                            <>
                                <ValueInput elementIndex={0} label="Small" value={args.layoutData.assets.small ? args.layoutData.assets.small : ""} onChange={(val: string) => {
                                    const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                    newLayout.assets.small = val;
                                    args.setLayoutData(newLayout);
                                }} /><FileInput key="smallfile" label="Choose Small Image" accept=".png" onChange={(val: File) => {
                                    const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                    if (val.name.toLocaleLowerCase().endsWith('.pdf')) {
                                        convertPdfToImage(val).then(url => {
                                            if (newLayout.background.url.length === 0) {
                                                newLayout.background.url = url;
                                                newLayout.background.naturalHeight = -1;
                                                newLayout.background.naturalWidth = -1;
                                            }
                                            newLayout.assets.small = val.name;
                                            args.setLayoutData(newLayout);
                                        }).catch(e => {
                                            console.error("Error while reading PDF!", e);
                                            args.showPopup(<><h1>Error</h1><p>Unable to read PDF!</p></>, () => { });
                                        });
                                    } else {
                                        if (newLayout.background.url.length === 0) {
                                            newLayout.background.url = URL.createObjectURL(val);
                                            newLayout.background.naturalHeight = -1;
                                            newLayout.background.naturalWidth = -1;
                                        }
                                        newLayout.assets.small = val.name;
                                        args.setLayoutData(newLayout);
                                    }
                                }} />
                                <ValueInput elementIndex={0} label="Medium" value={args.layoutData.assets.medium ? args.layoutData.assets.medium : ""} onChange={(val: string) => {
                                    const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                    newLayout.assets.medium = val;
                                    args.setLayoutData(newLayout);
                                }} /><FileInput key="mediumfile" label="Choose Medium Image" accept=".png" onChange={(val: File) => {
                                    const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                    if (val.name.toLocaleLowerCase().endsWith('.pdf')) {
                                        convertPdfToImage(val).then(url => {
                                            if (newLayout.background.url.length === 0) {
                                                newLayout.background.url = url;
                                                newLayout.background.naturalHeight = -1;
                                                newLayout.background.naturalWidth = -1;
                                            }
                                            newLayout.assets.medium = val.name;
                                            args.setLayoutData(newLayout);
                                        }).catch(e => {
                                            console.error("Error while reading PDF!", e);
                                            args.showPopup(<><h1>Error</h1><p>Unable to read PDF!</p></>, () => { });
                                        });
                                    } else {
                                        if (newLayout.background.url.length === 0) {
                                            newLayout.background.url = URL.createObjectURL(val);
                                            newLayout.background.naturalHeight = -1;
                                            newLayout.background.naturalWidth = -1;
                                        }
                                        newLayout.assets.medium = val.name;
                                        args.setLayoutData(newLayout);
                                    }
                                }} />
                                <ValueInput elementIndex={0} label="Large" value={args.layoutData.assets.large ? args.layoutData.assets.large : ""} onChange={(val: string) => {
                                    const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                    newLayout.assets.large = val;
                                    args.setLayoutData(newLayout);
                                }} /><FileInput key="largefile" label="Choose Large Image" accept=".png" onChange={(val: File) => {
                                    const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                    if (val.name.toLocaleLowerCase().endsWith('.pdf')) {
                                        convertPdfToImage(val).then(url => {
                                            newLayout.background.url = url;
                                            newLayout.assets.large = val.name;
                                            newLayout.background.naturalHeight = -1;
                                            newLayout.background.naturalWidth = -1;
                                            args.setLayoutData(newLayout);
                                        }).catch(e => {
                                            console.error("Error while reading PDF!", e);
                                            args.showPopup(<><h1>Error</h1><p>Unable to read PDF!</p></>, () => { });
                                        });
                                    } else {
                                        newLayout.background.url = URL.createObjectURL(val);
                                        newLayout.assets.large = val.name;
                                        newLayout.background.naturalHeight = -1;
                                        newLayout.background.naturalWidth = -1;
                                        args.setLayoutData(newLayout);
                                    }
                                }} />
                            </> : <><ValueInput elementIndex={0} label="Resizable" value={args.layoutData.assets.resizable ? args.layoutData.assets.resizable : ""} onChange={(val: string) => {
                                const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                newLayout.assets.resizable = val;
                                args.setLayoutData(newLayout);
                            }} /><FileInput key="resizablefile" label="Choose Resizable Image" accept=".pdf" onChange={(val: File) => {
                                const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                if (val.name.toLocaleLowerCase().endsWith('.pdf')) {
                                    convertPdfToImage(val).then(url => {
                                        newLayout.background.url = url;
                                        newLayout.assets.resizable = val.name;
                                        newLayout.background.naturalHeight = -1;
                                        newLayout.background.naturalWidth = -1;
                                        args.setLayoutData(newLayout);
                                    }).catch(e => {
                                        console.error("Error while reading PDF!", e);
                                        args.showPopup(<><h1>Error</h1><p>Unable to read PDF!</p></>, () => { });
                                    });
                                } else {
                                    newLayout.background.url = URL.createObjectURL(val);
                                    newLayout.assets.resizable = val.name;
                                    newLayout.background.naturalHeight = -1;
                                    newLayout.background.naturalWidth = -1;
                                    args.setLayoutData(newLayout);
                                }
                            }} /></>}
                        <ValueInput elementIndex={0} type="number" label="Screen Width" value={String(Math.round(args.layoutData.canvas.width))} minValue={0} onChange={(val: string) => {
                            const res = parseInt(val);
                            if (!isNaN(res)) {
                                const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                newLayout.canvas.width = res;
                                if (args.layoutData.background.lockRatio && args.layoutData.background.naturalHeight > -1 && args.layoutData.background.naturalWidth > -1) {
                                    newLayout.canvas.height = res * (args.layoutData.background.naturalHeight / args.layoutData.background.naturalWidth);
                                }
                                args.setLayoutData(newLayout);
                            }
                        }} />
                        <ValueInput elementIndex={0} type="number" label="Screen Height" value={String(Math.round(args.layoutData.canvas.height))} minValue={0} onChange={(val: string) => {
                            const res = parseInt(val);
                            if (!isNaN(res)) {
                                const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                newLayout.canvas.height = res;
                                if (args.layoutData.background.lockRatio && args.layoutData.background.naturalHeight > -1 && args.layoutData.background.naturalWidth > -1) {
                                    newLayout.canvas.width = res * (args.layoutData.background.naturalWidth / args.layoutData.background.naturalHeight);
                                }
                                args.setLayoutData(newLayout);
                            }
                        }} />
                        <ValueInput elementIndex={0} type="number" label="Padding Top" value={String(Math.round(args.layoutData.padding.top))} minValue={0} onChange={(val: string) => {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            newLayout.padding.top = parseInt(val);
                            args.setLayoutData(newLayout);
                        }} />
                        <ValueInput elementIndex={0} type="number" label="Padding Bottom" value={String(Math.round(args.layoutData.padding.bottom))} minValue={0} onChange={(val: string) => {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            newLayout.padding.bottom = parseInt(val);
                            args.setLayoutData(newLayout);
                        }} />
                        <ValueInput elementIndex={0} type="number" label="Padding Left" value={String(Math.round(args.layoutData.padding.left))} minValue={0} onChange={(val: string) => {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            newLayout.padding.left = parseInt(val);
                            args.setLayoutData(newLayout);
                        }} />
                        <ValueInput elementIndex={0} type="number" label="Padding Right" value={String(Math.round(args.layoutData.padding.right))} minValue={0} onChange={(val: string) => {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            newLayout.padding.right = parseInt(val);
                            args.setLayoutData(newLayout);
                        }} />
                        <CheckboxInput label="Translucent" defaultValue={args.layoutData.translucent} onChange={(val: boolean) => {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            newLayout.padding.translucent = val;
                            args.setLayoutData(newLayout);
                        }} />
                        <CheckboxInput label="Lock Background Ratio" defaultValue={args.layoutData.background.lockRatio} onChange={(val: boolean) => {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            newLayout.background.lockRatio = val;
                            if (val && args.layoutData.background.naturalHeight > -1 && args.layoutData.background.naturalWidth > -1) {
                                newLayout.canvas.height = Math.round(args.layoutData.canvas.width * (args.layoutData.background.naturalHeight / args.layoutData.background.naturalWidth));
                            }
                            args.setLayoutData(newLayout);
                        }} />
                        <Button onClick={() => {
                            if (args.layoutData.background.naturalHeight > -1 && args.layoutData.background.naturalWidth > -1) {
                                const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                                newLayout.canvas.width = args.layoutData.background.naturalWidth;
                                newLayout.canvas.height = args.layoutData.background.naturalHeight;
                                args.setLayoutData(newLayout);
                            }
                        }} label="Resize to Background" />
                    </>)
                }
            </div>
        </div>
    );
}
