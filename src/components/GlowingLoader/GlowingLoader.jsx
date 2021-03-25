import React from "react";
// import { AppContext } from "../../state/AppContext.js";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./GlowingLoader.module.scss";

import DraggableBall from "../DraggableBall/DraggableBall.jsx";

import posed from "react-pose";

const PosedOpacity = posed.div({
	enter: { opacity: 1, transition: { duration: 20000 } },
	exit: { opacity: 0, transition: { duration: 20000 } },
});

const GlowingLoader = React.forwardRef((props, ref) => {
	const { className, fullpage, ringBackground = true } = props;

	return (
		<PosedOpacity
			className={clsx(
				// label,
				fullpage && "page gradient--diagonal",
				fullpage && styles.fullpage,
				styles.root,
				className && className
			)}
			ref={ref}
		>
			<DraggableBall>
				<div
					className={clsx(
						styles.ring,
						ringBackground && "gradient--diagonal"
					)}
				>
					Loading
					<span></span>
				</div>
			</DraggableBall>
		</PosedOpacity>
	);
});

GlowingLoader.propTypes = {
	className: PropTypes.object,
	fullpage: PropTypes.bool,
};

export default GlowingLoader;
