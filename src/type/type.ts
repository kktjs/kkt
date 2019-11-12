/// <reference types="node" />

import { Arguments } from 'yargs';

export interface IMyYargsArgs extends Arguments {
  example?: string;
  registry?: string;
  [key: string]: any;
}

export interface ClientEnvironment {
  raw: {
    NODE_ENV?: 'development' | 'production' | string;
    PUBLIC_URL?: string;
    IMAGE_INLINE_SIZE_LIMIT?: string;
    /**
     * The babel contains the entry directory.
     */
    APPSRC?: string;
  },
  stringified: {
    'process.env': ClientEnvironment['raw'],
  },
}

