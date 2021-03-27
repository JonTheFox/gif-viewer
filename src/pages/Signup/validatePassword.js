/*const passwordRequirements =
	"Password must be at least 8 characters long and contain a lowercase letter, an uppercase letter and a digit.";*/

const validatePassword = (password) => {
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
	return regex.test(password);
};
export default validatePassword;
