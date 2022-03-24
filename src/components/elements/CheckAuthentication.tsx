import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreDoc, useSigninCheck } from "reactfire";
import CenteredCircularProgress from "./CenteredCircularProgress";

const CheckAuthentication = ({ children }: React.PropsWithChildren<any>) => {
    const auth = useAuth();
    const sign = useSigninCheck();
    const firestore = useFirestore();
    const usersCollection = collection(firestore, "users");
    const userDoc = doc(usersCollection, auth.currentUser?.uid ||
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    const {status} = useFirestoreDoc(userDoc);
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence);
      }, [auth]);
    if (!children) {
        throw new Error("Children must be provided");
    }
    if (sign.status === "loading") {
        return <CenteredCircularProgress/>;
    }
    // signed in but no firestore user, load
    if (sign.data.signedIn && status === "loading") {
        return <CenteredCircularProgress/>;
    }
    if (sign.data.signedIn && children) {
        return children as JSX.Element;
    } else if (!sign.data.signedIn) {
        return <Redirect to="/signin" />;
    }
    return <Redirect to="/404" />
};
CheckAuthentication.displayName = "CheckAuthentication";
export default CheckAuthentication;