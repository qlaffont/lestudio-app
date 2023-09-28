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
import debounce from 'lodash/debounce';

export const CaptionsContext = createContext();

type ContextReturn = {
  isCompatible: Accessor<boolean>;
  lastText: Accessor<string>;
  isConnectedToOBS: Accessor<boolean>;
  obsAddress: Accessor<string>;
  restartRecognition: () => void;
};

declare global {
  interface Window {
    tryToConnectToOBS: () => Promise<void>;
    startRecognition: () => Promise<void>;
    recogition?: SpeechRecognition;
  }
}

export const CaptionsProvider = (props: { children: JSX.Element }) => {
  const { manager, socket } = useSocket();
  const { token } = useApp();

  const [isCompatible, setIsCompatible] = createSignal<boolean>(false);

  const [lastText, setLastText] = createSignal<string>();
  const [recognition, setRecognition] = createSignal<SpeechRecognition>();

  const [obs, setOBS] = createSignal<OBSWebSocket>();
  const [isConnectedToOBS, setConnectedToOBS] = createSignal<boolean>(false);
  const [obsAddress, setOBSAddress] = createSignal<string>();
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  onMount(() => {
    //@ts-ignore
    setIsCompatible('webkitSpeechRecognition' in window);

    // eslint-disable-next-line solid/reactivity
    window.tryToConnectToOBS = async () => {
      if (!isConnectedToOBS()) {
        // console.log('connect to obs');
        //Instanciate OBS CLIENT IF INFOS
        const obs = new OBSWebSocket();

        try {
          const obsAddress = `ws://${await getOBSAddress()}`;
          setOBSAddress(obsAddress);
          await obs.connect(obsAddress, await getOBSPassword());
          obs.once('ConnectionClosed', () => {
            setConnectedToOBS(false);
            window.tryToConnectToOBS();
          });
          setOBS(obs);
          setConnectedToOBS(true);
        } catch (error) {
          setConnectedToOBS(false);
          // TODO to refactor
          if (pathname() === '/captions') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            toast.error(`Failed to connect to OBS, ${error.code}, ${error.message}`);
            console.error(error);
          }

          setTimeout(() => {
            window.tryToConnectToOBS();
          }, 10000);
        }
      }
    };

    window.startRecognition = async () => {
      if (isCompatible()) {
        // console.log('recogition start....');
        const newRecognition = new webkitSpeechRecognition();
        newRecognition.interimResults = true;
        newRecognition.continuous = true;
        newRecognition.lang = await getCaptionsLanguage();

        newRecognition.onresult = async function (event) {
          const index = Object.keys(event.results).length;
          const result = event.results[index - 1];
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        newRecognition.onend = function (e) {
          // console.log('recogition stop....', e);
          setRecognition(undefined);
          window.startRecognition();
        };

        newRecognition.start();
        setRecognition(newRecognition);
      }
    };
  });

  createEffect(() => {
    //Strange thing rerender 2 times
    debounce(() => {
      if (isCompatible()) {
        window.tryToConnectToOBS();
        window.startRecognition();
      }
    }, 500)();
  });

  const restartRecognition = () => {
    if (recognition()) {
      recognition().stop();
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
    <CaptionsContext.Provider
      value={{ isCompatible, lastText, isConnectedToOBS, obsAddress, restartRecognition } satisfies ContextReturn}
    >
      {props.children}
    </CaptionsContext.Provider>
  );
};

export const useCaptions = () => useContext(CaptionsContext) as ContextReturn;
