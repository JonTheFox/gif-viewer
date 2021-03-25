import React, { useContext, Fragment, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
// import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import DisplayedItemsState from "../../store/DisplayedItems.selector.js";
import SelectedItemState from "../../store/SelectedItemState.js";
import CartState from "../../store/CartState.js";

import { useRecoilValue, useRecoilState } from "recoil";
import { DeviceContext } from "../../store/DeviceContext.js";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const useStyles = makeStyles({
	root: {
		maxWidth: 345,
	},
});

const ItemsGrid = ({ items = [] }) => {
	const displayedItems = useRecoilValue(DisplayedItemsState);
	const [selectedItem, setSelectedItem] = useRecoilState(SelectedItemState);
	const [cart, setCart] = useRecoilState(CartState);
	const classes = useStyles(makeStyles);
	const responsiveData = useContext(DeviceContext);
	const { device } = responsiveData;

	const handleItemClick = useCallback(
		(item) => {
			setSelectedItem(item);
		},
		[setSelectedItem]
	);

	let cols;
	switch (device) {
		case "phone":
			cols = 2;
			break;
		case "tablet":
			cols = 2;
			break;
		case "largeScreen":
			cols = 3;
			break;
		case "xlScreen":
			cols = 4;
			break;
		default:
			//If none of the above is the case..
			break;
	}

	const handleAddToCart = useCallback(
		(item) => {
			setCart((cart) => [...cart, item]);
		},
		[setCart]
	);

	return (
		<div className="items-grid" style={{ flexGrow: 1 }}>
			<GridList cellHeight={240} className={classes.gridList} cols={cols}>
				{displayedItems?.map((item) => {
					const {
						id,
						label,
						// name, description, priceUSD
					} = item;

					const imgUrl = item?.img?.regular;

					const isSelected = item === selectedItem;

					return (
						<GridListTile
							key={id}
							className={clsx(
								"item",
								isSelected &&
									"is-selected has-before show-before gradient"
							)}
							onClick={() => handleItemClick(item)}
						>
							<img src={imgUrl} alt={label} />
							<GridListTileBar
								className={clsx(classes.root, "item-card")}
								title={label}
								actionIcon={
									isSelected && (
										<IconButton
											aria-label={`Add to card ${label}`}
											className={clsx(
												"add-to-cart-btn",
												classes.icon
											)}
										>
											<ShoppingCartIcon
												onClick={() =>
													handleAddToCart(item)
												}
											/>
										</IconButton>
									)
								}
							/>
						</GridListTile>
					);
				})}
			</GridList>
		</div>
	);
};

export default ItemsGrid;
