/* eslint-disable @typescript-eslint/indent */
import { useI18n } from '../../lang/useI18n';
import { useApp } from '../../components/modules/app/context/AppContext';
import { useGetGameByTwitchCategoryIdQuery } from '../../services/api/useGetGame';
import { Select, createOptions, createAsyncOptions } from '@thisbeyond/solid-select';
import { Config, addGameToLocaleGameList, getConfig, getSystem, setConfig } from '../../tauri';
import '@thisbeyond/solid-select/style.css';
import { createMemo, createSignal, onMount } from 'solid-js';
import zod from '../../lang/zod';
import { validator } from '@felte/validator-zod';
import { createForm } from '@felte/solid';
import { Button } from '../../components/atoms/Button';
import toast from 'solid-toast';
import { fetchGameResults } from '../../services/api/fetchGameResults';

const addGameSchema = zod.object({
  twitchCategoryId: zod.string().min(1),
  processName: zod.string().min(1),
});

export const Game = () => {
  const { t } = useI18n();

  const { detectedGame, processes } = useApp();
  const { token } = useApp();

  const queryVariables = createMemo(() => ({ gameId: detectedGame()?.twitchCategoryId, token: token() }));

  const query = useGetGameByTwitchCategoryIdQuery(queryVariables, {
    get enabled() {
      return (
        !!token() &&
        token()?.length > 0 &&
        !!detectedGame()?.twitchCategoryId &&
        detectedGame()?.twitchCategoryId?.length > 0
      );
    },
  });

  const notFoundOptions = [
    {
      value: 'nothing',
      label: t('pages.game.notFound.action.donothing'),
    },
    {
      value: 'clear',
      label: t('pages.game.notFound.action.clear'),
    },
    {
      value: 'justchatting',
      label: t('pages.game.notFound.action.justchatting'),
    },
  ];

  const [notFoundAction, setNotFoundAction] = createSignal();

  onMount(() => {
    (async () => {
      const config = await getConfig();

      setNotFoundAction(config.notFoundAction);
    })();
  });

  const { form, setData, isValid, reset } = createForm({
    extend: [validator({ schema: addGameSchema })],
    onSubmit: async (values: zod.infer<typeof addGameSchema>) => {
      await addGameToLocaleGameList({ twitchCategoryId: values.twitchCategoryId, processName: values.processName });

      try {
        const url = new URL('/twitch/games', 'https://api.lestudio.qlaffont.com');
        url.searchParams.append('token', token());

        let system;
        const currentSystem = await getSystem();
        switch (currentSystem) {
          case 'windows':
            system = 'win32';
            break;

          case 'mac':
            system = 'darwin';
            break;

          default:
            system = currentSystem;
            break;
        }

        url.searchParams.append('twitchCategoryId', values.twitchCategoryId);
        url.searchParams.append('processName', values.processName);
        url.searchParams.append('windowTitle', values.processName);
        url.searchParams.append('platform', system);

        await fetch(url.toString(), { method: 'PUT' });
        toast.success(t('pages.game.addGame.form.success'));
        reset();
      } catch (error) {
        toast.error(t('pages.game.addGame.form.error'));
      }
    },
  });

  const processData = createMemo(() => Array.from(new Set(processes() || [])));
  const processesOptions = createOptions(processData);
  const asyncTwitchCategoryOptions = createAsyncOptions(
    async (inputValue) => await fetchGameResults(inputValue, token()),
  );

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">{t('pages.game.title')}</h1>

      <div class="flex flex-wrap sm:flex-nowrap justify-center sm:justify-normal gap-5 items-center">
        <div>
          <div
            class="w-screen h-screen max-w-[110px] max-h-[150px] shadow-lg border-opacity-50 block bg-cover bg-center bg-gradient-to-b from-[#bdc3c7] to-[#2c3e50]"
            style={{
              'background-image': detectedGame()?.processName
                ? `url('${query.data?.data?.getTwitchGameFromId?.box_art_url
                    .replace(`{width}`, `110`)
                    .replace(`{height}`, `150`)}')`
                : undefined,
            }}
          />
        </div>

        <div>
          <p class="font-medium line-clamp-1 text-white">
            {detectedGame()?.processName ? query.data?.data?.getTwitchGameFromId?.name : t('pages.game.noDetected')}
          </p>
          <p class="italic text-md line-clamp-1 text-white">{detectedGame()?.processName?.toLowerCase()}</p>
          <p class="italic text-sm line-clamp-1 text-white">{detectedGame()?.twitchCategoryId}</p>
        </div>
      </div>

      <div class="space-y-2 max-w-xl">
        <h2 class="font-bold text-white">{t('pages.game.notFound.title')}</h2>

        <Select
          initialValue={notFoundOptions?.find((v) => v.value === notFoundAction())}
          options={notFoundOptions}
          format={(item) => item.label}
          onChange={(v) => {
            setConfig({
              notFoundAction: v.value,
            } as Partial<Config>);
            setNotFoundAction(v.value);
          }}
        />
      </div>

      <form use:form class="space-y-3 max-w-xl">
        <h2 class="font-bold text-white">{t('pages.game.addGame.title')}</h2>

        <div class="space-y-2">
          <label class="text-white">{t('pages.game.addGame.form.process')}</label>
          <Select
            {...processesOptions}
            onChange={(v) => {
              setData('processName', v);
            }}
          />
        </div>

        <div class="space-y-2">
          <label class="text-white">{t('pages.game.addGame.form.twitchCategoryId')}</label>
          {/* @ts-ignore */}
          <Select
            {...asyncTwitchCategoryOptions}
            format={(item) => item.label}
            onChange={(v) => {
              setData('twitchCategoryId', v.value);
            }}
          />
        </div>

        <div class="m-auto">
          <Button class="btn btn-accent btn-wide m-auto" type="submit" disabled={!isValid()}>
            {t('pages.game.addGame.form.action')}
          </Button>
        </div>
      </form>
    </div>
  );
};
