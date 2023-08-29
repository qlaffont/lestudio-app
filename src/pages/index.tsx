import { Route, Routes } from '@solidjs/router'
import { Home } from './home'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" component={Home} />
    </Routes>
  )
}
