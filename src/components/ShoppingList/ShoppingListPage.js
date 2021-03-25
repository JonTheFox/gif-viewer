import React, { useEffect, useCallback } from "react";

import CategoriesSelect from "../CategoriesSelect/CategoriesSelect.js";
import SearchBar from "../SearchBar/SearchBar.js";
import ItemsGrid from "../ItemsGrid/ItemsGrid.js";
import List from "../List/List.js";
import "./ShoppingListPage.scss";
import CategoryState from "../../store/CategoryState.js";
import ItemsState from "../../store/ItemsState.js";
import CATEGORIES from "../../mock data/categories.js";
import ITEMS from "../../mock data/items.js";
import { useSetRecoilState } from "recoil";

const ShoppingListPage = () => {
	const setCategory = useSetRecoilState(CategoryState);
	const setItems = useSetRecoilState(ItemsState);
	const fetchItems = useCallback(async () => {
		return ITEMS;
	}, []);

	const fetchCategories = useCallback(async () => {
		return CATEGORIES;
	}, []);

	useEffect(() => {
		//todo: replace these with real AJAX calls
		fetchItems().then((items) => {
			setItems(items);
		});
		fetchCategories().then((categories) => {
			setCategory({ name: "all", label: "All" });
		});
	}, [fetchItems, fetchCategories]);

	return (
		<div className="shopping-list--page gradient">
			<CategoriesSelect />
			<SearchBar />
			<ItemsGrid />
			<List />
		</div>
	);
};

export default ShoppingListPage;
