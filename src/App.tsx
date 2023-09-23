import { type Component } from 'solid-js';
import { Router, hashIntegration } from '@solidjs/router';
import { AppRoutes } from './pages';
import { AppLayout } from './components/layout/AppLayout';
import en from 'dayjs/locale/en';
import { RosettyProvider } from 'rosetty-solid';
import { enI18n } from './lang/en';
import { Toaster } from 'solid-toast';
import { AppProvider } from './components/modules/app/context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
// import SolidQueryDevkit from 'solid-query-devkit';

const locales = { en: { dict: enI18n, locale: en } };
const defaultLanguage = 'en';

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RosettyProvider languages={locales} defaultLanguage={defaultLanguage}>
          <AppProvider>
            <Router source={hashIntegration()}>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </Router>
            <Toaster />
          </AppProvider>
        </RosettyProvider>
        {/* To Debug solid query in front */}
        {/* <SolidQueryDevkit /> */}
      </QueryClientProvider>
    </>
  );
};

export default App;
