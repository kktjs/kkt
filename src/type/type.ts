/// <reference types="node" />

import { Arguments } from 'yargs';

export interface IMyYargsArgs extends Arguments {
  example?: string;
  registry?: string;
  [key: string]: any;
}

export interface ClientEnvironment {
  raw: {
    NODE_ENV?: 'development' | 'production';
    PUBLIC_URL?: string;
    IMAGE_INLINE_SIZE_LIMIT?: string;
  },
  stringified: {
    'process.env': ClientEnvironment['raw'],
  },
}

