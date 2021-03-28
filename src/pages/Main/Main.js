import React from "react";

import SearchBar from "../../components/SearchBar/SearchBar.js";
import GifManager from "../../components/GifManager/GifManager.js";

const MainPage = (props) => {
	return (
		<div className="main--page" style={{ overflow: "auto" }}>
			<SearchBar />
			<GifManager />
		</div>
	);
};

export default MainPage;
