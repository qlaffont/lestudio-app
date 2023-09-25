/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { Accessor, JSX, createContext, createEffect, createSignal, onMount, useContext } from 'solid-js';
import OBSWebSocket from 'obs-websocket-js';
// import toast from 'solid-toast';

export const CaptionsContext = createContext();

type ContextReturn = {
  isCompatible: Accessor<boolean>;
  lastText: Accessor<string>;
  isConnectedToOBS: Accessor<boolean>;
};

export const CaptionsProvider = (props: { children: JSX.Element }) => {
  const [isCompatible, setIsCompatible] = createSignal<boolean>(false);

  const [lastText, setLastText] = createSignal<string>();
  const [recognition, setRecognition] = createSignal<SpeechRecognition>();

  const [lastUpdate, setUpdate] = createSignal<number>();

  const [obs, setOBS] = createSignal<OBSWebSocket>();
  const [intervalOBS, setIntervalOBS] = createSignal<NodeJS.Timer>();
  const [isConnectedToOBS, setConnectedToOBS] = createSignal<boolean>(false);

  onMount(() => {
    //@ts-ignore
    setIsCompatible('webkitSpeechRecognition' in window);
  });

  createEffect(() => {
    if (!isConnectedToOBS()) {
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

  const startRecognition = () => {
    if (isCompatible()) {
      if (recognition()) {
        recognition().stop();
      }

      const newRecognition = new webkitSpeechRecognition();
      newRecognition.interimResults = true;
      newRecognition.lang = 'fr-FR';

      newRecognition.onresult = async function (event) {
        //@ts-ignore
        const haveResultFinal = Object.values(event.results).find((e) => e.isFinal);

        if (haveResultFinal) {
          const text = haveResultFinal['0'].transcript.trim();
          setLastText(text);

          if (obs()) {
            try {
              await obs().call('SendStreamCaption', { captionText: text });
              // eslint-disable-next-line no-empty
            } catch (error) {}
          }
        } else {
          const text = Object.values(event.results)
            .map((e) => e['0'].transcript.trim() as string)
            .join(' ');

          setLastText(text);

          if (obs()) {
            try {
              await obs().call('SendStreamCaption', { captionText: text });
              // eslint-disable-next-line no-empty
            } catch (error) {}
          }
        }
      };

      newRecognition.onend = function () {
        setUpdate(Date.now());
      };

      newRecognition.start();
      setRecognition(newRecognition);
    }
  };

  const tryToConnectToOBS = async () => {
    //Instanciate OBS CLIENT IF INFOS
    const obs = new OBSWebSocket();

    try {
      await obs.connect(`ws://127.0.0.1:4455`, 'testtest');
      setConnectedToOBS(true);
    } catch (error) {
      setConnectedToOBS(false);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      // toast.error(`Failed to connect to OBS, ${error.code}, ${error.message}`);
    }

    setOBS(obs);
    setUpdate(Date.now());
  };

  createEffect(() => {
    if (lastUpdate() && startRecognition) {
      startRecognition();
    }
  });

  return (
    <CaptionsContext.Provider value={{ isCompatible, lastText, isConnectedToOBS } satisfies ContextReturn}>
      {props.children}
    </CaptionsContext.Provider>
  );
};

export const useCaptions = () => useContext(CaptionsContext) as ContextReturn;
