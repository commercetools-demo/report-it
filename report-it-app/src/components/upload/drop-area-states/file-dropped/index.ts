import { lazy } from 'react';

export default lazy(
  () =>
    import('./file-dropped-area' /* webpackChunkName: "filed-dropped-area" */)
);
