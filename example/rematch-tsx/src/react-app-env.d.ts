/// <reference types="react-scripts" />

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'react-dynamic-loadable' {
  interface Options {
    models: () => Promise<any>[],
    component: () => Promise<any>,
    LoadingComponent: () => JSX.Element,
  }
  function _default(options: Options): void;
  export default _default;
}