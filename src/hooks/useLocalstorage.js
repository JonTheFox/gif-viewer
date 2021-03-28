import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../store/AppContext.jsx";

const label = "useLocalstorage";
let logg;
let loggError;

const useLocalstorage = (cookieName = "") => {
  const [appUtils, appState, setAppState] = useContext(AppContext);
  const { issy, Logger, localStorage } = appUtils;
  const [storedValue, setStoredValue] = useState(
    cookieName ? localStorage.getObj(cookieName) : ""
  );

  useEffect(() => {
    const logger = new Logger({ label });
    logg = logger.logg;
    loggError = logger.loggError;
    if (!cookieName) return;
    localStorage.setObj(cookieName, storedValue);
    logg(`cookie "${cookieName}" = ${storedValue}`);
  }, [storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalstorage;
