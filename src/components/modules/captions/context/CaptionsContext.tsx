/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { Accessor, JSX, createContext, createEffect, createMemo, createSignal, onMount, useContext } from 'solid-js';
import OBSWebSocket from 'obs-websocket-js';
import { getCaptionsLanguage, getOBSAddress, getOBSPassword } from '../../../../tauri';
import { useSocket } from '../../../../services/useSocket';
import { useApp } from '../../app/context/AppContext';
import toast from 'solid-toast';
import { useLocation } from '@solidjs/router';
// import toast from 'solid-toast';

export const CaptionsContext = createContext();

type ContextReturn = {
  isCompatible: Accessor<boolean>;
  lastText: Accessor<string>;
  isConnectedToOBS: Accessor<boolean>;
  obsAddress: Accessor<string>;
};

export const CaptionsProvider = (props: { children: JSX.Element }) => {
  const { manager, socket } = useSocket();
  const { token } = useApp();

  const [isCompatible, setIsCompatible] = createSignal<boolean>(false);

  const [lastText, setLastText] = createSignal<string>();
  const [recognition, setRecognition] = createSignal<SpeechRecognition>();

  const [obs, setOBS] = createSignal<OBSWebSocket>();
  const [intervalOBS, setIntervalOBS] = createSignal<NodeJS.Timer>();
  const [isConnectedToOBS, setConnectedToOBS] = createSignal<boolean>(false);
  const [obsAddress, setOBSAddress] = createSignal<string>();
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  onMount(() => {
    //@ts-ignore
    setIsCompatible('webkitSpeechRecognition' in window);

    startRecognition();
  });

  createEffect(() => {
    if (!isConnectedToOBS() && isCompatible()) {
      if (intervalOBS()) {
        clearInterval(intervalOBS());
      }

      const inter = setInterval(() => {
        tryToConnectToOBS();
      }, 10000);

      setIntervalOBS(inter);
    } else {
      clearInterval(intervalOBS());
      setIntervalOBS(undefined);
    }
  });

  const startRecognition = async () => {
    if (isCompatible()) {
      if (recognition()) {
        recognition().stop();
      }

      const newRecognition = new webkitSpeechRecognition();
      newRecognition.interimResults = true;
      newRecognition.continuous = true;
      newRecognition.lang = await getCaptionsLanguage();

      newRecognition.onresult = async function (event) {
        const index = Object.keys(event.results).length;
        const result = event.results[index - 1];
        console.log(event.results);
        //@ts-ignore
        const haveResultFinal = result.isFinal;

        const text = result['0'].transcript.trim();

        if (haveResultFinal) {
          // TODO Translate if needed
        }
        setLastText(text);

        if (obs()) {
          try {
            await obs().call('SendStreamCaption', { captionText: text });
            // eslint-disable-next-line no-empty
          } catch (error) {}
        }

        socket().emit('web-speech-user', {
          userToken: token(),
          content: text,
        });
      };

      newRecognition.onend = function () {
        startRecognition();
      };

      newRecognition.start();
      setRecognition(newRecognition);
    }
  };

  const tryToConnectToOBS = async () => {
    if (!isConnectedToOBS()) {
      //Instanciate OBS CLIENT IF INFOS
      const obs = new OBSWebSocket();

      try {
        const obsAddress = `ws://${await getOBSAddress()}`;
        setOBSAddress(obsAddress);
        obs.once('ConnectionClosed', () => {
          setConnectedToOBS(false);
          tryToConnectToOBS();
        });
        await obs.connect(obsAddress, await getOBSPassword());
        setOBS(obs);
        setConnectedToOBS(true);
      } catch (error) {
        setConnectedToOBS(false);
        if (pathname() === '/captions') {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          toast.error(`Failed to connect to OBS, ${error.code}, ${error.message}`);
          console.error(error);
        }
      }
    }
  };

  createEffect(() => {
    if (token() && manager() && socket()) {
      const onManagerReconnect = () => {
        socket().emit('web-speech-user', {
          userToken: token(),
          content: undefined,
        });
      };

      manager().removeListener('reconnect', onManagerReconnect);
      manager().on('reconnect', onManagerReconnect);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    <CaptionsContext.Provider value={{ isCompatible, lastText, isConnectedToOBS, obsAddress } satisfies ContextReturn}>
      {props.children}
    </CaptionsContext.Provider>
  );
};

export const useCaptions = () => useContext(CaptionsContext) as ContextReturn;
