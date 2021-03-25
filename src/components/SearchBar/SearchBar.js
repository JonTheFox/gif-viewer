import React, { useCallback, useRef } from "react";

import SearchState from "../../store/SearchState.js";

import { useSetRecoilState } from "recoil";

import TextField from "@material-ui/core/TextField";

const SearchBar = (props) => {
	const setSearchTerm = useSetRecoilState(SearchState);
	// const refs = useRef({ displayedItems: [] });
	const handleOnChange = useCallback(
		(ev) => {
			const searchTerm = ev.target.value;

			setSearchTerm(searchTerm);
		},
		[setSearchTerm]
	);

	return (
		<div className="search-bar">
			<TextField
				className="search"
				label="Search items..."
				type="search"
				onChange={handleOnChange}
			/>
		</div>
	);
};

export default SearchBar;
