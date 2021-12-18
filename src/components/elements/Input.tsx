import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FormLabel from './FormLabel';
import FormHint from './FormHint';

type InputPropsTypes = 'textarea' | 'text' | 'email' | 'tel' | 'password' | 'number' | 'search' | 'color' | 'date' | 'time' | 'datetime-local';

type InputProps = {
  hasIcon?: string,
  labelHidden?: boolean,
  status?: string,
  formGroup?: string,
  type?: InputPropsTypes,
  hint?: boolean,
} & (React.HTMLProps<HTMLInputElement> | React.HTMLProps<HTMLTextAreaElement>)

const propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  type: PropTypes.oneOf(['textarea', 'text', 'email', 'tel', 'password', 'number', 'search', 'color', 'date', 'time', 'datetime-local']),
  name: PropTypes.string,
  status: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  formGroup: PropTypes.string,
  hasIcon: PropTypes.string,
  size: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  hint: PropTypes.string
}

const defaultProps = {
  children: null,
  label: '',
  labelHidden: false,
  type: 'text',
  name: undefined,
  status: '',
  disabled: false,
  value: undefined,
  formGroup: null,
  hasIcon: null,
  size: '',
  placeholder: '',
  rows: 3,
  hint: null
}

const Input = ({
  className,
  children,
  label,
  labelHidden,
  type = 'text',
  name,
  status,
  disabled,
  value,
  formGroup,
  hasIcon,
  size,
  placeholder,
  rows = 3,
  hint,
  ...props
}: InputProps) => {

  const wrapperClasses = classNames(
    formGroup && formGroup === 'desktop' ? 'form-group-desktop' : 'form-group',
    hasIcon && 'has-icon-' + hasIcon
  );

  const classes = classNames(
    'form-input',
    size && `form-input-${size}`,
    status && `form-${status}`,
    className
  );

  const Component = type === 'textarea' ? 'textarea' : 'input';
  const componentProps = {
    ...props,
    type: type !== 'textarea' ? type : undefined,
    className: classes,
    name: name,
    disabled: disabled,
    value: value,
    placeholder: placeholder,
    rows: type === 'textarea' ? rows : undefined,
  }

  return (
    <>
      {label && <FormLabel labelHidden={labelHidden} id={props.id}>{label}</FormLabel>}
      <div
        className={wrapperClasses}
      >
        <Component {...componentProps as any} />
        {children}
      </div>
      {hint && <FormHint status={status}>{hint}</FormHint>}
    </>
  );
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
