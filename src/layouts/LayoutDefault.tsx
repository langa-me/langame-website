import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

interface LayoutDefaultProps extends React.PropsWithChildren<any> {

}
const LayoutDefault = ({ children }: LayoutDefaultProps) => (
  <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
      {children}
    </main>
    <Footer className={undefined} topOuterDivider={undefined} topDivider={undefined} />
  </>
);

export default LayoutDefault;  
