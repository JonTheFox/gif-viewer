import React from "react";
import SearchHistoryState from "../../store/SearchHistoryState.js";
import { useRecoilValue } from "recoil";

const History = (props) => {
	const searchHistory = useRecoilValue(SearchHistoryState);
	return (
		<div className="history--page" style={{ overflow: "auto" }}>
			{searchHistory?.map((query, i) => {
				return <div key={query}>{query}</div>;
			})}
		</div>
	);
};

export default History;
