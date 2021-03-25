import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./DraggableBall.module.scss";

import posed from "react-pose";
const DRAGGABLE_POSE = {
	draggable: true,
	dragEnd: {
		x: 0,
		y: 0, //spring back to original position
		transition: {
			type: "spring",
			mass: 2,
		},
	},

	// enter: {
	// 	opacity: 1,
	// 	transition: {
	// 		duration: 2000,
	// 	},
	// },
	pressable: true,
	enter: {
		scale: 1,
		opacity: 1,
		transition: {
			duration: 700,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 700,
		},
	},
	visible: { scale: 1, opacity: 1 },

	press: {
		scale: 1.5,
	},
	pressEnd: {
		scale: 1,
	},
};

let animationFrame;
const label = "DraggableBall";

const Draggable = posed.div(DRAGGABLE_POSE);

const DraggableBall = React.forwardRef((props, ref) => {
	const { className, children } = props;

	return (
		<div
			className={clsx(styles.root, label, className && className)}
			ref={ref}
		>
			<Draggable className={styles.draggable}>{children}</Draggable>
		</div>
	);
});

DraggableBall.propTypes = {
	className: PropTypes.string,
};

export default DraggableBall;
