import { connectAuthEmulator, getAuth } from "@firebase/auth";
import {
    connectFirestoreEmulator,
    getFirestore,
} from "@firebase/firestore";
import { FirebaseApp, FirebaseOptions } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { isProd } from "./constants";


export const getFirebaseConfig = (): FirebaseOptions => {
    const firebaseConfig: FirebaseOptions = isProd ?
        {
            apiKey: "AIzaSyDxLmqscMfKF6FUd_rXcsJxH--w0PQhVWw",
            authDomain: "langame-86ac4.firebaseapp.com",
            projectId: "langame-86ac4",
            storageBucket: "langame-86ac4.appspot.com",
            messagingSenderId: "909899959016",
            appId: "1:909899959016:web:0d099874d327d901c0575d",
            measurementId: "G-2MMEHXG4LR"
        } : {
            apiKey: "AIzaSyBA_lBzVBjwkHx8X3PUl6Vz_sA__K8mCF0",
            authDomain: "langame-dev.firebaseapp.com",
            projectId: "langame-dev",
            storageBucket: "langame-dev.appspot.com",
            messagingSenderId: "388264600961",
            appId: "1:388264600961:web:1de4223ac5e7a3020cf480",
            measurementId: "G-MNLV4NH9PP"
        };
    console.log("Loaded", process.env.REACT_APP_ENVIRONMENT, "cloud services");
    return firebaseConfig;
};

export const initEmulator = (app: FirebaseApp): FirebaseApp => {
    console.log("using emulator");
    const auth = getAuth(app);
    const fs = getFirestore(app);
    const fn = getFunctions(app, "us-central1");
    connectAuthEmulator(auth, "http://0.0.0.0:9099", {
        disableWarnings: true,
    });
    connectFirestoreEmulator(fs, "0.0.0.0", 8080);
    connectFunctionsEmulator(fn, "0.0.0.0", 5001);
    return app;
}
