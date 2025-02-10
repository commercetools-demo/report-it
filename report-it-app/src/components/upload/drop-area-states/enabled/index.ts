import { lazy } from 'react'

export default lazy(
  () =>
    import('./enabled-drop-area' /* webpackChunkName: "enabled-drop-area" */)
)
