import { atom } from "recoil";

const USER_LOCALSTORAGE_KEY = "gif_viewer__user";

const getUserFromLocalStorage = () => {
	const rawString = window.localStorage.getItem(USER_LOCALSTORAGE_KEY);
	const user = JSON.parse(rawString);
	return user;
};

const UserState = atom({
	key: "UserState",
	default: getUserFromLocalStorage(),
});

export default UserState;
