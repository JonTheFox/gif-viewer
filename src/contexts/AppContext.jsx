import React, { useState, useEffect } from "react";
import posed, { PoseGroup } from "react-pose";
import SplitText from "react-pose-text";
import { tween } from "popmotion";
import pose from "popmotion-pose";
import { interpolate } from "flubber";
import DURATIONS from "../constants/durations.js";
import POSES from "../constants/poses.js";
import THEME from "../constants/theme.js";
import MEDIA_QUERIES from "../constants/mediaQueries.js";

import {
    shimme,
    PromiseKeeper,
    navigateTo,
    loadImage,
    getRandomColor,
    getRandomUpTo,
    capitalizeFirstLetter,
    capitalizeTitle,
    getUniqueString,
    forAll,
    handlePress,
    removePressHandlers,
    getFormattedTime,
    alignElements,
    request,
    is,
    isNot,
    our,
    climbFrom,
    scrollTo,
    emptyFunc,
    localStorage,
    shuffle,
    pickRandomFrom,
    setDomProperty,
    copyToClipboard,
} from "../lib/issy";
import Logger from "../lib/logg.js";

const { logg, loggError } = new Logger({ label: "AppContext" });

//polyfill
shimme("requestAnimationFrame");

const DEBUGGING = process.env.NODE_ENV === "development";

const UTILS = {
    is,
    isNot,
    our,
    PromiseKeeper,
    DURATIONS,
    POSES,
    MEDIA_QUERIES,
    THEME,
    navigateTo,
    loadImage,
    capitalizeFirstLetter,
    capitalizeTitle,
    getFormattedTime,
    getRandomColor,
    getRandomUpTo,
    alignElements,
    getUniqueString,
    forAll,
    handlePress,
    removePressHandlers,
    Logger,
    posed,
    pose,
    PoseGroup,
    SplitText,
    tween,
    interpolate,
    request,
    climbFrom,
    scrollTo,
    emptyFunc,
    EMPTY_FUNC: emptyFunc,
    DEBUGGING,
    localStorage,
    shuffle,
    pickRandomFrom,
    //getDomProperty,
    setDomProperty,
    copyToClipboard,
};

// const initialAppState = {
//  user:
// };

const DEFAULTS = {
    getOptionsLabel(option) {
        return option.title || option.name || option.v1;
    },
    onSearchOptionChange(option) {
        logg("Searchable option selected: ", option);
    },
    groupBy: (option) => option.groupName,
};

// const initialUser = DEBUGGING ? { role: "admin" } : {};
const initialUser = null;

//create a Context object.
//Note: There's no need for inital value and setter for the context, as these will be set to the state and state setter in just a moment.
const AppContext = React.createContext({
    user: {},
    setUser: () => {},
    setSearchables: (config = {}) => {
        debugger;
        return config;
    },
});

const label = "AppContextProvider";
const localStorageKey = "weiss-english-client";

const getUserFromLocalStorage = () => {
    const user = localStorage.getObj(localStorageKey);
    if (user) {
        const { first_name, last_name, email } = user;
        const userSansPassword = { first_name, last_name, email };
        logg("User from LocalStorage: ", userSansPassword);
    } else {
        logg("No user saved in LocalStorage.");
    }
    return user;
};

class Searchables {
    selected;
    options;
    getOptionsLabel;
    onChange;
    constructor(config = {}) {
        const {
            selected,
            options,
            getOptionsLabel,
            onChange,
            groupBy,
        } = config;
        this.selected = selected || null;
        this.options = options || [];
        this.getOptionsLabel = getOptionsLabel || DEFAULTS.getOptionsLabel;
        this.onChange = onChange || DEFAULTS.onSearchOptionChange;
        this.groupBy = groupBy || DEFAULTS.groupBy;
    }
}

//Give the ContextProvider some state, so that we can provide *dynamic* context (i.e. context that can be set/mutated during runtime)
const AppContextProvider = (props) => {
    const [appUtils] = useState(UTILS);
    const { Logger } = appUtils;
    const logg = new Logger({ label }).logg;

    const [appState, setAppState] = useState({
        user: initialUser,
        setUser: (user) => {},
        realtime: {},
        localStorageKey,
        isFirstVisit: true,
        setSearchables: (searchables) => {},
        searchables: new Searchables(),
    });

    const setUser = (user, remember) => {
        //pass null to logout

        if (user === null) {
            localStorage.setObj(localStorageKey, null);
            logg("User was deleted from localStorage");
        }
        if (user && remember) {
            localStorage.setObj(localStorageKey, user);
            getUserFromLocalStorage(); // for logging purposes only
        }
        setAppState({ ...appState, user });
    };
    appState.setUser = setUser;

    const setSearchables = (config = {}) => {
        // const newState = { ...appState };
        const searchables = new Searchables(config);

        setAppState({ ...appState, searchables });
    };
    appState.setSearchables = setSearchables;

    useEffect(() => {
        //deferred props

        if (appState.user) {
            const { first_name, last_name, email, role } = appState.user;
            appState.userSansPassword = { first_name, last_name, email };
        } else {
            appState.userSansPassword = null;
        }

        logg("appState updated: ", appState);
    }, [appState]);

    useEffect(() => {
        const user = getUserFromLocalStorage();

        appState.setUser(user);
    }, []);

    return (
        <AppContext.Provider value={[appUtils, appState, setAppState]}>
            {props.children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };

/* consume the state in a nested compoenent, like so:

At the top of the nested component file, import the context: 

    import { AppContext } from "../contexts/AppContext";

Them, inside the function component:

    const [state, setState] = useContext(AppContext);

*/
