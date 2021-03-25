const widthSizes = {
	xs: 0,
	sm: 500,
	md: 960,
	lg: 1280,
	xl: 1920,
	fourK: 3700,
};

const createMediaQueryString = ({
	minWidth = "",
	maxWidth = "",
	orientation = "",
}) => {
	const minRule = !minWidth ? "" : `(min-width: ${widthSizes[minWidth]}px)`; //add one to prevent adjacent queries from both matching
	const maxRule = !maxWidth ? "" : `(max-width: ${widthSizes[maxWidth]}px)`;
	const sizeRules = minRule + (maxRule ? " and " + maxRule : "");
	if (!orientation) return sizeRules;
	const withOrienation =
		(sizeRules ? `${sizeRules} and ` : "") +
		`(orientation: ${orientation})`;
	return withOrienation;
};

const phone = {
	portrait: createMediaQueryString({
		minWidth: "xs",
		maxWidth: "sm",
		orientation: "portrait",
	}),
	landscape: createMediaQueryString({
		minWidth: "sm",
		maxWidth: "md",
		orientation: "landscape",
	}),
};
// phone.any = phone.portrait || phone.landscape;

const tablet = {
	portrait: createMediaQueryString({
		minWidth: "sm",
		maxWidth: "md",
		orientation: "portrait",
	}),
	landscape: createMediaQueryString({
		minWidth: "md",
		maxWidth: "lg",
		orientation: "landscape",
	}),
};
// tablet.any = tablet.portrait || tablet.landscape;

const largeScreen = createMediaQueryString({
	minWidth: "lg",
});
const xlScreen = createMediaQueryString({
	minWidth: "xl",
});
const fourK = createMediaQueryString({
	minWidth: "fourK",
});

const orientation = {
	portrait: createMediaQueryString({
		orientation: "portrait",
	}),
	landscape: createMediaQueryString({
		orientation: "landscape",
	}),
};
// orientation.type = orientation.portrait ? "portrait" : "landscape";
//to test if orientation is landscape, you can import only orientation.portrait, and test if it's falsey

const mediaQueries = {
	phone,
	tablet,
	largeScreen,
	xlScreen,
	orientation,
};

export default mediaQueries;
