import React from 'react';
import classnames from 'classnames';
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
    const cls = classnames(className, prefixCls, {
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-basic`]: basic,
      [`${prefixCls}-loading`]: loading, // 加载
      disabled: disabled || loading, // 禁用状态
      active, // 激活状态
      block, // 块级元素Block level
    });
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
