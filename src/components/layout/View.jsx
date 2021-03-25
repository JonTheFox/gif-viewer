import React from "react";
import PropTypes from "prop-types";
import posed, { PoseGroup } from "react-pose";
import POSES from "../../constants/poses.js";
import clsx from "clsx";
import "./_View.scss";

let numRenders = 0;

const View = React.forwardRef((props, ref) => {
	numRenders++;
	const viewId = "view" + numRenders;

	const {
		children,
		responsive = false,
		animate,
		animateChildren = false,
		className = "",
		transition = "view",
		flex = false,
		fullsize = true,
		id = "",
		positionRelative = false,
		margin = "",
		style = {},
	} = props;

	const containerClasses = clsx(
		responsive ? "view--responsive" : "view",
		!responsive && fullsize && "fullsize",
		animate && "transition-target",
		animateChildren && "transition-container",
		flex && "flex",
		className && className,
		positionRelative && "position--relative",
		margin && `margin--auto`
	);

	if (animate || animateChildren) {
		const containerPoses = transition
			? POSES[transition]
			: responsive
			? POSES.view_main
			: POSES.view; //default transition animation
		const PosedContainer = posed.div(containerPoses);
		const PosedContainerWithProps = (
			<PosedContainer
				initialPose="init"
				ref={ref}
				{...props}
				className={containerClasses}
				animateOnMount={true}
				key={viewId}
			>
				{children}
			</PosedContainer>
		);

		if (!animateChildren) {
			return PosedContainerWithProps;
		}
		return <PoseGroup>{PosedContainerWithProps}</PoseGroup>;
	}

	//no animation at all
	return (
		<div ref={ref} id={id} className={containerClasses} style={style || {}}>
			{children}
		</div>
	);
});

View.propTypes = {
	children: PropTypes.any,
	animateChildren: PropTypes.bool,
	fullsize: PropTypes.bool,
	flex: PropTypes.bool,
	className: PropTypes.string,
	transition: PropTypes.string,
};

export default View;
