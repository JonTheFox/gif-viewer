import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

const appConsoleUrl =
	"https://console.firebase.google.com/project/gif-viewer-342c6/settings/general/";
const projectName = "gif-viewer";
const projectId = "gif-viewer-342c6";
const projecNumber = 337851134251;
const webApiKey = "AIzaSyC0hKxuyoXqo45pY7F8VFRAJNZZBbTZS2w";
const publicFacingName = "gif viewer";

const firebaseConfig = {
	apiKey: webApiKey,
	projectId,
	measurementId: "super secret as;dlkfjal;dskjf",
	databaseURL: "gs://weiss-class.appspot.com/",
	storageBucket: "gs://weiss-class.appspot.com/",
	messagingSenderId: "165508430741",
	appId: "1:165508430741:web:23c00812a4ed477ef9d49c",
	serverKey:
		"AAAAJokSO5U:APA91bGxgVt3UETv3R3wtoOyWsfyHuV-PDxadN9yUw-ubieBoi6l-DDQhXB7y-qOKqR3Fm6HePt1AUokMOoWdiwrTF3pzaUezqEFAKEky1645pKHpx9KwyCLLRJq2W-9shanMWizzFAu",
	senderId: "165508430741",
};

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const storage = firebase.storage();
export { storage, firebase as default };
