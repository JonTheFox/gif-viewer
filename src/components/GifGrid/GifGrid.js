import React, {
  useContext,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { AppContext } from "../../store/AppContext.js";
import { DeviceContext } from "../../store/DeviceContext.js";
import ItemsState from "../../store/ItemsState.js";
import SearchState from "../../store/SearchState.js";
import "./GifGrid.scss";
import GifPlayer from "react-gif-player";
import { useRecoilState, useRecoilValue } from "recoil";
import MOCK_ITEMS from "../../mock data/gifs.js";
import GIPHY_SEARCH_ENPOINTS from "./giphyEndpoints";
import Grid from "@material-ui/core/Grid";
import useLogg from "../../hooks/useLogg.jsx";
import Pagination from "@material-ui/lab/Pagination";

const GIPHY_API_KEY = "VnJMxXakNWjXkk26CsXNto4pyWbQAVV2";

const GifManager = (props) => {
  const [appUtils] = useContext(AppContext);
  const { device } = useContext(DeviceContext);
  const [page, setPage] = useState(0);
  const { logg, loggError } = useLogg({ label: "GifManager" });
  const { request } = appUtils;
  const [items, setItems] = useRecoilState(ItemsState);
  const searchQuery = useRecoilValue(SearchState);

  const mapItemToLeanObj = (originalItem, i) => {
    const { id, images } = originalItem;
    const {
      downsized_small,
      downsized_medium,
      downsized_large,
      original,
    } = images;
    return { id, downsized_small, downsized_medium, downsized_large, original };
  };

  const fetchGifs = useCallback(async (ev, _page) => {
    const result = await request("GET", GIPHY_SEARCH_ENPOINTS.search, {
      q: searchQuery,
      api_key: GIPHY_API_KEY,
      limit: 10,
      offset: page,
    });
    const { error, data } = result;

    //for debugging
    const leanItems = MOCK_ITEMS?.map(mapItemToLeanObj);
    setItems(leanItems);
    return;

    if (error) {
      loggError(error);
    }
    if (data) {
      const leanItems = data?.map(mapItemToLeanObj);
      setItems(leanItems);
    }
    logg("data: ", data);
  }, []);

  useEffect(() => {
    fetchGifs();
  }, [page]);

  useEffect(() => {
    fetchGifs();
  }, [searchQuery, fetchGifs]);

  const handlePageChange = useCallback((ev, _page) => {
    setPage(_page);
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={3} className={"gif-grid"}>
        {items?.map((gif, i) => {
          const {
            id,
            downsized_small,
            downsized_medium,
            downsized_large,
            original,
          } = gif;

          let gifObj;
          switch (device) {
            case "phone":
              gifObj =
                downsized_small ||
                downsized_medium ||
                downsized_large ||
                original;
              break;
            case "tablet":
              gifObj =
                downsized_medium ||
                downsized_large ||
                original ||
                downsized_small;
              break;
            case "largeScreen":
              gifObj =
                downsized_large ||
                original ||
                downsized_medium ||
                downsized_small ||
                original;
              break;
            case "xlScreen":
              gifObj = original;
              gifObj =
                original ||
                downsized_large ||
                downsized_medium ||
                downsized_small;
              break;
            default:
              gifObj = downsized_large;
              break;
          }

          const gifUrl = gifObj?.url;

          return (
            <Grid item xs key={id}>
              <GifPlayer gif={gifUrl} />
            </Grid>
          );
        })}
      </Grid>
      <Pagination
        className={"pagination"}
        count={10}
        page={page}
        onChange={handlePageChange}
      />
    </React.Fragment>
  );
};

export default GifManager;