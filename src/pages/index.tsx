import { Route, Router } from '@solidjs/router';
import { Home } from './home';
import { Settings } from './settings';
import { Music } from './music';
import { Game } from './game';
import { Captions } from './captions';

export const AppRoutes = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/settings" component={Settings} />
      <Route path="/music" component={Music} />
      <Route path="/game" component={Game} />
      <Route path="/captions" component={Captions} />
    </Router>
  );
};
