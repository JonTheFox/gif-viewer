import PageState from "./PageState.js";
import ItemsState from "./ItemsState.js";

import { selector } from "recoil";

const DisplayedItems = selector({
	key: "DisplayedItems",
	default: [],
	get: ({ get }) => {
		const page = get(PageState) || 1;
		const items = get(ItemsState) || [];

		// const displayedItems = Math.round(items.length / 10) * page;
		const displayedItems = items.slice(page * 10, page * 10 + 10);

		return displayedItems;
	},
});

export default DisplayedItems;
