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
	//databaseURL: "DATABASE_URL",
	authDomain: "AUTH_DOMAIN",
	// OPTIONAL
	storageBucket: "STORAGE_BUCKET",
	messagingSenderId: "MESSAGING_SENDER_ID",
};

export default firebaseConfig;
