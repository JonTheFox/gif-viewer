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

const GIPHY_API_KEY = "VnJMxXakNWjXkk26CsXNto4pyWbQAVV2";

const GifManager = (props) => {
  const [appUtils] = useContext(AppContext);
  const { device } = useContext(DeviceContext);
  const refs = useRef({});
  const [page] = useState(0);
  const { logg, loggError } = useLogg({ label: "GifManager" });
  const { request } = appUtils;
  const [items, setItems] = useRecoilState(ItemsState);
  const searchQuery = useRecoilValue(SearchState);

  const fetchGifs = useCallback(async (ev, _page) => {
    const result = await request("GET", GIPHY_SEARCH_ENPOINTS.search, {
      q: refs.current.searchQuery,
      api_key: GIPHY_API_KEY,
      limit: 10,
      offset: refs.current.page,
    });

    const { error, data } = result;

    if (error) {
      return loggError(error);
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
    fetchGifs();
    refs.current.page = page;
  }, [page]);

  useEffect(() => {
    fetchGifs();
    refs.current.searchQuery = searchQuery;
  }, [searchQuery, fetchGifs]);

  if (!items || !items.length) {
    return <div className="no-gifs">No GIFs found. Try another search.</div>;
  }

  return (
    <div classsName="gif-grid--container">
      <Grid container spacing={3} className={"gif-grid"}>
        {items?.map((gif, i) => {
          const {
            id,
            downsized_small,
            downsized_medium,
            downsized_large,
            original,
          } = gif;

          let gifUrl;
          switch (device) {
            case "phone":
              gifUrl =
                downsized_small?.url ||
                downsized_medium?.url ||
                downsized_large?.url ||
                original;
              break;
            case "tablet":
              gifUrl =
                downsized_medium?.url ||
                downsized_large?.url ||
                original?.url ||
                downsized_small?.url;
              break;
            case "largeScreen":
              gifUrl =
                downsized_large?.url ||
                original?.url ||
                downsized_medium?.url ||
                downsized_small?.url ||
                original;
              break;
            case "xlScreen":
              gifUrl = original;
              gifUrl =
                original?.url ||
                downsized_large?.url ||
                downsized_medium?.url ||
                downsized_small?.url;
              break;
            default:
              gifUrl = downsized_large?.url;
              break;
          }

          return (
            <Grid item xs key={id}>
              <GifPlayer gif={gifUrl} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default GifManager;
