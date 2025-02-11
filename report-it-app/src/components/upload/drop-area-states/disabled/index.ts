import { lazy } from 'react';

export default lazy(
  () =>
    import('./disabled-drop-area' /* webpackChunkName: "disabled-drop-area" */)
);
