import { initializeApp } from "firebase/app";
import { getMessaging, getToken ,onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCX76Zg-i9UjjQ5TO-cXkiyhMI8BLnTZ4M",
  authDomain: "e---commerce-4487e.firebaseapp.com",
  projectId: "e---commerce-4487e",
  storageBucket: "e---commerce-4487e.appspot.com",
  messagingSenderId: "784514136985",
  appId: "1:784514136985:web:f4d88cf92aca284e08f108",
  measurementId: "G-GBGXQXJJHM"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: `BOmIQHZZMwef6a-60TCCjYopSFqKRBFrjtRn9-gPvVjdf6HND1rHFTDQY09pnERpj2O-WikTkuJCh897cX5kNEg`,
    });
  }
};
export const requestPermission = () => {

  console.log("Requesting User Permission......");
  Notification.requestPermission().then((permission) => {

    if (permission === "granted") {

      console.log("Notification User Permission Granted.");
      return getToken(messaging, { vapidKey: `BOmIQHZZMwef6a-60TCCjYopSFqKRBFrjtRn9-gPvVjdf6HND1rHFTDQY09pnERpj2O-WikTkuJCh897cX5kNEg` })
        .then((currentToken) => {

          if (currentToken) {

            console.log('Client Token: ', currentToken);
          } else {

            console.log('Failed to generate the app registration token.');
          }
        })
        .catch((err) => {

          console.log('An error occurred when requesting to receive the token.', err);
        });
    } else {

      console.log("User Permission Denied.");
    }
  });

}


export const onMessageListener = () =>
new Promise((resolve) => {
  onMessage(messaging, (payload) => {
    console.log("payload", payload)
    resolve(payload);
  });
});