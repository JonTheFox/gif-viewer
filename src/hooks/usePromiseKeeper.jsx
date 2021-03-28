import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../contexts/AppContext.jsx";

const usePromiseKeeper = (config = {}) => {
	// e.g. : config: {label: "componentlabel"}
	const [appUtils, appState, setAppState] = useContext(AppContext);
	const { PromiseKeeper } = appUtils;
	const [promiseKeeper] = useState(new PromiseKeeper(config));

	return promiseKeeper; //this gets return from the call to usePromiseKeeper(config)
};

export default usePromiseKeeper;
