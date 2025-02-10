import { lazy } from 'react'

export default lazy(
  () =>
    import(
      './active-drag-drop-area' /* webpackChunkName: "active-drag-drop-area" */
    )
)
