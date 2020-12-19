import React from 'react';
import classnames from 'classnames';
import './style/index.less';

export type HTMLButtonProps = React.HTMLProps<HTMLButtonElement>;
export type Type = 'primary' | 'success' | 'warning' | 'danger' | 'light' | 'dark' | 'link';
export type Size = 'large' | 'default' | 'small';
export interface IButtonProps {
  style?: React.CSSProperties;
  className?: string;
  prefixCls?: string;
  icon?: JSX.Element | string | false | null;
  intent?: string;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  active?: boolean;
  basic?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  type?: Type;
  size?: Size;
}

export default class Button extends React.Component<IButtonProps & HTMLButtonProps> {
  static defaultProps: IButtonProps = {
    prefixCls: 'w-btn',
    disabled: false,
    active: false,
    loading: false,
    block: false,
    basic: false,
    htmlType: 'button',
    type: 'light',
    size: 'default',
  }
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
        type={htmlType}
        disabled={disabled || loading}
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

