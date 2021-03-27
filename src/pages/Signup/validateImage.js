const imageRequirements = "Accepted image extensions are: .jpeg, .jpg and .png";
const validateImage = function checkURL(img) {
	debugger;
	return img.match(/\.(jpeg|jpg|png)$/) != null;
};

/*
// an alternative regex (probably not as good)
const validateDate = function(email) {
	var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regex.test(email);
};
*/
export default validateImage;
