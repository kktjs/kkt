import React from 'react';
import './style/index.less';
import './style/btn.less';

export type ButtonProps = {
  prefixCls?: string;
  type?: boolean;
  size?: boolean;
  active?: boolean;
  disabled?: boolean;
  block?: boolean;
  basic?: boolean;
  intent?: boolean;
  className?: string;
  loading?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
}

export default class Button extends React.Component<ButtonProps, {}> {
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
