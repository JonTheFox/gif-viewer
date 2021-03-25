import {
	//RecoilRoot,
	atom,
	//selector,
	//useRecoilState,
	//useRecoilValue,
} from "recoil";

const CategoryState = atom({
	key: "CategoryState",
	default: { name: "" },
});

export default CategoryState;
