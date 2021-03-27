const capitalizeFirstLetter = (str = "", config = {}) => {
	if (!str) return null;
	const firstLetter = str[0].toUpperCase();
	const rest = str.slice(1);
	const finalRest = config.lowerCaseRest ? rest : rest.toLowerCase();
	return firstLetter + finalRest;
};

export default capitalizeFirstLetter;
