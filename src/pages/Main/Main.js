import React, { useCallback, useState } from "react";

import SearchBar from "../../components/SearchBar/SearchBar.js";
import GifGrid from "../../components/GifGrid/GifGrid.js";
import Pagination from "@material-ui/lab/Pagination";

const MainPage = (props) => {
	const [page, setPage] = useState(0);
	const handlePageChange = useCallback((ev, _page) => {
		setPage(_page);
	}, []);

	return (
		<div className="main--page" style={{ overflow: "auto" }}>
			<div
				style={{
					position: "sticky",
					top: 0,
					left: 0,
					background: "white",
					padding: "var(--spacing)",
				}}
			>
				<SearchBar />
				<Pagination
					className={"pagination"}
					count={10}
					page={page}
					onChange={handlePageChange}
				/>
			</div>

			<GifGrid />
		</div>
	);
};

export default MainPage;
