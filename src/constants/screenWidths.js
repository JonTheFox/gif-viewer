// const XS = 0;
// const SM = 500;
// const MD = 960;
// const LG = 1280;
// const XL = 1920;

const screenSizes = {
	XS: 0,
	SM: 500,
	MD: 960,
	LG: 1280,
	XL: 1920
};

const getDeviceOfWidth = (width = 0) => {
	try {
		if (width.length) {
			// e.g. "4px"
			width = width.slice(0, -2);
		}
		width = parseInt(width);
		for (let [size, minWidth] of Object.entries(screenSizes)) {
		}
		// return px < SM ?
	} catch (err) {
		console.log(err.msg);
		return err;
	}
};

//check screen type, e.g. : PHONE, TABLET, LARGE_SCREEN, XL_SCREEN
let screenType;
for (let [_screenType, screenOrientations] of Object.entries(SCREEN_SIZES)) {
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
screenType = screenType || "xl-screen";

const phone = {
	minWidth: XS,
	maxWidth: SM
};

const tablet = {
	portrait: {
		minWidth: SM + 1,
		maxWidth: MD
	},
	landscape: {
		minWidth: MD,
		maxWidth: LG
	}
};

const largeScreen = {
	portrait: {
		minWidth: MD + 1,
		maxWidth: LG
	},
	landscape: {
		minWidth: LG,
		maxWidth: XL
	}
};
const xlScreen = {
	portrait: {
		minWidth: LG + 1,
		maxWidth: XL
	},
	landscape: {
		minWidth: XL,
		maxWidth: Infinity
	}
};

const screenSizes = {
	phone,
	tablet,
	largeScreen,
	xlScreen
};

export default screenSizes;
