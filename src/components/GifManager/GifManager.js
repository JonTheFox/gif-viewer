import React, { useContext, useRef, useCallback, useEffect } from "react";
import { AppContext } from "../../store/AppContext.js";
import { DeviceContext } from "../../store/DeviceContext.js";
import ItemsState from "../../store/ItemsState.js";
import SearchState from "../../store/SearchState.js";
import "./GifManager.scss";
import GifPlayer from "react-gif-player";
import { useRecoilState, useRecoilValue } from "recoil";
import MOCK_ITEMS from "../../mock data/gifs.js";
import GIPHY_SEARCH_ENPOINTS from "./giphyEndpoints";
import Grid from "@material-ui/core/Grid";
import useLogg from "../../hooks/useLogg.jsx";

const GIPHY_API_KEY = "VnJMxXakNWjXkk26CsXNto4pyWbQAVV2";
const OFFSET = 0;

const GifManager = (props) => {
  const [appUtils] = useContext(AppContext);
  const { device } = useContext(DeviceContext);
  const { logg, loggError } = useLogg({ label: "GifManager" });
  const { request } = appUtils;
  const [items, setItems] = useRecoilState(ItemsState);
  const searchQuery = useRecoilValue(SearchState);

  // const handleSubmit = useCallback((ev, props) => {}, []);

  useEffect(() => {
    //for debugging only
    setItems(MOCK_ITEMS);
    //api.giphy.com/v1/gifs/search
  }, []);

  useEffect(() => {
    //to do: make an API call to search gifs
    //then setItems
    //

    request("GET", GIPHY_SEARCH_ENPOINTS.search, {
      q: searchQuery,
      api_key: GIPHY_API_KEY,
      limit: 10,
      offset: OFFSET,
    }).then((result) => {
      const { error, data } = result;
      if (error) {
        //debugger;
        loggError(error);
      }
      if (data) {
        //todo: replace this with items.map => lean object
        const leanItems = items;
        setItems(leanItems);
      }
      logg("data: ", data);
    });
  }, [searchQuery, items, logg, loggError]);

  useEffect(() => {
    //to do: make an API call to search gifs
    //then setItems
  }, [searchQuery]);

  return (
    <Grid container spacing={3} className={"gif-grid"}>
      {items?.map((gif, i) => {
        const { id, images } = gif;
        const {
          downsized_small,
          downsized_medium,
          downsized_large,
          original,
        } = images;

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
          <Grid item xs>
            <GifPlayer gif={gifUrl} key={id} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default GifManager;
