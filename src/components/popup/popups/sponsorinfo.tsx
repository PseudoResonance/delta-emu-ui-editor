"use client";
import * as CONSTANT from "@/utils/constants";

export default function SponsorInfo() {
	return (
		<>
			<h2>Sponsor the development of {CONSTANT.NAME}</h2>

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
