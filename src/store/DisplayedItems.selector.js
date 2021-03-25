import { selector } from "recoil";
import ItemsState from "./ItemsState.js";
import CategoryState from "./CategoryState.js";
import SearchState from "./SearchState.js";

const DisplayedItemsState = selector({
	key: "DisplayedItemsState",
	default: [],
	get: ({ get }) => {
		const allItems = get(ItemsState);
		const category = get(CategoryState);
		const searchTerm = get(SearchState);

		const categoryItems = allItems?.filter((item, i) => {
			return (
				category?.name === "all" ||
				category?.label === "All" ||
				item?.category === category?.name
			);
		});

		const relevantItems = categoryItems?.filter((item) => {
			return item.name
				?.toLowerCase?.()
				.includes(searchTerm?.toLowerCase());
		});

		return relevantItems;
	},
});

export default DisplayedItemsState;
