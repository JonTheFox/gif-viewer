const removeDoubleSlashes = (path = "") => {
	const result = path.replace(/\/\//gi, "/");
	return result;
};

const navaigateTo = (path, history = []) => {
	if (!path || !history || history.length === 0) return null;
	const completePath = removeDoubleSlashes(path);
	history.push({
		pathname: completePath,
		//state: { linkedScreen: completePath }
	});
};

export default navaigateTo;
