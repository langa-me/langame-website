import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "reactfire";
import AccountMenu from "../elements/AccountMenu";
import Logo from "./partials/Logo";

interface HeaderProps extends React.PropsWithChildren<any> {
  navPosition?: "left" | "right" | "center";
  hideNav?: boolean;
  hideSignin?: boolean;
  hideDev?: boolean;
  bottomOuterDivider?: boolean;
  bottomDivider?: boolean;
}

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  hideDev,
  bottomOuterDivider,
  bottomDivider,
  ...props
}: HeaderProps) => {

  const [isActive, setIsactive] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const hamburger = useRef<HTMLButtonElement>(null);
  const user = useUser();

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener("keydown", keyPress);
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("keydown", keyPress);
      document.removeEventListener("click", clickOutside);
      closeMenu();
    };
  });

  const openMenu = () => {
    document.body.classList.add("off-nav-is-active");
    if (nav.current) nav!.current!.style.maxHeight = nav!.current!.scrollHeight + "px";
    setIsactive(true);
  }

  const closeMenu = () => {
    document.body.classList.remove("off-nav-is-active");
    if (nav.current) nav!.current!.style.maxHeight = "0";
    setIsactive(false);
  }


  const signUp = () => {
    closeMenu();
    window.location.href = "/signin";
  }

  const keyPress = (e: any) => {
    isActive && e.keyCode === 27 && closeMenu();
  }

  const clickOutside = (e: any) => {
    if (!nav?.current) return
    if (!isActive || nav.current!.contains(e.target) || e.target === hamburger.current) return;
    closeMenu();
  }

  const classes = classNames(
    "site-header",
    bottomOuterDivider && "has-bottom-divider",
    className
  );

  return (
    <header
      {...props}
      className={classes}
    >
      <div className="container">
        <div className={
          classNames(
            "site-header-inner",
            bottomDivider && "has-bottom-divider"
          )}>
          <Logo className={undefined} />
          {!hideNav &&
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={
                  classNames(
                    "header-nav",
                    isActive && "is-active"
                  )}>
                <div className="header-nav-inner">
                  {!hideDev && <ul className={
                    classNames(
                      "list-reset text-xs",
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    <li>
                      <Link target="_blank"
                        to={{ pathname: "https://docs.langa.me" }}
                        onClick={closeMenu}>Developer Documentation</Link>
                    </li>
                  </ul>}
                  {!user.data && !hideSignin &&
                    <ul
                      className="list-reset header-nav-right"
                    >
                      <li>
                        <Link to="#0"
                          className="button button-primary button-wide-mobile button-sm"
                          onClick={signUp}>Sign up
                        </Link>
                      </li>
                    </ul>
                  }
                  {user.data &&
                    <ul
                      className="list-reset header-nav-right"
                    >
                      <li>
                        <AccountMenu />
                      </li>
                    </ul>
                  }
                </div>
              </nav>
            </>}
        </div>
      </div>
    </header>
  );
}


export default Header;
