import React, { useContext, useRef, useCallback, useEffect } from "react";
import { DeviceContext } from "../../store/DeviceContext.js";
import ItemsState from "../../store/ItemsState.js";
import SearchState from "../../store/SearchState.js";
import "./GifManager.scss";
import GifPlayer from "react-gif-player";
import { useRecoilState, useRecoilValue } from "recoil";
import MOCK_ITEMS from "../../mock data/gifs.js";

import Grid from "@material-ui/core/Grid";

const GifManager = (props) => {
  const { device, sizeUnits } = useContext(DeviceContext);
  const refs = useRef({ query: "" });

  const [items, setItems] = useRecoilState(ItemsState);
  const searchQuery = useRecoilValue(SearchState);

  // const handleSubmit = useCallback((ev, props) => {}, []);

  useEffect(() => {
    //for debugging only
    setItems(MOCK_ITEMS);
  }, []);

  useEffect(() => {
    //to do: make an API call to search gifs
    //then setItems
  }, [searchQuery]);

  useEffect(() => {
    //to do: make an API call to search gifs
    //then setItems
  }, [searchQuery]);

  let numColumns;
  switch (device) {
    case "phone":
      numColumns = 1;
      break;
    case "tablet":
      numColumns = 2;
      break;
    case "largeScreen":
      numColumns = 3;
      break;
    case "xlScreen":
      numColumns = 4;
      break;
    default:
      //If none of the above is the case..
      break;
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {" "}
        {items?.map((gif, i) => {
          return (
            <Grid item xs>
              <GifPlayer gif={gif} key={gif + i} />
            </Grid>
          );
          return;
        })}
      </Grid>
    </React.Fragment>
  );
};

export default GifManager;
