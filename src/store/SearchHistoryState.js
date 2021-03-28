import { atom } from "recoil";
import searchTerms from "../mock data/searchTerms.js";

const SearchHistory = atom({
	key: "SearchHistory",
	default: searchTerms,
});

export default SearchHistory;
