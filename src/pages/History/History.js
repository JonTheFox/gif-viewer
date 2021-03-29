import React, { useEffect } from "react";
import SearchHistoryState from "../../store/SearchHistoryState.js";
import { useRecoilState } from "recoil";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import localStorageKeys from "../../constants/localstorageKeys.js";

const History = (props) => {
	const [searchHistory, setSearchHistory] = useRecoilState(
		SearchHistoryState
	);

	useEffect(() => {
		window.localStorage.setItem(
			localStorageKeys.searchHistory,
			JSON.stringify(searchHistory)
		);
	}, [searchHistory]);

	return (
		<div className="history--page" style={{ overflow: "auto" }}>
			<h1 style={{ fontSize: "1.5rem", paddingLeft: "var(--spacing)" }}>
				Recent searches
			</h1>

			<List component="nav" aria-label="history search terms">
				{searchHistory?.map((query, i) => {
					return (
						<ListItem button>
							<ListItemText primary={query} key={query} />
						</ListItem>
					);
				})}
			</List>
		</div>
	);
};

export default History;
