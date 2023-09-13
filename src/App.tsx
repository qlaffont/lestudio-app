import { type Component } from 'solid-js';
import { Router, hashIntegration } from '@solidjs/router';
import { AppRoutes } from './pages';
import { AppLayout } from './components/layout/AppLayout';
import en from 'dayjs/locale/en';
import { RosettyProvider } from 'rosetty-solid';
import { enI18n } from './lang/en';

const locales = { en: { dict: enI18n, locale: en } };
const defaultLanguage = 'en';

const App: Component = () => {
  return (
    <>
      <RosettyProvider languages={locales} defaultLanguage={defaultLanguage}>
        <Router source={hashIntegration()}>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </Router>
      </RosettyProvider>
    </>
  );
};

export default App;
