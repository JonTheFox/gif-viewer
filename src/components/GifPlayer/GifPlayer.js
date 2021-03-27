import React, { useState, useContext } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import {
  Gif,
  Grid, // our UI Component to display the results
  SearchBar, // the search bar the user will type into
  SearchContext, // the context that wraps and connects our components
  SearchContextManager, // the context manager, includes the Context.Provider
  // SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from "@giphy/react-components";

// import { useAsync } from "react-async-hook";
import ResizeObserver from "react-resize-observer";
import { DeviceContext } from "../../store/DeviceContext.js";

const GIPHY_API_KEY = "VnJMxXakNWjXkk26CsXNto4pyWbQAVV2";
const giphyFetch = new GiphyFetch(GIPHY_API_KEY);

// the search experience consists of the manager and its child components that use SearchContext
const SearchExperience = () => (
  <SearchContextManager apiKey={GIPHY_API_KEY}>
    <Components />
  </SearchContextManager>
);

// function GifDemo() {
//   const [gif, setGif] = (useState < IGif) | (null > null);
//   useAsync(async () => {
//     const { data } = await giphyFetch.gif("fpXxIjftmkk9y");
//     setGif(data);
//   }, []);
//   return gif && <Gif gif={gif} width={200} />;
// }

function GridDemo({ onGifClick }) {
  const fetchGifs = (offset: number) =>
    giphyFetch.trending({ offset, limit: 10 });
  const [width, setWidth] = useState(window.innerWidth);

  return (
    <React.Fragment>
      <Grid
        onGifClick={onGifClick}
        fetchGifs={fetchGifs}
        width={width}
        columns={3}
        gutter={6}
      />
      <ResizeObserver
        onResize={({ width }) => {
          setWidth(width);
        }}
      />
    </React.Fragment>
  );
}

// define the components in a separate function so we can
// use the context hook. You could also use the render props pattern
const Components = () => {
  const { fetchGifs, searchKey } = useContext(SearchContext);
  const { device, sizeUnits } = useContext(DeviceContext);

  let numColumns;
  //remove "px"
  let numPixels = sizeUnits?.vw?.slice(0, -2);
  const gridWidth = numPixels * 100;
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
      <SearchBar />

      <Grid
        key={searchKey}
        columns={numColumns}
        className={"margin--auto"}
        width={gridWidth}
        fetchGifs={fetchGifs}
        style={{ margin: "auto" }}
      />
    </React.Fragment>
  );
};

function App() {
  const [modalGif, setModalGif] = useState();
  return (
    <React.Fragment>
      <img src="./logo.gif" width="200" alt="Powered by GIPHY" />
      <GridDemo
        onGifClick={(gif, e) => {
          console.log("gif", gif);
          e.preventDefault();
          setModalGif(gif);
        }}
      />
      {modalGif && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, .8)",
          }}
          onClick={(e) => {
            e.preventDefault();
            setModalGif(undefined);
          }}
        >
          <Gif gif={modalGif} width={200} />
        </div>
      )}
    </React.Fragment>
  );
}

export default SearchExperience;
