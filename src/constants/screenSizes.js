const XS = 0;
const SM = 500;
const MD = 960;
const LG = 1280;
const XL = 1920;

const phone = {
	portrait: {
		minWidth: XS,
		maxWidth: SM
	},
	landscape: {
		minWidth: XS,
		maxWidth: MD
	}
};

const tablet = {
	portrait: {
		minWidth: SM + 1,
		maxWidth: MD
	},
	landscape: {
		minWidth: MD + 1,
		maxWidth: LG
	}
};

const largeScreen = {
	portrait: {
		minWidth: MD + 1,
		maxWidth: LG
	},
	landscape: {
		minWidth: LG + 1,
		maxWidth: XL
	}
};
const xlScreen = {
	portrait: {
		minWidth: LG + 1,
		maxWidth: Infinity
	},
	landscape: {
		minWidth: XL + 1,
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
