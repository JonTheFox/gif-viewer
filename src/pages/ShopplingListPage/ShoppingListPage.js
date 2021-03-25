import React, { useEffect } from "react";

import CategoriesSelect from "../../components/CategoriesSelect/CategoriesSelect.js";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import ItemsGrid from "../../components/ItemsGrid/ItemsGrid.js";
import List from "../../components/List/List.js";
import ItemsState from "../../store/ItemsState.js";
import CategoriesState from "../../store/ItemsState.js";
import ITEMS from "../../mock data/items.js";
import CATEGORIES from "../../mock data/categories.js";

import { useRecoilState } from "recoil";

const ShoppingListPage = (props) => {
	const [items, setItems] = useRecoilState(ItemsState);
	const [categories, setCategories] = useRecoilState(CategoriesState);

	useEffect(() => {
		//todo: fetch real data
		setItems(ITEMS);
		setCategories(CATEGORIES);
		debugger;
	}, [setItems, setCategories]);

	return (
		<div className="shopping-list--page">
			<CategoriesSelect items={items} categories={categories} />
			<SearchBar />
			<ItemsGrid items={items} />
			<List />
		</div>
	);
};

export default ShoppingListPage;
