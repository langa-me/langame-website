import React from "react";
import classNames from "classnames";
import Logo from "./partials/Logo";
import FooterNav from "./partials/FooterNav";

interface FooterProps extends React.PropsWithChildren<any> {
  topOuterDivider?: boolean;
  topDivider?: boolean;
}

const Footer = ({
  className,
  topOuterDivider,
  topDivider,
  ...props
}: FooterProps) => {

  const classes = classNames(
    "site-footer center-content-mobile",
    topOuterDivider && "has-top-divider",
    className
  );

  return (
    <footer
      {...props}
      className={classes}
    >
      <div className="container">
        <div className={
          classNames(
            "site-footer-inner",
            topDivider && "has-top-divider"
          )}>
          <div className="footer-top space-between text-xxs">
            <Logo className={undefined} />
          </div>
          <div className="footer-bottom space-between text-xxs invert-order-desktop">
            <FooterNav className={undefined} />
          </div>
        </div>
      </div>
    </footer>
  );
}


export default Footer;
