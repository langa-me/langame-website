import { browserSessionPersistence, setPersistence } from "firebase/auth";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth, useSigninCheck } from "reactfire";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";
import { log } from "../../utils/logs";

export const CheckAuthentication = ({ children }: React.PropsWithChildren<any>): JSX.Element => {
    const auth = useAuth();
    const sign = useSigninCheck();
    useEffect(() => {
        setPersistence(auth, browserSessionPersistence);
      }, [auth]);
    if (!children) {
        throw new Error("Children must be provided");
    }
    if (sign.status === "loading") {
        return <CenteredCircularProgress/>;
    }
    if (sign.data.signedIn) {
        log("authenticated, redirecting to", children);
        return children as JSX.Element;
    } else {
        log("not authenticated, redirecting to /signin");
        return <Redirect to="/signin" />;
    }
};
CheckAuthentication.displayName = "CheckAuthentication";
export default CheckAuthentication;