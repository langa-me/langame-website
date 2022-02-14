import { browserLocalPersistence, setPersistence } from "firebase/auth";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth, useSigninCheck } from "reactfire";
import CenteredCircularProgress from "./CenteredCircularProgress";

export const CheckAuthentication = ({ children }: React.PropsWithChildren<any>): JSX.Element => {
    const auth = useAuth();
    const sign = useSigninCheck();
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence);
      }, [auth]);
    if (!children) {
        throw new Error("Children must be provided");
    }
    if (sign.status === "loading") {
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