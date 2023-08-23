import { render } from 'solid-js/web';

declare global {
  interface Window {
    processList: string[];
  }
}

window.processList = [];

await listen('process-list', (event) => {
  window.processList = (event.payload as {message: string}).message.split('|');

  console.log(window.processList);
})


import { listen } from '@tauri-apps/api/event'

import App from './App'
import './index.css'

render(() => <App />, document.getElementById('root') as HTMLElement)

