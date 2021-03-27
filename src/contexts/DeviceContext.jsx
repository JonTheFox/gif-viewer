import React, { useEffect, useContext, useCallback, useState } from "react";
import { useTheme } from "@material-ui/styles";
//import useMediaQuery from "@material-ui/core/useMediaQuery";
//import MEDIA_QUERIES from "../constants/mediaQueries.js";
import SCREEN_SIZES from "../constants/screenSizes.js";
import { AppContext } from "./AppContext.jsx";

const initialScreenData = { phone: { portrait: true } };

const label = "DeviceContext";
let logg;
let loggError;

const isInFullScreen = () => {
	return Boolean(
		(!window.screenTop && !window.screenY) ||
			document.isFullScreen ||
			document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document.mozFullScreenElement ||
			document.msFullscreenElement
	);
};

const setAppbarHeight = (cssValueString = "") => {
	document.documentElement.style.setProperty(
		"--appbar-height",
		cssValueString
	);
};

const setAppbarSize = (ev) => {
	const appbar = document.querySelector(".appbar-container");
	debugger;
	if (!appbar) {
		loggError(
			`Did not find the appbar element, so can't toggle its opacity when entering/exiting fullscreen mode`
		);
		return null;
	}
};

const isPhoneOrTablet = () => {
	let indeedMobile = false;
	(function(a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
				a.substr(0, 4)
			)
		)
			indeedMobile = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return indeedMobile;
};
const isMobile = isPhoneOrTablet();

//max size units in portrait-only mode
let vw_max__portrait;
let vw_max__portraitPx;
let vh_max__portrait;
let vh_max__portraitPx;
let vh_max__portrait___minus_appbar;
let vh_max__portrait___minus_appbarPx;

//max size units in landscape-only mode
let vw_max__landscape;
let vw_max__landscapePx;
let vh_max__landscape;
let vh_max__landscapePx;
let vh_max__landscape___minus_appbar;
let vh_max__landscape___minus_appbarPx;

const getDecimalString = (num, withPx = true) => {
	//with 2 digits after the decimal point
	return (num * 0.01).toString().slice(0, 6);
};
const addPxSuffix = (str) => str + "px";

/*Important: this Context should be consumed only by components that do not mind re-render on orientation change or screen resizing (which may cause orientation change, at least insofar as orientation detection goes).
 */

//create a Context object.
//Note: There's no need for inital value and setter for the context, as these will be set to the state and state setter in just a moment.
const DeviceContext = React.createContext([{}, () => {}]);

