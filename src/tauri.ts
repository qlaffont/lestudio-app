/* eslint-disable @typescript-eslint/indent */
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { disable, enable } from 'tauri-plugin-autostart-api';

export type Config = {
  token?: string;
  isAutoStartActivated?: boolean;
  notFoundAction?: 'clear' | 'justchatting' | 'nothing';
  captionsOBSAddress?: string;
  captionsOBSPassword?: string;
  captionsLanguage?: string;
  height?: string;
  width?: string;
};

export type MusicData = null | {
  currentSongTitle?: string | null;
  currentSongAuthor?: string | null;
  currentSongAlbum?: string | null;
  currentSongImage?: string | null;
  currentSongIsPlaying: boolean;
};
type EmptyObj = Record<PropertyKey, never>;
export type GameData =
  | {
      processName: string;
      windowTitle: string;
      igdbId: string;
      twitchCategoryId: string;
    }
  | EmptyObj;

export const getVersion = async (): Promise<string> => {
  return await invoke('get_version');
};

export const getConfig = async (): Promise<Config> => {
  return JSON.parse(await invoke('get_config')) as Config;
};

export const getCaptionsData = async () => {
  const config = await getConfig();

  return {
    captionsOBSAddress: config?.captionsOBSAddress || '127.0.0.1:4455',
    captionsOBSPassword:
      config?.captionsOBSPassword && config?.captionsOBSPassword?.length > 0 ? config?.captionsOBSPassword : undefined,
    captionsLanguage: config?.captionsLanguage || 'en-GB',
  };
};

export const getOBSAddress = async (): Promise<string> => {
  const config = await getConfig();

  return config?.captionsOBSAddress || '127.0.0.1:4455';
};

export const getOBSPassword = async (): Promise<string> => {
  const config = await getConfig();

  return config?.captionsOBSPassword && config?.captionsOBSPassword?.length > 0
    ? config?.captionsOBSPassword
    : undefined;
};

export const getCaptionsLanguage = async (): Promise<string> => {
  const config = await getConfig();

  return config?.captionsLanguage || 'en-GB';
};

export const setConfig = async (data: Partial<Config>) => {
  const oldConfig = await getConfig();
  await invoke('set_config', {
    content: JSON.stringify({ ...oldConfig, ...data }, null, 2),
  });
};

export const toggleAutoStart = async () => {
  const oldConfig = await getConfig();

  let isAutoStartActivated = !!oldConfig?.isAutoStartActivated;

  if (isAutoStartActivated) {
    await disable();
    isAutoStartActivated = false;
  } else {
    await enable();
    isAutoStartActivated = true;
  }

  await invoke('set_config', {
    content: JSON.stringify({ ...oldConfig, isAutoStartActivated }, null, 2),
  });

  await invoke('refresh_autostart_rust');
};

export const getSystem = async (): Promise<'windows' | 'linux' | 'mac'> => {
  return await invoke('get_system');
};

export const updateGamesList = async () => {
  await invoke('update_games_list');
};

export const addGameToLocaleGameList = async (data: { twitchCategoryId: string; processName: string }) => {
  await invoke('add_game_to_list', {
    content: JSON.stringify({
      ...data,
      igdbId: data.twitchCategoryId,
      windowTitle: data.processName,
    } satisfies GameData),
  });
};

/**
 * EVENTS
 */
export const onProcessList = async (callback: (processes: string[]) => void) => {
  await listen('process-list', (event) => {
    callback((event.payload as { message: string }).message.split('|'));
  });
};

export const onMusic = async (callback: (music: MusicData) => void) => {
  await listen('music', (event) => {
    const data = JSON.parse((event.payload as { message: string }).message) as MusicData;
    // console.info('[INFO] New Music :', data?.currentSongTitle);
    callback(data);
  });
};

export const onToggleAutoStart = async () => {
  await listen('toggle_autostart', () => {
    toggleAutoStart();
  });
};

export const onDetectedGame = async (callback: (game: GameData) => void) => {
  await listen('detected-game', (event) => {
    const data = JSON.parse((event.payload as { message: string }).message) as GameData;
    // console.info('[INFO] Detected Game :', data?.processName, '/ Twitch Category Id :', data?.twitchCategoryId);
    callback(data);
  });
};
