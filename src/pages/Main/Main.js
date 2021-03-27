import React from "react";

import SearchBar from "../../components/SearchBar/SearchBar.js";
import GifPlayer from "../../components/GifPlayer/GifPlayer.js";

const MainPage = (props) => {
	return (
		<div className="main--page" style={{ overflow: "auto" }}>
			<SearchBar />
			<GifPlayer />
		</div>
	);
};

export default MainPage;
