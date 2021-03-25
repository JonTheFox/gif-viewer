import React, { useRef, useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import CategoryState from "../../store/CategoryState.js";

import { useSetRecoilState } from "recoil";
import CATEGORIES from "../../mock data/categories.js";

const useStyles = makeStyles((theme) => ({
	autoComplete: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		//backgroundColor: fade(theme.palette.primary.main, 0.15),
		// "&:hover": {
		// 	backgroundColor: fade(theme.palette.primary.main, 0.25),
		// },
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(1),
			width: "100% !important",
		},
		//padding: theme.spacing(1, 1, 1, 1),
		transition: theme.transitions.create("width"),
		width: "100%",
		padding: 0,

		[theme.breakpoints.up("sm")]: {
			width: 200,
			"&:focus": {
				width: 800,
			},
		},
		margin: "auto",
	},
	searchIcon: {
		width: theme.spacing(7),

		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}));

const CategoriesSelect = (props) => {
	const setCategory = useSetRecoilState(CategoryState);
	const categories = [{ label: "All" }, ...CATEGORIES];

	const styles = useStyles(makeStyles);

	return (
		<div className="categories-select">
			<Autocomplete
				className={styles.autoComplete}
				options={categories || []}
				groupBy={(option) => option?.firstLetter}
				getOptionLabel={(option) => option?.label ?? "No label"}
				//style={{ width: 300 }}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Select a category"
						variant="outlined"
					/>
				)}
				onChange={(_, selectedItem, __) => {
					setCategory(selectedItem);
				}}
			/>
		</div>
	);
};

export default CategoriesSelect;
