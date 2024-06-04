"use client";

import ValueInput from "../inputs/valueinput";
import CheckboxInput from "../inputs/checkbox";
import { InfoFile, ShowContextMenuFunc, ShowPopupFunc } from "@/data/types";
import * as Tree from "../objectTree";
import InputGrid from "../inputGrid";

export default function RepresentationTreeWindow(args: {
	applyRepresentation: (key: string) => void;
	createNode: (key: string, isLayout: boolean) => void;
	currentRepresentation: string;
	deleteNode: (key: string) => void;
	infoFile: InfoFile;
	showContextMenu: ShowContextMenuFunc;
	showPopup: ShowPopupFunc;
}) {
	const getChildren: (
		e: Record<string, unknown>,
		keyStr: string,
		depth: number,
	) => React.JSX.Element[] = (e, keyStr, depth) => {
		if (e && !("elements" in e) && !("layout" in e)) {
			return Object.keys(e)
				.sort()
				.map((key: string, i: number) => (
					<Tree.Item
						data={e[key] as Record<string, unknown>}
						depth={depth + 1}
						getChildren={getChildren}
						key={i}
						keyStr={`${keyStr}.${key}`}
						label={key}
						onClick={() => {
							args.applyRepresentation(
								`${keyStr}.${key}`.slice(1),
							);
						}}
						onContextMenu={(event) => {
							event.preventDefault();
							const menuElements = [];
							if (
								!(
									"elements" in
									(e[key] as Record<string, unknown>)
								) &&
								!(
									"layout" in
									(e[key] as Record<string, unknown>)
								)
							) {
								const newData = ["", depth >= 1];
								menuElements.push({
									label: "Add Node",
									onClick: () => {
										args.showPopup(
											true,
											"Create Node",
											<>
												<p>
													Add a node under &quot;
													{`${keyStr}.${key}`.slice(
														1,
													)}
													&quot;
												</p>
												<InputGrid
													style={{
														gridTemplateColumns:
															"[start] 1fr [label] 1fr [end]",
													}}
												>
													<ValueInput
														context={"-1"}
														label="Name"
														onChange={(
															val: string,
														) => {
															newData[0] = val;
														}}
														style={{
															gridColumn:
																"start / end",
														}}
														value=""
													/>
													<CheckboxInput
														onChange={(
															val: boolean,
														) => {
															newData[1] = val;
														}}
														style={{
															gridColumn:
																"start / end",
														}}
														value={depth >= 1}
													>
														Layout Node
													</CheckboxInput>
												</InputGrid>
											</>,
											() => {},
											() => {
												if (
													(newData[0] as string)
														.length > 0
												) {
													args.createNode(
														`${keyStr}.${key}.${newData[0]}`.slice(
															1,
														),
														newData[1] as boolean,
													);
												}
											},
										);
									},
								});
							}
							args.showContextMenu(
								[
									...menuElements,
									{
										label: "Delete",
										onClick: () => {
											args.showPopup(
												true,
												"Warning",
												<p>
													Confirm deleting &quot;
													{`${keyStr}.${key}`.slice(
														1,
													)}
													&quot;
												</p>,
												() => {},
												() => {
													args.deleteNode(
														`${keyStr}.${key}`.slice(
															1,
														),
													);
												},
											);
										},
									},
								],
								event.pageX,
								event.pageY,
							);
						}}
						showActive={
							`${keyStr}.${key}`.slice(1) ===
							args.currentRepresentation
						}
					/>
				));
		} else {
			return [];
		}
	};
	return (
		<Tree.Wrapper
			ariaLabel={"Representation tree"}
			style={{ padding: "3px 5px" }}
		>
			<Tree.Item
				data={args.infoFile.representations}
				depth={0}
				getChildren={getChildren}
				keyStr=""
				label="representations"
				onContextMenu={(event) => {
					event.preventDefault();
					const newData = ["", false];
					args.showContextMenu(
						[
							{
								label: "Add Node",
								onClick: () => {
									args.showPopup(
										true,
										"Create Node",
										<>
											<p>
												Add a node under
												&quot;Representations&quot;
											</p>

											<InputGrid
												style={{
													gridTemplateColumns:
														"[start] 1fr [label] 1fr [end]",
												}}
											>
												<ValueInput
													context={"-1"}
													label="Name"
													onChange={(val: string) => {
														newData[0] = val;
													}}
													style={{
														gridColumn:
															"start / end",
													}}
													value=""
												/>

												<CheckboxInput
													onChange={(
														val: boolean,
													) => {
														newData[1] = val;
													}}
													style={{
														gridColumn:
															"start / end",
													}}
													value={false}
												>
													Layout Node
												</CheckboxInput>
											</InputGrid>
										</>,
										() => {},
										() => {
											if (
												(newData[0] as string).length >
												0
											) {
												args.createNode(
													String(newData[0]),
													newData[1] as boolean,
												);
											}
										},
									);
								},
							},
						],
						event.pageX,
						event.pageY,
					);
				}}
			/>
		</Tree.Wrapper>
	);
}
