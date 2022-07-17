import React from "react";
import CheckAuthentication from "../components/elements/CheckAuthentication";
import AccountDrawer from "../components/layout/AccountDrawer";

interface LayoutAccountProps extends React.PropsWithChildren<any> {

}
const LayoutAccount = ({ children }: LayoutAccountProps) => (
  <CheckAuthentication>
    <AccountDrawer>
      {children}
    </AccountDrawer>
  </CheckAuthentication>
);

export default LayoutAccount;  
