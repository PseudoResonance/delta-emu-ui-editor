"use client";
import styles from "./sidebar.module.css";
import treestyles from "./tree.module.css";
import React, { Dispatch, SetStateAction } from "react";
import TreeElement from "./treeelement";
import ValueInput from "../inputs/valueinput";
import CheckboxInput from "../inputs/checkboxinput";

export default function Sidebar(args: {
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
    removeElement: (key: number) => void;
    editingElement: number;
    setEditingElement: Dispatch<SetStateAction<number>>;
    infoFile: {
        name: string,
        identifier: string,
        gameTypeIdentifier: string,
        debug: boolean,
        representations: Record<string, Record<string, Record<string, any>>>,
    };
    setInfoFile: Dispatch<SetStateAction<{
        name: string,
        identifier: string,
        gameTypeIdentifier: string,
        debug: boolean,
        representations: Record<string, Record<string, Record<string, any>>>,
    }>>;
    applyRepresentation: (key: string) => void;
    currentRepresentation: string;
    showPopup: (popup: React.JSX.Element, onClose: () => void, onAccept?: () => void) => void;
    showContextMenu: (data: {
        label: string,
        onClick: () => void,
    }[], x: number, y: number) => void;
    deleteNode: (key: string) => void;
    createNode: (key: string, isLayout: boolean) => void;
}) {
    const getChildren: ((e: Record<string, any>, keyStr: string, depth: number) => React.JSX.Element[]) = (e, keyStr, depth) => {
        if (e && !("elements" in e) && !("layout" in e)) {
            return Object.keys(e).sort().map((key: string, i: number) => <TreeElement className={`${keyStr}.${key}`.slice(1) === args.currentRepresentation ? treestyles.active : ''} depth={depth + 1} data={e[key]} key={i} keyStr={`${keyStr}.${key}`} label={key} getChildren={getChildren} onClick={(event) => {
                args.applyRepresentation(`${keyStr}.${key}`.slice(1));
            }} onContextMenu={(event) => {
                event.preventDefault();
                const menuElements = [];
                if (!("elements" in e[key]) && !("layout" in e[key])) {
                    const newData = ["", depth >= 1];
                    menuElements.push({
                        label: 'Add Node',
                        onClick: () => {
                            args.showPopup(<>
                                <h2>Create Node</h2>
                                <p>Add a node under &quot;{`${keyStr}.${key}`.slice(1)}&quot;</p>
                                <ValueInput elementIndex={0} label="Name" value="" onChange={(val: string) => {
                                    newData[0] = val;
                                }} />
                                <CheckboxInput label="Layout Node" defaultValue={depth >= 1} onChange={(val: boolean) => {
                                    newData[1] = val;
                                }} />
                            </>, () => { }, () => {
                                args.createNode(`${keyStr}.${key}.${newData[0]}`.slice(1), newData[1] as boolean);
                            });
                        },
                    });
                }
                args.showContextMenu([...menuElements,
                {
                    label: 'Delete',
                    onClick: () => {
                        args.showPopup(<><h2>Warning</h2><p>Confirm deleting &quot;{`${keyStr}.${key}`.slice(1)}&quot;</p></>, () => { }, () => {
                            args.deleteNode(`${keyStr}.${key}`.slice(1));
                        });
                    },
                }
                ], event.pageX, event.pageY);
            }} />)
        } else {
            return [];
        }
    };
    return (
        <div className={styles.sidebar}>
            <div>
                <ValueInput elementIndex={0} label="Name" value={args.infoFile.name ? args.infoFile.name : ""} onChange={(val: string) => {
                    const newInfoFile = Object.assign({}, args.infoFile);
                    newInfoFile.name = val;
                    args.setInfoFile(newInfoFile);
                }} />
                <ValueInput elementIndex={0} label="ID" value={args.infoFile.identifier ? args.infoFile.identifier : ""} onChange={(val: string) => {
                    const newInfoFile = Object.assign({}, args.infoFile);
                    newInfoFile.identifier = val;
                    args.setInfoFile(newInfoFile);
                }} />
                <ValueInput elementIndex={0} label="Game Type ID" value={args.infoFile.gameTypeIdentifier ? args.infoFile.gameTypeIdentifier : ""} onChange={(val: string) => {
                    const newInfoFile = Object.assign({}, args.infoFile);
                    newInfoFile.gameTypeIdentifier = val;
                    args.setInfoFile(newInfoFile);
                }} />
                <CheckboxInput label="Debug" defaultValue={args.infoFile.debug} onChange={(val: boolean) => {
                    const newInfoFile = Object.assign({}, args.infoFile);
                    newInfoFile.debug = val;
                    args.setInfoFile(newInfoFile);
                }} />
            </div>
            <hr />
            <div>
                <TreeElement label="representations" keyStr="" depth={0} data={args.infoFile.representations} getChildren={getChildren} onContextMenu={(event) => {
                    event.preventDefault();
                    const newData = ["", false];
                    args.showContextMenu([{
                        label: 'Add Node',
                        onClick: () => {
                            args.showPopup(<>
                                <h2>Create Node</h2>
                                <p>Add a node under &quot;Representations&quot;</p>
                                <ValueInput elementIndex={0} label="Name" value="" onChange={(val: string) => {
                                    newData[0] = val;
                                }} />
                                <CheckboxInput label="Layout Node" defaultValue={false} onChange={(val: boolean) => {
                                    newData[1] = val;
                                }} />
                            </>, () => { }, () => {
                                args.createNode(String(newData[0]), newData[1] as boolean);
                            });
                        },
                    }], event.pageX, event.pageY);
                }} />
            </div>
        </div>
    );
}
