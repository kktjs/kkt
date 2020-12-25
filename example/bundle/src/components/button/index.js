import React from 'react';
import PropTypes from 'prop-types';
import './style/index.less';
import './style/btn.less';

export default class Button extends React.Component {
  render() {
    const { prefixCls, type, size, active, disabled, block, basic, intent, className, loading, children, htmlType, ...others } = this.props;

    const cls = [ className, prefixCls,
      size ? `${prefixCls}-${size}` : false,
      type ? `${prefixCls}-${type}` : false,
      basic ? `${prefixCls}-basic` : false,
      loading ? `${prefixCls}-loading` : false,
      (disabled || loading) ? 'disabled' : false,
      active ? 'active' : false,
      block ? 'block' : false,
    ].filter(Boolean).join(' ');
    return (
      <button
        {...others}
        disabled={disabled || loading}
        type={htmlType}
        className={cls}
      >
        {children && React.Children.map(children, (child) => {
          if (React.isValidElement(child)) return child;
          return <span> {child} </span>;
        })}
      </button>
    );
  }
}

Button.defaultProps = {
  prefixCls: 'w-btn',
  disabled: false,
  active: false,
  loading: false,
  block: false,
  basic: false,
  htmlType: 'button',
  type: 'light',
  size: 'default',
};
Button.propTypes = {
  prefixCls: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  active: PropTypes.bool,
  basic: PropTypes.bool,
  htmlType: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'light', 'dark', 'link']),
  size: PropTypes.oneOf(['large', 'default', 'small']),
};

