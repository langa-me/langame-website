import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const FooterNav = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'footer-nav',
    className
  );

  return (
    <nav
      {...props}
      className={classes}
    >
      <ul className="list-reset">
        <li>
          <Link to="help.langa.me">About us</Link>
        </li>
        <li>
          <Link to="help.langa.me/privacy">Privacy</Link>
        </li>
        <li>
          <Link to="help.langa.me/terms">Terms</Link>
        </li>
      </ul>
    </nav>
  );
}

export default FooterNav;
