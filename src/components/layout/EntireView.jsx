import React, { useContext } from "react";
import PropTypes from "prop-types";
import { DeviceContext } from "../../store/DeviceContext";
import { AppContext } from "../../store/AppContext";

import clsx from "clsx";

let logg;
const label = "EntireView";

const EntireView = (props) => {
	const [UTILS] = useContext(AppContext);
	// const { isAppbarVisible } = appState;
	const responsiveData = useContext(DeviceContext);
	const { Logger, synthVoice, climbFrom } = UTILS;
	logg = logg || new Logger({ label }).logg;
	const { className = "", children } = props;

	const {
		isMobile,
		orientation,
		screenSize,
		isAppbarVisible,
	} = responsiveData;
	let { device } = responsiveData;
	device =
		device === "largeScreen"
			? "large-screen"
			: device === "xlScreen"
			? "xl-screen"
			: device;

	return (
		<div
			className={clsx(
				"max-vh--portrait fullscreen",
				isMobile ? "mobile" : "desktop-or-laptop",
				device && device,
				orientation,
				screenSize && `screen-size--${screenSize}`,
				// isMenuDrawerPermanent && "menu-drawer--is-permanent",
				className && className,
				`appbar--${isAppbarVisible ? "visible" : "hidden"}`
			)}
			onContextMenu={async (ev) => {
				//right click handler
				ev.preventDefault();
				const { target } = ev;
				if (!target) {
					return;
				}

				const readableElem = climbFrom(target).upTo({
					className: "readable",
					maxIterations: 6,
				});

				// const readableElem = climbFrom(target).upTo({
				// 	className: "readable",
				// 	maxIterations: 6,
				// });
				if (!readableElem) {
					ev.stopPropagation();
					return;
				}

				const text = readableElem.textContent;
				if (!text) {
					ev.stopPropagation();
					return;
				}

				await synthVoice.say(text);
				return;
			}}
		>
			{children}
		</div>
	);
};

EntireView.propTypes = {
	className: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};

export default EntireView;
