import type { Component } from 'solid-js'
// import { Router, hashIntegration } from '@solidjs/router'
// import { AppRoutes } from './pages'
// import { AppLayout } from './components/layout/AppLayout'
import { Settings } from './pages/settings'

const App: Component = () => {
  return (
    <>
      {/* <Router source={hashIntegration()}> */}
      {/* <AppLayout> */}
      Settings
      <Settings />
      {/* <AppRoutes /> */}
      {/* </AppLayout> */}
      {/* </Router> */}
    </>
  )
}

export default App
