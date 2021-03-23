import { init } from '@rematch/core';
import loadingPlugin from '@rematch/loading';
import * as models from '../models/global';

export const store = init({
  models,
  plugins: [loadingPlugin()],
});
