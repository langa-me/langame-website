import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreDoc, useSigninCheck } from "reactfire";
import CenteredCircularProgress from "./CenteredCircularProgress";
import * as Sentry from "@sentry/react";

const CheckAuthentication = ({ children }: React.PropsWithChildren<any>) => {
    const navigate = useNavigate();
    const auth = useAuth();
    const {data: sign} = useSigninCheck();
    const firestore = useFirestore();
    const usersCollection = collection(firestore, "users");
    const userDoc = doc(usersCollection, auth.currentUser?.uid || "%");
    const { status } = useFirestoreDoc(userDoc);
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence);
        Sentry.setUser({
            id: auth.currentUser?.uid || "undefined",
            email: auth.currentUser?.email || "undefined",
            username: auth.currentUser?.displayName || "undefined",
        });
    }, [auth]);
    useEffect(() => {
        if (sign && !sign.signedIn) {
            navigate("/signin");
        }
    }, [navigate, sign, sign?.signedIn]);
    if (!children) {
        throw new Error("Children must be provided");
    }

    // signed in but no firestore user, load
    if (sign?.signedIn && status === "loading") {
        return <CenteredCircularProgress />;
    }
    if (sign?.signedIn && children) {
        return children as JSX.Element;
    }
    return <></>;
};
CheckAuthentication.displayName = "CheckAuthentication";
export default CheckAuthentication;