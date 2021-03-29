import { atom } from "recoil";

const USER_LOCALSTORAGE_KEY = "gif_viewer__user";

const getUserFromLocalStorage = () => {
	const rawString = window.localStorage.getItem(USER_LOCALSTORAGE_KEY);
	const user = JSON.parse(rawString);
	debugger;
	return user;
};

// const setUserInLocalStorage = (user) => {
// 	window.localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
// };

const UserState = atom({
	key: "UserState",
	default: getUserFromLocalStorage(),
});

export default UserState;
