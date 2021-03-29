import React, {
	useCallback,
	useState,
	useContext,
	useRef,
	useEffect,
} from "react";
import { AppContext } from "../../store/AppContext.js";
import ItemsState from "../../store/ItemsState.js";
import SearchState from "../../store/SearchState.js";
import PageState from "../../store/PageState.js";
import useLogg from "../../lib/logg.js";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import GifGrid from "../../components/GifGrid/GifGrid.js";
import Pagination from "@material-ui/lab/Pagination";
import "./Main.scss";
import { GIPHY_ENDPOINTS, GIPHY_API_KEY } from "./giphy.js";
import { useRecoilValue, useRecoilState } from "recoil";

const MainPage = (props) => {
	const [page, setPage] = useRecoilState(PageState);
	const refs = useRef({});
	// const { logg, loggError } = useLogg({ label: "MainPage" });

	const [items, setItems] = useRecoilState(ItemsState);
	const searchQuery = useRecoilValue(SearchState);

	const [appUtils] = useContext(AppContext);
	const { request } = appUtils;

	const fetchGifs = useCallback(async (ev, _page) => {
		const result = await request("GET", GIPHY_ENDPOINTS.search, {
			q: refs.current.searchQuery,
			api_key: GIPHY_API_KEY,
			limit: 10,
			offset: refs.current.page,
		});

		const { error, data } = result;

		if (error) {
			// return loggError(error);
		}
		if (data) {
			//remove unnecessary data
			const leanItems = data?.map((originalItem, i) => {
				const { id, images } = originalItem;
				const {
					downsized_small,
					downsized_medium,
					downsized_large,
					original,
				} = images;
				return {
					id,
					downsized_small,
					downsized_medium,
					downsized_large,
					original,
				};
			});
			setItems(leanItems);
			return leanItems;
		}
	}, []);

	useEffect(() => {
		refs.current.searchQuery = searchQuery;
		if (searchQuery) {
			fetchGifs();
		}
	}, [searchQuery, fetchGifs]);

	useEffect(() => {
		refs.current.page = page;
		if (searchQuery) {
			fetchGifs();
		}
	}, [page]);

	const handlePageChange = useCallback(
		(ev, _page) => {
			setPage(_page);
		},
		[setPage]
	);

	return (
		<div className="main--page" style={{ overflow: "auto" }}>
			<div
				style={{
					position: "sticky",
					top: 0,
					left: 0,
					background: "white",
					padding: "var(--spacing)",
				}}
			>
				<SearchBar />
				<Pagination
					className={"pagination"}
					count={10}
					page={page}
					onChange={handlePageChange}
				/>
			</div>

			<GifGrid />
		</div>
	);
};

export default MainPage;
