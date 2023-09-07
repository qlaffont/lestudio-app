import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'

export type Config = {
  token?: string
}

export const getConfig = async (): Promise<Config> => {
  return JSON.parse(await invoke('get_config')) as Config
}

export const setConfig = async (data: Partial<Config>) => {
  const oldConfig = await getConfig()
  await invoke('set_config', {
    content: JSON.stringify({ ...oldConfig, ...data }, null, 2)
  })
}

export const getSystem = async (): Promise<'windows' | 'linux' | 'mac'> => {
  return await invoke('get_system')
}

export const getMusicContent = async (): Promise<string> => {
  return await invoke('get_music_content')
}

export const onProcessList = async (callback: (processes: string[]) => void) => {
  await listen('process-list', event => {
    callback((event.payload as { message: string }).message.split('|'))
  })
}
