"use client";
import * as CONSTANT from "@/data/constants";

export default function SponsorInfo() {
	return (
		<>
			<h2>Sponsor {CONSTANT.NAME}</h2>
			<p>
				Please considering sponsoring this project's development if it
				was helpful to you!
			</p>
			<div>
				{CONSTANT.SPONSOR_URLS.map((val, i, arr) => (
					<p key={i}>
						<a
							href={val.url}
							rel="noreferrer noopener"
							target="_blank"
						>
							{val.name}
						</a>
						{i + 1 < arr.length && <br />}
					</p>
				))}
			</div>
		</>
	);
}
