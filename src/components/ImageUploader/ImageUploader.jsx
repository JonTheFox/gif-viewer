import React, { useEffect, useState, useCallback } from "react";
import ReactImageUploader from "react-images-upload";
import PropTypes from "prop-types";

const ImageUploader = ({ onChange, children, ...otherProps }) => {
	const [pictures, setPictures] = useState([]);

	const handleChange = useCallback(
		(files) => {
			const newImage = files.slice(-1)[0];
			setPictures((pictures) => [...pictures, newImage]);
			if (onChange) onChange(newImage, files);
		},
		[setPictures]
	);

	return (
		<ReactImageUploader
			withIcon={true}
			buttonText="Choose images"
			onChange={handleChange}
			imgExtension={[".jpg", ".gif", ".png", ".gif"]}
			maxFileSize={10242880}
			{...otherProps}
		/>
	);
};

ImageUploader.propTypes = {
	onChange: PropTypes.func,
};

export default ImageUploader;
