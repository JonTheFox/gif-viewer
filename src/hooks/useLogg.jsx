import React from "react";
import Logger from "../lib/logg.js";

const useLogg = (config) => {
	const { logg, loggError } = new Logger(config);
	return { logg, loggError };
};

export default useLogg;
