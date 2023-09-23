import { render } from 'solid-js/web';

import App from './App';
import './scss/index.scss';

import 'solid-js';
declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      form: true;
    }
  }
}

render(() => <App />, document.getElementById('root'));
