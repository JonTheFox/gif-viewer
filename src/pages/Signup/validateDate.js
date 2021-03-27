const isDate = (d) => {
	return (
		Object.prototype.toString.call(d) === "[object Date]" &&
		!isNaN(d.getTime())
	);
};

const validateDate = (d) => {
	if (!d) return null;
	if (!isDate(d)) {
		const date = new Date(d);
		return date instanceof Date;
	}
	if (isDate(d) && isNaN(d)) {
		return false;
	}
};

/*
// an alternative regex (probably not as good)
const validateDate = function(email) {
	var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regex.test(email);
};
*/
export default validateDate;
