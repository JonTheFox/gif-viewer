import firebase from "firebase/app";
import "firebase/storage";

const config = {
	//apiKey: "super secret keys.....asgvegxgevergfvr",
	//authDomain: "tallans-imageupload-tutorial.firebaseapp.com",
	measurementId: "super secret as;dlkfjal;dskjf",

	databaseURL: "gs://weiss-class.appspot.com/",
	storageBucket: "gs://weiss-class.appspot.com/",

	messagingSenderId: "165508430741",
	appId: "1:165508430741:web:23c00812a4ed477ef9d49c",
	projectId: "weiss-server-a0b22",
	serverKey:
		"AAAAJokSO5U:APA91bGxgVt3UETv3R3wtoOyWsfyHuV-PDxadN9yUw-ubieBoi6l-DDQhXB7y-qOKqR3Fm6HePt1AUokMOoWdiwrTF3pzaUezqEFAKEky1645pKHpx9KwyCLLRJq2W-9shanMWizzFAu",
	senderId: "165508430741",
};
firebase.initializeApp(config);
// firebase.analytics();

const storage = firebase.storage();

export { storage, firebase as default };
