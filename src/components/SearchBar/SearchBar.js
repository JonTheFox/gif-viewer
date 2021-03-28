import React, { useCallback, useRef } from "react";

import SearchState from "../../store/SearchState.js";

import { useSetRecoilState } from "recoil";

import TextField from "@material-ui/core/TextField";
import Form from "../Form/Form.js";

const SearchBar = (props) => {
	const setSearchTerm = useSetRecoilState(SearchState);
	const refs = useRef({ inputText: {} });

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
			setSearchTerm(inputText);
		},
		[setSearchTerm]
	); //pass an array of dependencies (you can pass an empty array)

	return (
		<div className="search">
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
