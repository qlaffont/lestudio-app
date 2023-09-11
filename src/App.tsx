import { type Component } from 'solid-js';
import { Router, hashIntegration } from '@solidjs/router';
import { AppRoutes } from './pages';
import { AppLayout } from './components/layout/AppLayout';

const App: Component = () => {
  return (
    <>
      <Router source={hashIntegration()}>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </>
  );
};

export default App;
