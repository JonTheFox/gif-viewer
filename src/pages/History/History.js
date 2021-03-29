import React, { useEffect, useContext } from "react";
import SearchHistoryState from "../../store/SearchHistoryState.js";
import PageState from "../../store/PageState.js";
import SearchState from "../../store/SearchState.js";
import { AppContext } from "../../store/AppContext.js";
import { useRecoilState, useSetRecoilState } from "recoil";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useHistory } from "react-router-dom";

import localStorageKeys from "../../constants/localstorageKeys.js";

const History = (props) => {
	const [searchHistory, setSearchHistory] = useRecoilState(
		SearchHistoryState
	);
	const [appUtils] = useContext(AppContext);
	const { navigateTo } = appUtils;
	const setPage = useSetRecoilState(PageState);
	const setSearchQuery = useSetRecoilState(SearchState);
	const history = useHistory();

	useEffect(() => {
		//update the search history in the browser's local storage
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
						<ListItem
							button
							key={query}
							onClick={() => {
								setPage(1);
								setSearchQuery(query);
								navigateTo("/main", history);
							}}
						>
							<ListItemText primary={query} key={query} />
						</ListItem>
					);
				})}
			</List>
		</div>
	);
};

export default History;
