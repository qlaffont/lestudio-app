/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { Accessor, JSX, Setter, createContext, createSignal, onMount, useContext } from 'solid-js';
import toast from 'solid-toast';
import {
  updateGamesList,
  onProcessList,
  onMusic,
  MusicData,
  onToggleAutoStart,
  GameData,
  onDetectedGame,
  getConfig,
  getVersion,
  getSystem,
  onResize,
} from '../../../../tauri';
import { useI18n } from '../../../../lang/useI18n';

export const AppContext = createContext();

export const AppProvider = (props: { children: JSX.Element }) => {
  const { t } = useI18n();
  const [music, setMusic] = createSignal<MusicData>(null);
  const [processes, setProcesses] = createSignal<string[]>([]);
  const [detectedGame, setDetectedGame] = createSignal<GameData>({});
  const [token, setToken] = createSignal<string>();
  const [version, setVersion] = createSignal<string>();
  const [system, setSystem] = createSignal<string>();

  onMount(() => {
    (async () => {
      await Promise.allSettled([
        (async () => {
          try {
            await updateGamesList();
            toast.success(t('global.gameList.updated'));
          } catch (error) {
            toast.error(t('global.gameList.error'));
          }
        })(),
        (async () => {
          const config = await getConfig();
          setToken(config.token);
        })(),
        (async () => {
          setVersion(await getVersion());
        })(),
        (async () => {
          setSystem(await getSystem());
        })(),
      ]);
    })();

    onProcessList((processes) => {
      setProcesses(processes);
    });

    onMusic((music) => {
      setMusic(music);
    });
    onDetectedGame((game) => {
      setDetectedGame(game);
    });

    onToggleAutoStart();

    onResize();
  });

  return (
    <AppContext.Provider
      value={{
        music,
        processes,
        detectedGame,
        token,
        setMusic,
        setProcesses,
        setDetectedGame,
        setToken,
        version,
        system,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useApp = () =>
  useContext(AppContext) as {
    music: Accessor<MusicData>;
    processes: Accessor<string[]>;
    detectedGame: Accessor<GameData>;
    token: Accessor<string>;
    system: Accessor<string>;
    version: Accessor<string>;
    setMusic: Setter<MusicData>;
    setProcesses: Setter<string[]>;
    setDetectedGame: Setter<GameData[]>;
    setToken: Setter<string>;
  };
