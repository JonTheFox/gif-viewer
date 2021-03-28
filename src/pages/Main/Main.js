import React from "react";

import SearchBar from "../../components/SearchBar/SearchBar.js";
import GifGrid from "../../components/GifGrid/GifGrid.js";

const MainPage = (props) => {
	return (
		<div className="main--page" style={{ overflow: "auto" }}>
			<SearchBar />
			<GifGrid />
		</div>
	);
};

export default MainPage;
