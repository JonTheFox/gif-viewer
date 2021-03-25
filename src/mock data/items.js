class Item {
	id;
	name;
	label;
	priceUSD;
	img;
	constructor(config = {}) {
		Object.assign(this, config);
	}
}

const items = [
	new Item({
		id: 1,
		name: "playstation5",
		label: "PlayStation 5",
		priceUSD: 900,
		img: {
			regular:
				"https://files.geektime.co.il/wp-content/uploads/2020/09/102430787_10158776490626803_1286147483946841738_o-1591913054-1600693385-e1600694408267.jpg",
		},
		category: "videoGameConsoles",
	}),
	new Item({
		id: 2,
		name: "playstation4",
		label: "PlayStation 4",
		priceUSD: 900,
		img: {
			regular: "https://img.zap.co.il/0/0/3/2/42662300c.gif",
		},
		category: "videoGameConsoles",
	}),
	new Item({
		id: 3,
		name: "playstation3",
		label: "PlayStation 3",
		priceUSD: 900,
		img: {
			regular: "https://www.movegame.co.il/uploads/images/big25964.jpg",
		},
		category: "videoGameConsoles",
	}),
	new Item({
		id: 4,
		name: "playstation2",
		label: "PlayStation 2",
		priceUSD: 900,
		img: {
			regular:
				"https://upload.wikimedia.org/wikipedia/commons/5/58/PS2-Fat-Console-Set.png",
		},
		category: "videoGameConsoles",
	}),
	new Item({
		id: 5,
		name: "playstationOne",
		label: "PlayStation One",
		priceUSD: 900,
		img: {
			regular:
				"https://images-na.ssl-images-amazon.com/images/I/414xcV8%2BenL._SX342_.jpg",
		},
		category: "videoGameConsoles",
	}),
	new Item({
		id: 6,
		name: "segaSaturn",
		label: "Sega Saturn",
		priceUSD: 900,
		img: {
			regular:
				"https://upload.wikimedia.org/wikipedia/commons/a/a8/Sega-Saturn-Console-Set-Mk1.jpg",
		},
		category: "videoGameConsoles",
	}),
	new Item({
		id: 7,
		name: "pencil",
		label: "Pencil",
		priceUSD: 900,
		img: {
			regular:
				"https://images.unsplash.com/photo-1608737957742-d0b674e60ab9?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMTI2M3wwfDF8c2VhcmNofDd8fHBlbmNpbHxlbnwwfDB8fHwxNjE1OTk0MTU2&ixlib=rb-1.2.1&q=85",
		},
		category: "stationary",
	}),
];

export default items;
