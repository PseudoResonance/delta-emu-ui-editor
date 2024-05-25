"use client";
import * as CONSTANT from "@/utils/constants";

export default function SponsorInfo() {
	return (
		<>
			<h2>Sponsor {CONSTANT.NAME}</h2>
			<p>
				Please considering sponsoring this project's development if it
				was helpful to you!
			</p>
			<p>
				{CONSTANT.SPONSOR_URLS.map((val, i, arr) => (
					<>
						<a
							href={val.url}
							key={i}
							rel="noreferrer noopener"
							target="_blank"
						>
							{val.name}
						</a>
						{i + 1 < arr.length && <br key={`br${i}`} />}
					</>
				))}
			</p>
		</>
	);
}
