import { atom } from "recoil";
// import searchTerms from "../mock data/searchTerms.js";
import localStorageKeys from "../constants/localstorageKeys.js";

const getHistoryFromLocalStorage = () => {
	const rawString = window.localStorage.getItem(
		localStorageKeys.searchHistory
	);
	const searchHistory = JSON.parse(rawString);
	return searchHistory;
};

const SearchHistory = atom({
	key: "SearchHistory",
	default: getHistoryFromLocalStorage() || [],
});

export default SearchHistory;
