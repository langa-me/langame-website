import React from "react";
import AccountDrawer from "../components/layout/AccountDrawer";

interface LayoutAccountProps extends React.PropsWithChildren<any> {

}
const LayoutAccount = ({ children }: LayoutAccountProps) => (
  <AccountDrawer>
    {children}
  </AccountDrawer>
);

export default LayoutAccount;  
