/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import AccountDrawer from "../components/layout/AccountDrawer";
// import AccountDrawer from "../components/layout/AccountDrawer";
import Header from "../components/layout/Header";

interface LayoutAccountProps extends React.PropsWithChildren<any> {

}
const LayoutAccount = ({ children }: LayoutAccountProps) => (
  <>
    <Header 
      navPosition="right" 
      className="reveal-from-bottom" 
    />
      <AccountDrawer 
        topAnchor={100}
      />
      <main className="site-content"
        style={{
          position: "relative",
          left: "20%",
        }}
      >
        {children}
      </main>
  </>
);

export default LayoutAccount;  
