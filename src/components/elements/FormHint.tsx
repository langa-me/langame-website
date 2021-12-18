import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

type FormHintProps = React.HTMLProps<HTMLDivElement> & { status?: string }

const propTypes = {
  children: PropTypes.node,
  status: PropTypes.string
}

const defaultProps = {
  children: null,
  status: null
}

const FormHint = ({
  children,
  className,
  status,
  ...props
}: FormHintProps) => {

  const classes = classNames(
    'form-hint',
    status && `text-color-${status}`,
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      {children}
    </div>
  );
}

FormHint.propTypes = propTypes;
FormHint.defaultProps = defaultProps;

export default FormHint;