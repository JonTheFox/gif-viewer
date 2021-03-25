//* Safely log messages to the console only in DEVELOPMENT mode
// * If needed, log while in production, too
// logg.js -->> L.O. double G., the real OG of logging, meng
// ===================================
// Features:
// * Keeps the original line reference!
// * Supports printing a complimentary label to the data
// * Alternatively, pass in "this" to use the name of the component as the label!
// * Logg errors as well
// * Built-in style presets
// * Zero dependencies, itsy-bitsy in size 8-)

// Usage
// ----------
// // const {logg, loggError} = new Logger({label:"homepage"});
//logg(data);

//or:

/// const {logg, loggError} = new Logger({context:this});
//logg(data);{}

const isString = arg => {
	if (!arg && arg !== "") return false;
	return typeof arg === "string" || arg instanceof String;
};
const isObject = arg => typeof arg === "object" && arg !== null;

const styles = {
	red: "background-color: red; font-size: 150%; padding: 2px;",
	purple: "color: #9575cd;", //default
	blue: "color: #4dd0e1;",
	orange: "background-color: ##e0e0e0; color: orange",
	silver: "color: #A5FF7FFF; background-color: #80808080",
	success:
		"background-color: rgb(153, 204, 255); color: white; font-size: 125%;",
	error: "background: red; color: white; font-size: 125%;",
	error2: "background: darkgray; color: red; font-size: 125%;",
	warning: "background: yellow; color: white; font-size: 125%;",
	special: "background-color: rgb(204, 153, 255); font-size: 125%;"
};

const isDevelopmentMode = process.env.NODE_ENV === "development";

const LoggFactory = (preface = "", styles = "", logInProduction = false) => {
	if (isDevelopmentMode || logInProduction) {
		return console.log.bind(null, preface, styles);
	}
	//do nothing (without causing errors :) )
	return () => null;
};

class Logger {
	label = "";
	context;
	preface;
	stylePreset;
	constructor(config = {}) {
		const {
			label = "",
			context,
			stylePreset,
			logInProduction = false
		} = config;
		if (label && isString(label)) {
			const spacedoutLabel = ` ${label} `;
			this.label = spacedoutLabel;
			this.preface = "%c" + spacedoutLabel;
		} else if (context && isObject(context)) {
			this.context = context.__proto__.constructor.name;
			this.preface = "%c" + this.context;
		} else {
			this.preface = "_";
		}
		this.stylePreset =
			stylePreset && isString(stylePreset) && styles[stylePreset]
				? stylePreset
				: "purple";

		this.logg = LoggFactory(
			this.preface,
			styles[this.stylePreset],
			logInProduction
		);
		this.loggError = LoggFactory(
			this.preface,
			styles.error,
			logInProduction
		);
		this.loggWarning = LoggFactory(
			this.preface,
			styles.warning,
			logInProduction
		);
	}
}

export default Logger;
