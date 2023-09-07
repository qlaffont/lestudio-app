import { onMount, type Component } from 'solid-js'
import { Router, hashIntegration } from '@solidjs/router'
import { AppRoutes } from './pages'
import { AppLayout } from './components/layout/AppLayout'
import { getGamesList, updateGamesList } from './tauri'

const App: Component = () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    await updateGamesList()
    console.log(await getGamesList())
  })
  return (
    <>
      <Router source={hashIntegration()}>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </>
  )
}

export default App
