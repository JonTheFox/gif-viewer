import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const paletteTheme = {
	primary: { main: "#f72d2d" }, // red
	secondary: { main: "rgb(224, 224, 224)" }, //gray
	canvasColor: "rgb(250, 250, 250)", // silver
	//canvasColor: "rgba(255, 255, 255, 0.87)" //white
};

const theme = createMuiTheme({
	palette: paletteTheme,
	spacing: 8,
	typography: {
		fontFamily: ["Helvetica"].join(","),
		htmlFontSize: 14,
	},
	layout: {
		appbarHeightXs: 40,
		appbarHeightSm: 48,
		appbarHeightMd: 56,
		appbarHeightLg: 64,
		drawerWidth: 210,
		promptHeight: 50,
	},
});

export default theme;
