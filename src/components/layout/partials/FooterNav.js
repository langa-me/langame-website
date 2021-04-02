import React from 'react';
import classNames from 'classnames';

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
          <a target="_blank" rel="noopener noreferrer" href="https://help.langa.me">About us</a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="https://help.langa.me/privacy">Privacy</a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="https://help.langa.me/terms">Terms</a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="https://help.langa.me/join">Join us</a>
        </li>
      </ul>
    </nav>
  );
}

export default FooterNav;
