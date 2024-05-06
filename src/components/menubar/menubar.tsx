"use client";
import styles from "./menu.module.css";
import MenuCategory from "./menucategory";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import MenuButton from "./menubutton";
import convertPdfToImage from "@/utils/pdf/pdfToImg";

export default function MenuBar(args: {
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
    setXOffset: Dispatch<SetStateAction<number>>;
    setYOffset: Dispatch<SetStateAction<number>>;
    setScale: Dispatch<SetStateAction<number>>;
    saveJSON: () => Record<string, any>;
    parseJSON: (json: Record<string, any>) => void;
    canUndo: boolean;
    undo: () => void;
    canRedo: boolean;
    redo: () => void;
    showPopup: (popup: React.JSX.Element, onClose: () => void, onAccept?: () => void) => void;
    showContextMenu: (data: {
        label: string,
        onClick: () => void,
    }[], x: number, y: number) => void;
}) {
    const [isActive, setIsActive] = useState<boolean>(false);
    return (
        <div className={`${styles.menubar}${isActive ? ' ' + styles.active : ''}`}>
            <MenuCategory isActive={isActive} setIsActive={setIsActive} label="File" subElements={[
                <MenuButton key={"savejson"} label="Save JSON" onClick={() => {
                    setIsActive(false);
                    const exportObj = args.saveJSON();
                    const elem = document.createElement("a");
                    const file = new Blob([JSON.stringify(exportObj)], {type: 'application/json'});
                    elem.href = URL.createObjectURL(file);
                    elem.download = "info.json";
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                }}/>,
                <MenuButton key={"loadjson"} label="Load JSON" onClick={() => {
                    setIsActive(false);
                    const elem = document.createElement("input");
                    elem.type = "file";
                    elem.accept = "application/json";
                    elem.style.display = "none";
                    elem.onchange = (((e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files.length > 0) {
                            e.target.files[0].text().then((val: string) => {
                                try {
                                    const readJson = JSON.parse(val);
                                    args.parseJSON(readJson);
                                } catch (e) {
                                    console.error("Error parsing imported JSON!", e);
                                    args.showPopup(<><h1>Error</h1><p>Unable to parse JSON!</p></>, () => {});
                                }
                            });
                        }
                    }) as unknown) as (this: GlobalEventHandlers, ev: Event) => any;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                }}/>
            ]} />
            <MenuCategory isActive={isActive} setIsActive={setIsActive} label="Edit" subElements={[
                <MenuButton key={"undo"} label="Undo" onClick={() => {
                    args.undo();
                }}/>,
                <MenuButton key={"redo"} label="Redo" onClick={() => {
                    args.redo();
                }}/>
            ]} />
            <MenuCategory isActive={isActive} setIsActive={setIsActive} label="Canvas" subElements={[
                <MenuButton key={"returncenter"} label="Return to Center" onClick={() => { args.setXOffset(0); args.setYOffset(0) }}/>,
                <MenuButton key={"resetzoom"} label="Reset Zoom" onClick={() => { args.setScale(1) }}/>,
                <MenuButton key={"setbackground"} label="Set Background" onClick={() => {
                    setIsActive(false);
                    const elem = document.createElement("input");
                    elem.type = "file";
                    elem.accept = "image/*,.pdf";
                    elem.style.display = "none";
                    elem.onchange = (((e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files.length > 0) {
                            const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                            if (e.target.files[0].name.toLocaleLowerCase().endsWith('.pdf')) {
                                convertPdfToImage(e.target.files[0]).then(url => {
                                    newLayout.background.url = url;
                                    newLayout.background.naturalHeight = -1;
                                    newLayout.background.naturalWidth = -1;
                                    args.setLayoutData(newLayout);
                                }).catch(e => {
                                    console.error("Error while reading PDF!", e);
                                    args.showPopup(<><h1>Error</h1><p>Unable to read PDF!</p></>, () => {});
                                });
                            } else {
                                newLayout.background.url = URL.createObjectURL(e.target.files[0]);
                                newLayout.background.naturalHeight = -1;
                                newLayout.background.naturalWidth = -1;
                                args.setLayoutData(newLayout);
                            }
                        }
                    }) as unknown) as (this: GlobalEventHandlers, ev: Event) => any;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                }}/>,
                <MenuButton key={"unsetbackground"} label="Unset Background" onClick={() => {
                    const newLayout = JSON.parse(JSON.stringify(args.layoutData));
                    newLayout.background.url = "";
                    newLayout.background.naturalHeight = -1;
                    newLayout.background.naturalWidth = -1;
                    args.setLayoutData(newLayout);
                }}/>,
            ]} />
            <MenuCategory isActive={isActive} setIsActive={setIsActive} label="Help" subElements={[
                <MenuButton key={"about"} label="About" onClick={() => { args.showPopup(<><h2>About Delta Emulator UI Designer</h2><p>By <a href="https://github.com/PseudoResonance/" target="_blank" rel="noreferrer noopener">PseudoResonance</a></p></>, () => {}) }}/>,
            ]} />
        </div>
    );
}
