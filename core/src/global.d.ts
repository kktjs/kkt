declare const require: {
  (u: string): any;
  cache: {
    [key: string]: any;
  };
  resolve(path: string): string;
};
