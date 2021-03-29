import React from "react";
import SearchHistoryState from "../../store/SearchHistoryState.js";
import { useRecoilValue } from "recoil";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const History = (props) => {
	const searchHistory = useRecoilValue(SearchHistoryState);
	return (
		<div className="history--page" style={{ overflow: "auto" }}>
			<h1 style={{ fontSize: "1.5rem" }}>Recent searches</h1>

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