//wrap the context in a stateful component, so that we can provide *dynamic* context (i.e. data and functionality that can be changed during application runtime)
const DeviceContextProvider = (props) => {
	const [appUtils] = useContext(AppContext);
	const { Logger } = appUtils;
	if (!logg || !loggError) {
		const logger = new Logger({ label });
		logg = logger.logg;
		loggError = logger.loggError;
	}
	const theme = useTheme();
	const [responsiveData, setResponsiveData] = useState(initialScreenData);

	const setDimensionVars = useCallback(
		(ev, setMaxValues = false) => {
			//current dimensions
			const { innerHeight: height, innerWidth: width } = window;

			const screen = {};

			//check orientation
			const orientation = height > width ? "portrait" : "landscape";

			//check screen type, e.g. : PHONE, TABLET, LARGE_SCREEN, XL_SCREEN
			let screenType;
			for (let [_screenType, screenOrientations] of Object.entries(
				SCREEN_SIZES
			)) {
				screen[_screenType] = screen[_screenType] || {};
				if (!screenType) {
					const dimensions = screenOrientations[orientation]; //e.g: phone.portrait or phone.landscape
					const { minWidth, maxWidth } = dimensions;

					if (width >= minWidth && width <= maxWidth) {
						screenType = _screenType;
						screen[_screenType][orientation] = true;
					}
				}
			}
			if (!screenType) {
				debugger;
			}
			screenType = screenType || "xl-screen";
			// screenType = screenType || "phone"; //mobile-first

			const { phone, tablet, largeScreen, xlScreen } = screen;

			//for more concise styling
			const size =
				screenType === "phone"
					? "small"
					: tablet.portrait
					? "medium"
					: "large";

			//there is no cross-browser mechanism to detect fullscreen :( (Chrome treats maximzed window as full screen, which is not good for us if we want to hide the appbar when in fullscreen mode)
			// let fullscreen = isInFullScreen();
			let fullscreen = false;

			const {
				//appbarHeightXs,
				appbarHeightSm,
				appbarHeightMd,
				appbarHeightLg,
				drawerWidth,
			} = theme.layout;

			const appbarHeight = fullscreen
				? 0
				: screenType === "phone"
				? appbarHeightSm
				: screenType === "tablet"
				? appbarHeightMd
				: screenType === "largeScreen" || screenType === "xlScreen"
				? appbarHeightMd
				: appbarHeightSm; //mobile-first design
			const appmenuWidth = drawerWidth;
			const isAppbarVisible = Boolean(appbarHeight);
			const appbarHeightValue = addPxSuffix(appbarHeight);
			const appbarWidthValue = addPxSuffix(appmenuWidth);
			// setAppbarHeight(appbarHeightValue);

			const docElemStyle = document.documentElement.style;
			docElemStyle.setProperty("--appbar-height", appbarHeightValue);
			docElemStyle.setProperty("--drawer-width", appbarWidthValue);

			const responsiveData = {
				isMobile,
				device: screenType,
				orientation,
				phone,
				tablet,
				largeScreen,
				xlScreen,
				appbarHeight,
				isAppbarVisible,
				size, //legacy
				screenSize: size,
				//fullscreen
			};

			const vh = getDecimalString(height);
			const vhPx = addPxSuffix(vh);
			const vw = getDecimalString(width);
			const vwPx = addPxSuffix(vw);

			//update current viewport height & width
			docElemStyle.setProperty("--vh", vhPx);
			docElemStyle.setProperty("--vw", vwPx);

			if (!setMaxValues) {
				//use the pre-existing max units along with the updated vh and mw
				responsiveData.sizeUnits = {
					//current units (0.01) of viewport width & height
					vw: vwPx,
					vh: vhPx,
					//the following will have the values that were already set (they are stored as a closure, above)
					//full viewport sizes for portrait-only
					vw_max__portrait: vw_max__portraitPx,
					vh_max__portrait: vh_max__portraitPx,
					vh_max__portrait___minus_appbar: vh_max__portrait___minus_appbarPx,
					//full viewport sizes for landscape-only
					vw_max__landscape: vw_max__landscapePx,
					vh_max__landscape: vh_max__landscapePx,
					vh_max__landscape___minus_appbar: vh_max__landscape___minus_appbarPx,
				};
				return setResponsiveData(responsiveData);
			}

			//on first render, set the initial height and width to serve as the MAXIMUM height and width (assuming that the screen size itself (not its inner viewport) never changes. (viewport height might change when the mobile keyboard opens up)
			const greaterLength = Math.max(height, width);
			// const greaterLengthDecimal = getDecimalString(greaterLength);
			const lesserLength = greaterLength === height ? width : height;
			// const lesserLengthDecimal = getDecimalString(lesserLength);

			// const greaterLengthPx = greaterLengthDecimal + "px";
			// const lesserLengthPx = lesserLengthDecimal + "px";

			//portrait-only mode
			//in portrait mode, the width is smaller than the height
			vw_max__portrait = lesserLength;
			vw_max__portraitPx = addPxSuffix(
				getDecimalString(vw_max__portrait)
			);
			docElemStyle.setProperty("--vw-max--portrait", vw_max__portraitPx);

			vh_max__portrait = greaterLength;
			vh_max__portraitPx = addPxSuffix(
				getDecimalString(vh_max__portrait)
			);
			docElemStyle.setProperty("--vh-max--portrait", vh_max__portraitPx);

			vh_max__portrait___minus_appbar = getDecimalString(
				greaterLength - appbarHeight
			);
			vh_max__portrait___minus_appbarPx = addPxSuffix(
				vh_max__portrait___minus_appbar
			);
			docElemStyle.setProperty(
				"--vh-max--portrait---minus-appbar",
				vh_max__portrait___minus_appbarPx
			);

			//landscape-only mode
			//In landscape mode, the width is larger than the height
			vw_max__landscape = greaterLength;
			vw_max__landscapePx = addPxSuffix(getDecimalString(greaterLength));
			docElemStyle.setProperty(
				"--vw-max--landscape",
				vw_max__landscapePx
			);

			vh_max__landscape = getDecimalString(lesserLength);
			vh_max__landscapePx = addPxSuffix(vh_max__landscape);
			docElemStyle.setProperty(
				"--vh-max--landscape",
				vh_max__landscapePx
			);
			vh_max__landscape___minus_appbar = getDecimalString(
				lesserLength - appbarHeight
			);
			vh_max__landscape___minus_appbarPx = addPxSuffix(
				vh_max__landscape___minus_appbar
			);
			docElemStyle.setProperty(
				"--vh-max--landscape---minus-appbar",
				vh_max__landscape___minus_appbarPx
			);

			// vh_max__landscape___minus_appbar = addPxSuffix(
			// 	getDecimalString(lesserLength - appbarHeight)
			// );
			// 	vh_max__landscape___minus_appbarPx = addPxSuffix(
			// 	vh_max__landscape___minus_appbar)
			// );

			responsiveData.sizeUnits = {
				//current units (0.01) of viewport width & height
				vw: vwPx,
				vh: vhPx,
				//the following will have the values that were already set (they are stored as a closure, above)
				//full viewport sizes for portrait-only
				vw_max__portrait: vw_max__portraitPx,
				vh_max__portrait: vh_max__portraitPx,
				vh_max__portrait___minus_appbar: vh_max__portrait___minus_appbarPx,
				//full viewport sizes for landscape-only
				vw_max__landscape: vw_max__landscapePx,
				vh_max__landscape: vh_max__landscapePx,
				vh_max__landscape___minus_appbar: vh_max__landscape___minus_appbarPx,
			};

			return setResponsiveData(responsiveData);
		},
		[theme.layout]
	);

	useEffect(() => {
		logg("Responsive data : ", responsiveData);
	}, [responsiveData]);

	useEffect(() => {
		//Just once, set initial viewport height and width to serve as the max values (for mobile devices, which unlike a desktop/laptop browser, have a fixed max screen height and width)
		setDimensionVars(null, "set max values");
		window.addEventListener("resize", setDimensionVars);

		// //listen for entering/exiting fullscreen mode. In fullscreen, hide the appbar
		document.addEventListener("mozfullscreenchange", setAppbarSize, false);
		document.addEventListener(
			"webkitfullscreenchange",
			setAppbarSize,
			false
		);
		document.addEventListener("fullscreenchange", setAppbarSize, false);
		// setAppbarSize();

		return () => {
			window.removeEventListener("resize", setDimensionVars, false);
		};
	}, []);

	return (
		<DeviceContext.Provider value={responsiveData}>
			{props.children}
		</DeviceContext.Provider>
	);
};

export { DeviceContext, DeviceContextProvider };

/* consume the state in a nested component, like so:

At the top of the nested component file, import the context: 

	import { AppContext } from "../contexts/AppContext";

Them, inside the function component:

	const responsiveData = useContext(DeviceContext);

*/
