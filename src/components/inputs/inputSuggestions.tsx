"use client";

export default function Suggestions(args: { id: string; values: string[] }) {
	return (
		<datalist id={args.id}>
			{args.values.map((val: string) => (
				<option value={val}></option>
			))}
		</datalist>
	);
}
