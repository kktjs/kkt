/// <reference types="node" />

export interface ClientEnvironment {
  raw: {
    NODE_ENV?: 'development' | 'production' | string;
    PUBLIC_URL?: string;
    IMAGE_INLINE_SIZE_LIMIT?: string;
  },
  stringified: {
    'process.env': ClientEnvironment['raw'],
  },
}

