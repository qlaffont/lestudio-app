import { type Component } from 'solid-js';
import { Router, hashIntegration } from '@solidjs/router';
import { AppRoutes } from './pages';
import { AppLayout } from './components/layout/AppLayout';
import { enGB } from 'date-fns/locale';
import { RosettyProvider } from 'rosetty-solid';
import { enI18n } from './lang/en';
import { Toaster } from 'solid-toast';
import { AppProvider } from './components/modules/app/context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { CaptionsProvider } from './components/modules/captions/context/CaptionsContext';
// import SolidQueryDevkit from 'solid-query-devkit';

const locales = { en: { dict: enI18n, locale: enGB } };
const defaultLanguage = 'en';

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router source={hashIntegration()}>
          <RosettyProvider languages={locales} defaultLanguage={defaultLanguage}>
            <AppProvider>
              <CaptionsProvider>
                <AppLayout>
                  <AppRoutes />
                </AppLayout>
                <Toaster />
              </CaptionsProvider>
            </AppProvider>
          </RosettyProvider>
        </Router>
        {/* To Debug solid query in front */}
        {/* <SolidQueryDevkit /> */}
      </QueryClientProvider>
    </>
  );
};

export default App;
