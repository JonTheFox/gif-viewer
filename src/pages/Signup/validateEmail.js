const validateEmail = (email) => {
	const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(String(email).toLowerCase());
};

/*
// an alternative regex (probably not as good)
const validateEmail = function(email) {
	var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regex.test(email);
};
*/
export default validateEmail;
