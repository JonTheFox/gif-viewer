class Category {
	id;
	name;
	label;
	img;
	constructor(config = {}) {
		Object.assign(this, config);
	}
}

const categories = [
	new Category({
		id: 100,
		name: "videoGameConsoles",
		label: "Video game consoles",
		img: {
			regular:
				"https://files.geektime.co.il/wp-content/uploads/2020/09/102430787_10158776490626803_1286147483946841738_o-1591913054-1600693385-e1600694408267.jpg",
		},
	}),
	new Category({
		id: 101,
		name: "stationary",
		label: "Stationary",
		img: {
			regular:
				"https://images.unsplash.com/photo-1527597771870-8f1e06ff8d8c?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMTI2M3wwfDF8c2VhcmNofDZ8fHN0YXRpb25hcnl8ZW58MHwwfHx8MTYxNTk2NDc5MQ&ixlib=rb-1.2.1&q=85",
		},
	}),
];

export default categories;
