import { Route, Routes } from '@solidjs/router';
import { Home } from './home';
import { Settings } from './settings';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" component={Home} />
      <Route path="/settings" component={Settings} />
    </Routes>
  );
};
