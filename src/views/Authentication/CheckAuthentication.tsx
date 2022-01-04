import { browserSessionPersistence, setPersistence } from "firebase/auth";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth, useUser } from "reactfire";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";

export const CheckAuthentication = ({ children }: React.PropsWithChildren<any>): JSX.Element => {
    const auth = useAuth();
    const user = useUser();
    
    useEffect(() => {
        setPersistence(auth, browserSessionPersistence);
      }, [auth]);
    if (!children) {
        throw new Error("Children must be provided");
    }
    if (user.status !== "success") {
        return <CenteredCircularProgress />;
    }

    if (user.data) {
        return children as JSX.Element;
    } else {
        return <Redirect to="/signin" />;
    }
};
CheckAuthentication.displayName = "CheckAuthentication";
export default CheckAuthentication;