import React, { useCallback, useRef, useEffect } from "react";
import SearchState from "../../store/SearchState.js";
import SearchHistoryState from "../../store/SearchHistoryState.js";
import { useSetRecoilState, useRecoilState } from "recoil";
import TextField from "@material-ui/core/TextField";

const SearchBar = (props) => {
	const setSearchQuery = useSetRecoilState(SearchState);
	const [searchHistory, setSearchHistory] = useRecoilState(
		SearchHistoryState
	);
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

	const handleSubmit = useCallback(
		(ev) => {
			ev.preventDefault();
			const inputText = refs.current.inputText;
			const { searchHistory } = refs.current;
			const lowerCaseHistory = searchHistory?.map((item) => {
				return item?.trim()?.toLowerCase();
			});

			if (!searchHistory?.includes(inputText?.trim()?.toLowerCase())) {
				//new unique search term. Add it to the history state
				setSearchHistory((prev) => {
					const res = [inputText, ...prev];
					return res;
				});
			}
			setSearchQuery(inputText);
		},
		[setSearchQuery]
	);

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
