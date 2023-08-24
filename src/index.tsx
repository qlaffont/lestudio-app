import { render } from 'solid-js/web';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';

declare global {
  interface Window {
    processList: string[];
  }
}

window.processList = [];

await listen('process-list', (event) => {
  window.processList = (event.payload as {message: string}).message.split('|');

  console.log(window.processList);
});
console.log("qweoqweo")
console.log(await invoke('get_system'));
console.log(await invoke('get_music_content'));

import App from './App'
import './index.css'

render(() => <App />, document.getElementById('root') as HTMLElement)

