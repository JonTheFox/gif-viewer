import countries from "./countryList.js";

const validateCountry = (countryName) => {
	if (!countryName || !countries || !countries.length) {
		return null;
	}
	return countries.includes(countryName);
};

export default validateCountry;
