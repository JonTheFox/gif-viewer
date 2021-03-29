import React, { useCallback, useRef, useEffect } from "react";
import SearchState from "../../store/SearchState.js";
import SearchHistoryState from "../../store/SearchHistoryState.js";
import { useSetRecoilState, useRecoilValue } from "recoil";
import TextField from "@material-ui/core/TextField";

const SearchBar = (props) => {
	const setSearchQuery = useSetRecoilState(SearchState);
	const searchHistory = useRecoilValue(SearchHistoryState);
	const refs = useRef({ inputText: {}, searchHistory });

	useEffect(() => {
		refs.current.searchHistory = searchHistory;
	}, [searchHistory]);

	const handleOnChange = useCallback(
		(ev) => {
			const inputText = ev.target.value;
			refs.current.inputText = inputText;
		},
		[refs]
	);

	//will get populated by Form
	const handleSubmit = useCallback(
		(ev) => {
			ev.preventDefault();
			const inputText = refs.current.inputText;
			const { searchHistory } = refs.current;
			const lowerCaseHistory = searchHistory?.map((item) => {
				return item?.trim()?.toLowerCase();
			});
			if (searchHistory?.includes(inputText?.trim()?.toLowerCase())) {
				setSearchQuery(inputText);
			}
		},
		[setSearchQuery]
	); //pass an array of dependencies (you can pass an empty array)

	return (
		<div className="search" style={{ padding: "var(--spacing)" }}>
			<form onSubmit={handleSubmit}>
				<TextField
					className="search"
					label="Search GIF..."
					type="search"
					onChange={handleOnChange}
				/>
			</form>
		</div>
	);
};

export default SearchBar;
